import http from 'k6/http';
import { check, sleep, Counter } from 'k6';

const CLICKHOUSE_URL = 'http://<alamat_ip_clickhouse>:8123'; // Alamat IP ClickHouse
const USERNAME = '<username>'; // Ganti dengan username ClickHouse
const PASSWORD = '<password>'; // Ganti dengan password ClickHouse
const QUERY = 'SELECT * FROM <nama_tabel> LIMIT 100'; // Ganti dengan query yang ingin kamu uji

// Metrik untuk menghitung permintaan
const requests = new Counter('requests');

export const options = {
    vus: 10, // Jumlah virtual users
    duration: '30s', // Durasi pengujian
};

export default function () {
    const headers = {
        'Content-Type': 'text/plain',
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
    };

    const response = http.post(CLICKHOUSE_URL, QUERY, { headers });

    // Cek status code dan waktu respons
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time is < 200ms': (r) => r.timings.duration < 200,
    });

    // Menambahkan 1 ke metrik requests
    requests.add(1);

    sleep(1); // Tidur sejenak sebelum melakukan request berikutnya
}
