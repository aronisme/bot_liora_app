import { aiGenerate } from './ai';

const HEURISTIC = [
  'upload','desain','vector','ai art','shutterstock','adobe stock','teepublic',
  'metadata','tag','judul','deskripsi','bonus','firefly','earning','sales',
  'revisi','ditolak','approval','payout','paypal','payoneer','report','laporan',
  'task','tugas','progres','progress','on progress','sedang dikerjakan',
  'prompt','keyword','green screen','mockup','listing','jual','marketplace'
];

export function heuristicWork(text: string){
  const t = (text||'').toLowerCase();
  return HEURISTIC.some(k => t.includes(k));
}

export async function isWorkRelatedSmart(text: string){
  if (!text || !text.trim()) return { work:false, reason:'empty' };
  const sys = `Anda adalah klasifikator. Tugas: tentukan apakah teks berikut berkaitan dengan "pekerjaan microstock / produksi konten / upload / metadata / laporan kerja".
Balas HANYA JSON valid dengan schema:
{"work": true|false, "reason": "alasan singkat"}`;
  const user = `Teks:\n${text}\n\nKeluarkan JSON saja.`;
  try {
    const out = await aiGenerate(sys, user);
    const m = (out||'').match(/\{[\s\S]*\}/);
    const json = JSON.parse(m ? m[0] : out);
    if (typeof json.work === 'boolean') return { work: json.work, reason: json.reason || 'ai' };
  } catch(e){}
  return { work: heuristicWork(text), reason: 'heuristic' };
}
