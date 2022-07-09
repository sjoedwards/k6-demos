import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '10s',
  thresholds: {
    'checks{succeed:true}': ['rate>0.9'],
  },
};

export default function () {
  let res;
  res = http.get('http://httpbin.test.k6.io');
  check(
    res,
    {
      'status is 200': (r) => r.status == 200,
    },
    { succeed: 'true' }
  );

  sleep(1);
}
