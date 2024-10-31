import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 30, // Jumlah virtual users
    duration: '2m', // Durasi test
};

export default function () {
    const headers = {
        'Content-Type': 'text/plain',
        'Authorization': 'Basic ' + btoa(`${__ENV.USERNAME}:${__ENV.PASSWORD}`)
    };
    const response = http.post(`${__ENV.CLICKHOUSE_URL}`, 'SELECT COUNT(*) FROM my_table', { headers });

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);
}

#k6 run --env USERNAME=myusername --env PASSWORD=mypassword --env CLICKHOUSE_URL=http://your_clickhouse_server:8123 script.js
