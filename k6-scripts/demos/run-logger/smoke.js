import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '15s',

  thresholds: {
    // move these into load
    // http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    // 'group_duration{group:::signUp}': ['avg < 500'],
    'checks{succeed:true}': ['rate>0.9'],
  },
};

const BASE_URL = __ENV.BASE_URL;
const PASSWORD = 'test1234';

export default () => {
  group('signUp', function () {
    const getRandomEmail = () => {
      const randomStringOutput = randomString(10);
      const email = `${randomStringOutput}@test.com`;
      return email;
    };

    const loginRes = http.post(
      `${BASE_URL}/api/users/signup`,
      JSON.stringify({
        email: getRandomEmail(),
        password: PASSWORD,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

    check(loginRes, {
      'signed up successfully': (resp) => {
        console.log(resp.status);
        console.log(resp.body);
        return resp.status === 201;
      },
    });

    // const authHeaders = {
    //   headers: {
    //     Authorization: `Bearer ${loginRes.json('access')}`,
    //   },
    // };

    // const myObjects = http.get(`${BASE_URL}/my/crocodiles/`, authHeaders).json();
    // check(myObjects, { 'retrieved crocodiles': (obj) => obj.length > 0 });
    sleep(1);
  });
};
