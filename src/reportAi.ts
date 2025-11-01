import { aiGenerate } from './ai';

/**
 * mergeReportsAI (versi revisi ringkas)
 * ---------------------------------------
 * - AI memperbarui laporan lama berdasarkan pesan terbaru user.
 * - Tidak memperpanjang laporan atau membuat paragraf tambahan.
 * - Fokus hanya pada bagian relevan (jumlah, folder, akun, proyek, status, dll).
 * - Jika tidak ada bagian cocok, tambahkan entri baru secara singkat dan padat.
 * - Semua informasi penting dari laporan lama HARUS dipertahankan.
 * ---------------------------------------
 */
export async function mergeReportsAI(oldReport: string, userText: string, datetime?: string) {
  const sys = `Kamu adalah asisten AI yang memperbarui laporan kerja microstock contributor.

Tugas utama:
1. Gunakan laporan lama sebagai dasar.
2. Jika pesan baru mengandung update (contoh: jumlah, status, nama folder, akun, proyek, progress),
   ubah bagian tersebut secara ringkas dan tepat.
3. Jika bagian relevan tidak ditemukan, tambahkan entri baru yang pendek tapi bermakna.
4. Jangan memperpanjang laporan dengan kalimat tambahan.
5. Pastikan detail penting seperti jumlah file dan nama folder, akun, proyek, dan status TIDAK dihapus.
6. Gunakan bahasa Indonesia profesional, singkat, dan mudah dibaca.

Format laporan WAJIB dipertahankan:
- Tanggal:
- Kegiatan:
- Proses:
- Masalah:
- Tugas:
- Progres:
- Catatan lain:`;

  const user = `Datetime: ${datetime || new Date().toISOString()}

Laporan lama:
${oldReport}

Pesan baru:
${userText}

Hasil laporan setelah diperbarui secara ringkas:`;

  const out = await aiGenerate(sys, user);
  return (out || '').trim();
}
