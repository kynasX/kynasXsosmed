export default function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Metode tidak diizinkan' });
    }

    // Ambil password dari Vercel Environment Variables
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const { password } = request.body;

    if (password && password === ADMIN_PASSWORD) {
        // Jika benar, kirim "token" (bisa apa saja, ini contoh)
        response.status(200).json({ message: 'Login berhasil', token: 'RAHASIA_ADMIN_TOKEN_123' });
    } else {
        response.status(401).json({ message: 'Password yang Anda masukkan salah.' });
    }
}
