import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 1, // 1 user looping for 15 seconds
  duration: '15s',

  thresholds: {
    // 99.9% of Response status from signin/up, get user, get races, post race) must be 2xx, even at 9 VU's (500/60 = 9)
    checks: ['rate>0.999'],
    // 99.9% of Group request time will be less than 10 seconds.
    // 99.5% of Group request time will be less than 5 seconds.
    'group_duration{group:::signInGetRacesPostRace}': [
      'p(99.9) < 10000',
      'p(99.5) < 5000',
    ],
    // Extra: 99.5% individual requests should respond in less than 1 second
    http_req_duration: ['p(99.5) < 1000'],
  },
};

const BASE_URL = __ENV.BASE_URL;
console.log('🚀 ~ file: smoke.js ~ line 24 ~ BASE_URL', BASE_URL);
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

    sleep(1);
  });
};

export function teardown(data) {
  console.log(JSON.stringify(data));
}
