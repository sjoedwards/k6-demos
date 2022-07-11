import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  // Ideally - this would be 5-20 minutes long, not 1
  scenarios: {
    signInGetRacesPostRace: {
      executor: 'ramping-vus',
      // Start with 0 'users'
      startVUs: 0,
      stages: [
        { duration: '15s', target: 5 },
        { duration: '15s', target: 5 },
        { duration: '15s', target: 10 },
        { duration: '15s', target: 10 },
        { duration: '15s', target: 20 },
        { duration: '15s', target: 20 },
        { duration: '15s', target: 40 },
        { duration: '15s', target: 40 },
        { duration: '15s', target: 80 },
        { duration: '15s', target: 80 },
        { duration: '15s', target: 160 },
        { duration: '15s', target: 160 },
        { duration: '15s', target: 320 },
        { duration: '15s', target: 320 },
        { duration: '15s', target: 640 },
        { duration: '15s', target: 640 },
        { duration: '60s', target: 0 },
      ],
    },
  },
  thresholds: {
    // 99.9% of Response status from signin/up, get user, get races, post race) must be 2xx, even at max concurrent 'users'
    checks: ['rate>0.999'],
    // 99% of Group request time will be less than 10 seconds.
    // 95% of Group request time will be less than 8 seconds.
    'group_duration{group:::signInGetRacesPostRace}': [
      'p(99) < 10000',
      'p(95) < 80000',
    ],
    // Extra: 95% individual requests should respond in less than 1.5 second
    http_req_duration: ['p(95) < 1500'],
  },
};

const BASE_URL =
  __ENV.ENVIRONMENT === 'local'
    ? 'http://localhost:3001'
    : 'https://run-logger-demo.herokuapp.com';
const PASSWORD = 'test1234';

export default () => {
  group('signInGetRacesPostRace', function () {
    const getRandomEmail = () => {
      const randomStringOutput = randomString(10);
      const email = `${randomStringOutput}@test.com`;
      return email;
    };

    const randomEmail = getRandomEmail();

    const signUpRes = http.post(
      `${BASE_URL}/api/users/signup`,
      JSON.stringify({
        email: randomEmail,
        password: PASSWORD,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const signInRes = http.post(
      `${BASE_URL}/api/users/signin`,
      JSON.stringify({
        email: randomEmail,
        password: PASSWORD,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

    const race = {
      raceName: `${randomEmail}'s First Race`,
      length: 3,
      time: 30,
    };

    const postRaceRes = http.post(
      `${BASE_URL}/api/races`,
      JSON.stringify(race),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const getRacesRes = http.get(`${BASE_URL}/api/races/me`);

    check(signUpRes, {
      signUpSuccess: (resp) => {
        return resp.status === 201;
      },
    });

    check(signInRes, {
      signInSuccess: (resp) => {
        return resp.status === 200;
      },
    });

    check(postRaceRes, {
      postRaceSuccess: (resp) => {
        return resp.status === 201;
      },
    });

    check(getRacesRes, {
      getRacesSuccess: (resp) => {
        return resp.status === 200;
      },
    });
  });
  sleep(1);
};
