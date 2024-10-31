import http from 'k6/http';
import { check, sleep, Counter } from 'k6';

const CLICKHOUSE_URL = 'http://<alamat_ip_clickhouse>:8123'; // Pastikan ini adalah URL lengkap, seperti "http://localhost:8123"
const USERNAME = '<username>'; // Isi dengan username ClickHouse
const PASSWORD = '<password>'; // Isi dengan password ClickHouse
const QUERY = 'SELECT * FROM <nama_tabel> LIMIT 100'; // Isi dengan query yang valid

const requests = new Counter('requests');

export const options = {
    vus: 10, // Jumlah virtual users
    duration: '30s', // Durasi pengujian
};

export default function () {
    // Pastikan semua nilai konfigurasi sudah terisi
    if (!CLICKHOUSE_URL || !USERNAME || !PASSWORD || !QUERY) {
        console.error("Konfigurasi tidak lengkap. Periksa URL, USERNAME, PASSWORD, atau QUERY.");
        return;
    }

    // Membuat header otentikasi
    const headers = {
        'Content-Type': 'text/plain',
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
    };

    const params = { headers: headers };

    // Lakukan POST request
    const response = http.post(CLICKHOUSE_URL, QUERY, params);

    // Debugging
    console.log(`Status: ${response.status}`);
    console.log(`Body: ${response.body}`);

    check(response, {
        'status is 200': (r) => r && r.status === 200,
        'response time is < 200ms': (r) => r && r.timings.duration < 200,
    });

    requests.add(1);
    sleep(1);
}
