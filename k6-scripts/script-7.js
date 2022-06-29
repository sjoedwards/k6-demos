import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

import { group } from 'k6';

export const options = {
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    'group_duration{group:::frontPage}': ['avg < 500'],
    'http_req_duration{staticAsset:yes}': ['p(95)<100'],
    check_failure_rate: ['rate<0.3'],
  },
};

let checkFailureRate = new Rate('check_failure_rate');

export default function () {
  group('frontPage', function () {
    let res = null;
    // As mentioned above, this logic just forces the performance alert for too many urls, use env URL_ALERT to force it
    // It also highlights the ability to programmatically do things right in your script
    res = http.get('http://test.k6.io');

    let checkRes = check(res, {
      'Homepage welcome header present': (r) =>
        r.body.includes('Welcome to the k6.io demo site!'),
    });

    checkFailureRate.add(!checkRes);
  });
}
