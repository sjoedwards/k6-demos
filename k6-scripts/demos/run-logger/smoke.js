import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 1, // 1 user looping for 30 seconds
  duration: '15s',

  thresholds: {
    checks: ['rate>0.99'],
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
      signUpSuccess: (resp) => {
        return resp.status === 201;
      },
    });

    sleep(1);
  });
};

export function teardown(data) {
  console.log(JSON.stringify(data));
}
