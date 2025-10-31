# Liora Report AI — Smart Detect (OpenRouter/Groq)

**Deteksi kerjaan pakai AI** + fallback heuristic.
Pesan kerjaan → AI format & merge ke laporan abadi. 
Laporan penuh selalu dikirim sebagai memori *internal* ke AI (tidak spam UI).

## Jalankan
```bash
npm i
npm run dev
# http://localhost:5173
```

## Setup
Buka **Settings** → pilih **OpenRouter** atau **GROQ** → isi API key + model.
- OpenRouter default: `google/gemini-2.0-flash-exp:free`
- GROQ default: `llama-3.3-70b-versatile`

## Alur
1. User chat → `isWorkRelatedSmart()` minta AI klasifikasikan, balasan JSON: `{"work":true/false}`
2. Jika `work=true`, app:
   - `formatReportAI()` → susun laporan poin
   - `mergeReportsAI()` → gabungkan laporan lama+baru
   - Simpan ke IndexedDB (id=1) dan tampilkan snapshot ringkas di chat
3. Asisten balas; laporan penuh selalu dipakai sebagai **memori internal** (hidden).
"# bot_liora_app" 
