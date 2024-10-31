import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const CLICKHOUSE_URL = 'http://31.220.31.4:8124'; // Ganti dengan alamat IP dan port ClickHouse Anda
const USERNAME = 'default'; // Ganti dengan username ClickHouse
const PASSWORD = ''; // Ganti dengan password ClickHouse
const QUERY = 'SELECT * from sample_db.visit_log'; // Ganti dengan query yang ingin Anda uji

export const options = {
    vus: 10, // Jumlah virtual users
    duration: '1m', // Durasi pengujian, misal 1 menit
};

export default function () {
    // Membuat URL dengan query sebagai parameter
    const url = `${CLICKHOUSE_URL}/?query=${encodeURIComponent(QUERY)}`;

    // Encode username dan password ke Base64
    const authHeader = `Basic ${encoding.b64encode(`${USERNAME}:${PASSWORD}`)}`;

    // Menyiapkan header otentikasi
    const headers = {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Mengirim request GET ke ClickHouse
    const response = http.get(url, { headers: headers });

    // Memeriksa apakah response sukses (status 200)
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    // Waktu jeda antar request
    sleep(1);
}
