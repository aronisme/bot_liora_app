import { aiGenerate } from './ai';

/**
 * isWorkRelatedSmart (versi otomatis penuh)
 * ----------------------------------------
 * Fungsi ini sepenuhnya berbasis AI, tanpa fallback manual.
 * Model bertugas menentukan:
 *  - Apakah teks berkaitan dengan pekerjaan microstock.
 *  - Alasan singkat.
 *  - Intent spesifik (update, progress, problem, report, general).
 * ----------------------------------------
 */
export async function isWorkRelatedSmart(text: string) {
  if (!text || !text.trim()) {
    return { work: false, reason: 'empty', intent: 'none' };
  }

  const sys = `Anda adalah sistem deteksi konteks otomatis untuk asisten kerja AI.
Tugas Anda:
1. Analisis teks user dan tentukan apakah berhubungan dengan pekerjaan microstock / upload / metadata / laporan kerja.
2. Jika iya, identifikasi intent-nya:
   - "update" → jika menunjukkan perubahan status (misal: sudah diunggah, sudah selesai, sudah disetujui)
   - "progress" → jika menunjukkan pekerjaan sedang berjalan
   - "problem" → jika menunjukkan masalah atau penolakan
   - "report" → jika berkaitan dengan catatan, hasil kerja, laporan, atau tugas
   - "general" → jika masih seputar kerja tapi tidak spesifik
3. Jika tidak relevan dengan pekerjaan, set "work": false dan "intent": "none".

Jawaban WAJIB dalam format JSON valid:
{"work": true|false, "reason": "string", "intent": "update|progress|problem|report|general|none"}`;

  const user = `Teks user:
${text}

Keluarkan JSON valid tanpa tambahan lain:`;

  try {
    const out = await aiGenerate(sys, user);
    const jsonMatch = (out || '').match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : out);

    return {
      work: !!parsed.work,
      reason: parsed.reason || 'ai',
      intent: parsed.intent || (parsed.work ? 'general' : 'none')
    };
  } catch (e: any) {
    console.error('❌ Gagal klasifikasi AI:', e);
    // Jika AI gagal total, default ke non-work
    return { work: false, reason: 'ai_error', intent: 'none' };
  }
}
