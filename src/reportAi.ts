import { aiGenerate } from './ai';

export async function formatReportAI(raw: string, datetime?: string){
  const sys = `Kamu adalah asisten yang merapikan laporan microstock contributor.
Susun laporan ke format poin berikut:
- Tanggal:
- Kegiatan:
- Proses:
- Masalah:
- Tugas:
- Progres:
- Catatan lain:
Gunakan bahasa Indonesia, singkat-padat, tanpa tambahan di luar format.`;
  const user = `Datetime: ${datetime || new Date().toISOString()}

Isi laporan (bebas):
${raw}`;
  const out = await aiGenerate(sys, user);
  return (out||'').trim();
}

export async function mergeReportsAI(oldReport: string, newReport: string, datetime?: string){
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
Jika ada poin sama → gabungkan/akumulasikan, jangan duplikasi. Bahasa Indonesia.`;
  const user = `Datetime: ${datetime || new Date().toISOString()}

Laporan lama:
${oldReport}

Laporan baru:
${newReport}`;
  const out = await aiGenerate(sys, user);
  return (out||'').trim();
}
