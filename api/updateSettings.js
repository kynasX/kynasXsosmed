import { Octokit } from "@octokit/rest";

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Metode tidak diizinkan.' });
    }

    try {
        // --- Keamanan Sederhana ---
        const authHeader = request.headers.authorization;
        if (!authHeader || authHeader !== 'Bearer RAHASIA_ADMIN_TOKEN_123') {
            return response.status(401).json({ message: 'Akses ditolak.' });
        }
        
        // Ambil SEMUA data baru yang dikirim dari admin.html
        const updatedSettings = request.body;
        
        if (!updatedSettings || !updatedSettings.profile) {
            return response.status(400).json({ message: 'Data yang dikirim tidak lengkap.' });
        }

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO_OWNER = process.env.REPO_OWNER;
        const REPO_NAME = process.env.REPO_NAME;
        const FILE_PATH = 'setting.json'; // Path ke file setting.json kita

        const octokit = new Octokit({ auth: GITHUB_TOKEN });

        // 1. Ambil file yang ada (untuk dapat SHA)
        const { data: fileData } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
        });

        // 2. Update file di GitHub dengan konten baru
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
            message: 'chore: Update data linktree via admin panel', // Pesan commit
            content: Buffer.from(JSON.stringify(updatedSettings, null, 4)).toString('base64'),
            sha: fileData.sha, // SHA wajib ada untuk update
        });

        response.status(200).json({ message: 'Pengaturan berhasil disimpan!' });

    } catch (error) {
        console.error("Error updateSettings:", error);
        response.status(500).json({ message: 'Terjadi kesalahan di server.', error: error.message });
    }
}
