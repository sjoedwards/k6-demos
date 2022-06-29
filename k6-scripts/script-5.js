import http from 'k6/http';

// Less than 1% of requests return an error.
// 95% of requests have a response time below 250ms.
// 99% of requests have a response time below 400ms.
// A specific endpoint always responds within 300ms.
export const options = {
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<250', 'p(99)<400'], // 95% of ALL requests should be below 250ms & 99% of requests have a response time below 400ms.
    'http_req_duration{name:I am a little slow}': ['p(95)<350'], // 95% of ONLY certain requests should be below 300
  },
};

export default function () {
  http.get('https://test-api.k6.io/public/crocodiles/1/');

  http.get('https://test-api.k6.io/public/crocodiles/2/', {
    tags: { name: 'I am a little slow' },
  });
}
