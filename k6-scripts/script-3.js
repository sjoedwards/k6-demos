import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Ramp to 20 over 30 seconds
    { duration: '30s', target: 20 },
    // Ramp down to 10 over the next 1.5 minutes
    { duration: '1m30s', target: 10 },
    // Ramp to 0 over the final 20 minutes
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
