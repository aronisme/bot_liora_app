import { aiGenerate } from './ai';
export async function formatReportAI(raw: string, datetime?: string) {
  const sys = `Kamu adalah asisten yang merapikan laporan microstock contributor.
Susun laporan ke format poin berikut:
- Tanggal:
- Kegiatan:
- Proses:
- Masalah:
- Tugas:
- Progres:
- Catatan lain:

Catatan penting:
• Jika dalam isi laporan ada nama akun, folder, proyek, atau catatan spesifik → sebutkan secara eksplisit.
• Jika tidak disebut, tulis “(tidak disebut)” agar laporan tetap konsisten.
• Gunakan bahasa Indonesia yang singkat-padat, tanpa tambahan di luar format.`

  const user = `Datetime: ${datetime || new Date().toISOString()}

Isi laporan (bebas):
${raw}`

  const out = await aiGenerate(sys, user)
  return (out || '').trim()
}

export async function mergeReportsAI(oldReport: string, newReport: string, datetime?: string) {
  const sys = `Kamu adalah asisten yang menggabungkan laporan microstock contributor.
Gabungkan "laporan lama" + "laporan baru" jadi satu laporan lengkap.
Format WAJIB sama:
- Tanggal:
- Kegiatan:
- Proses:
- Masalah:
- Tugas:
- Progres:
- Catatan lain:

Aturan:
• Jika poin sama (misal akun, folder, atau kegiatan) → gabungkan jadi satu baris dengan konteks lengkap.
• Jangan duplikasi isi.
• Bahasa Indonesia singkat dan padat.`

  const user = `Datetime: ${datetime || new Date().toISOString()}

Laporan lama:
${oldReport}

Laporan baru:
${newReport}`

  const out = await aiGenerate(sys, user)
  return (out || '').trim()
}
