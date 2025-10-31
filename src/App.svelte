<script lang="ts">
  import { onMount } from 'svelte';
  import Composer from './components/Composer.svelte';
  import MessageItem from './components/MessageItem.svelte';
  import ReportPanel from './components/ReportPanel.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import { getOrCreateReport, db } from './db';
  import { formatReportAI, mergeReportsAI } from './reportAi';
  import { isWorkRelatedSmart } from './workDetect';
  import { aiGenerate } from './ai';

  let messages: {role:'user'|'assistant'|'system', content:string}[] = [];
  let settingsOpen = true;
  let reportRef: any;

  // ---- NOTIFIKASI & SUARA ----
  let notifSound: HTMLAudioElement | null = null;
  const SOUND_SRC = '/notif.wav'; // taruh file kamu di /public/notif.wav

  function pingSound() {
    try {
      notifSound?.pause();
      notifSound!.currentTime = 0;
      notifSound?.play().catch(() => {});
    } catch {}
  }

  function desktopNotify(title: string, body: string) {
    if (document.hasFocus()) return; // kalau tab aktif, gak usah spam notif
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body.slice(0, 160),
        icon: '/icon.png' // opsional: letakkan icon di /public/icon.png
      });
    }
  }

  onMount(() => {
    // siapkan audio
    notifSound = new Audio(SOUND_SRC);
    notifSound.volume = 0.5;

    // minta izin notifikasi sekali di awal
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // iOS/Chrome policy: audio biasanya perlu 1x interaksi user dulu
    // user menekan tombol Kirim nanti sudah cukup
  });

  async function onSend(e:any){
    const text = e.detail.text;
    messages = [...messages, { role:'user', content: text }];

    // SMART DETECTION (AI + fallback)
    let work = false; let reason = 'unknown';
    try {
      const c = await isWorkRelatedSmart(text);
      work = !!c.work; reason = c.reason || 'ai';
    } catch {}

    if (work){
      try {
        const formatted = await formatReportAI(text, new Date().toISOString());
        const base = await getOrCreateReport();
        const merged = await mergeReportsAI(base.content, formatted, new Date().toISOString());
        await db.report.put({ id:1, content: merged, updatedAt: Date.now() });

        // catatan: system disembunyikan di UI (lihat {#if m.role !== 'system'})
        messages = [...messages, { role:'system', content: '📄 Laporan diperbarui (deteksi: '+reason+'):\n'+merged }];
      } catch (err:any){
        messages = [...messages, { role:'assistant', content: '⚠️ Gagal update laporan: '+(err?.message||'ERR') }];
        // bunyikan suara + notif walau error supaya kamu sadar
        pingSound();
        desktopNotify('Liora (Gagal Update)', String(err?.message || 'ERR'));
      }
    }

    try {
      const r = await getOrCreateReport();
      const sys = `Nama asisten: Liora. Gaya Gen Z, visioner, opini tegas. Bahasa: Indonesia.
KONTEKS KERJA (laporan penuh, memori internal — jangan tampilkan ke user):
${r.content}`;
      const out = await aiGenerate(sys, text);
      messages = [...messages, { role:'assistant', content: out }];

      // 🔔 trigger suara & notif ketika ada balasan asisten
      pingSound();
      desktopNotify('Liora', out);
    } catch (e:any){
      const msg = '⚠️ Gagal minta jawaban AI: '+(e?.message||'ERR');
      messages = [...messages, { role:'assistant', content: msg }];
      pingSound();
      desktopNotify('Liora (AI Error)', String(e?.message || 'ERR'));
    }

    reportRef?.refresh();
  }
</script>

<div class="row">
  <div class="left">
    <div class="topbar">
      <span class="pill">Liora Report AI — Smart Detect</span>
      <button on:click={()=> settingsOpen = true}>⚙️ Settings</button>
      <span class="small" style="margin-left:auto">Data lokal • IndexedDB</span>
    </div>

    <div class="messages">
      {#each messages as m}
        {#if m.role !== 'system'}
          <MessageItem role={m.role} content={m.content}/>
        {/if}
      {/each}
    </div>

    <Composer on:send={onSend}/>
  </div>
  <div class="right">
    <ReportPanel bind:this={reportRef}/>
  </div>
</div>

<SettingsModal bind:open={settingsOpen}/>
