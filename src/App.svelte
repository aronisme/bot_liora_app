<script lang="ts">
  // [LOGIKA DIPERLUAS: PERSISTENSI CHAT + CHAT BARU]
  import { onMount, afterUpdate } from 'svelte';
  import Composer from './components/Composer.svelte';
  import MessageItem from './components/MessageItem.svelte';
  import ReportPanel from './components/ReportPanel.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import { getOrCreateReport, db } from './db';
  import { formatReportAI, mergeReportsAI } from './reportAi';
  import { isWorkRelatedSmart } from './workDetect';
  import { aiGenerate } from './ai';

  // --- Persistensi Chat ---
  const CHAT_STORAGE_KEY = 'liora_messages_v2';

  function saveMessagesToStorage(messages: any[]) {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Gagal simpan chat ke localStorage', e);
    }
  }

  function loadMessagesFromStorage(): any[] {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Gagal muat chat dari localStorage', e);
      return [];
    }
  }

  // Inisialisasi dari storage
  let messages = loadMessagesFromStorage();

  // Simpan otomatis saat messages berubah
  $: saveMessagesToStorage(messages);

  // --- State UI ---
  let settingsOpen = false;
  let reportPanelOpen = false;
  let reportRef: any;

  // --- Auto-scroll logic ---
  let chatContainer: HTMLElement;
  let isAtBottom = true;

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = chatContainer;
    isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
  }

  afterUpdate(() => {
    if (isAtBottom) {
      chatContainer?.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  });

  // --- Existing logic ---
  let notifSound: HTMLAudioElement | null = null;
  const SOUND_SRC = '/notif.wav';

  function pingSound() {
    try {
      notifSound?.pause();
      notifSound!.currentTime = 0;
      notifSound?.play().catch(() => {});
    } catch {}
  }

  function desktopNotify(title: string, body: string) {
    if (document.hasFocus()) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: body.slice(0, 160), icon: '/icon.png' });
    }
  }

  onMount(() => {
    notifSound = new Audio(SOUND_SRC);
    notifSound.volume = 0.5;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    if (window.innerWidth >= 768) {
      reportPanelOpen = true;
    }
  });

  async function onSend(e: any) {
    const text = e.detail.text;
    messages = [...messages, { role: 'user', content: text }];

    let work = false;
    let reason = 'unknown';
    try {
      const c = await isWorkRelatedSmart(text);
      work = !!c.work;
      reason = c.reason || 'ai';
    } catch {}

    if (work) {
      try {
        const formatted = await formatReportAI(text, new Date().toISOString());
        const base = await getOrCreateReport();
        const merged = await mergeReportsAI(base.content, formatted, new Date().toISOString());
        await db.report.put({ id: 1, content: merged, updatedAt: Date.now() });
        messages = [...messages, { role: 'system', content: '📄 Laporan diperbarui (deteksi: ' + reason + '):\n' + merged }];
      } catch (err: any) {
        messages = [...messages, { role: 'assistant', content: '⚠️ Gagal update laporan: ' + (err?.message || 'ERR') }];
        pingSound();
        desktopNotify('Liora (Gagal Update)', String(err?.message || 'ERR'));
      }
    }

    try {
      const r = await getOrCreateReport();

// Gaya prompt ala chat WhatsApp
const sys = `
Kamu adalah Liora — asisten AI dengan gaya Gen Z, visioner, opini tegas, tapi tetap santai dan asik.
Gunakan bahasa Indonesia sehari-hari kayak ngobrol di WhatsApp, jangan terlalu formal.
Tiap jawaban harus terasa natural kayak lagi chat antara dua orang yang akrab.
Konteks kerja (buat bantu jawab kalau terkait tugas):
${r.content}

Format percakapan:
(jawabanmu)
`;

const userPrompt = `[Aron]: ${text}\n Liora:`;

const out = await aiGenerate(sys, userPrompt);

      messages = [...messages, { role: 'assistant', content: out }];
      pingSound();
      desktopNotify('Liora', out);
    } catch (e: any) {
      messages = [...messages, { role: 'assistant', content: '⚠️ Gagal minta jawaban AI: ' + (e?.message || 'ERR') }];
      pingSound();
      desktopNotify('Liora (AI Error)', String(e?.message || 'ERR'));
    }

    reportRef?.refresh();
  }

  function toggleReportPanel() {
    reportPanelOpen = !reportPanelOpen;
  }

  // --- Chat Baru ---
  function startNewChat() {
    if (messages.length > 0 && !confirm('Mulai chat baru? Riwayat saat ini akan disimpan otomatis.')) {
      return;
    }
    messages = [];
    // Opsional: reset laporan juga? Tidak, biarkan terpisah.
  }
</script>

<div class="h-screen bg-white text-gray-800 flex">
  <div class="flex flex-1 overflow-hidden">
    
    <!-- Panel Laporan (Desktop) -->
    <section 
      class="hidden md:block overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0"
      class:w-0={!reportPanelOpen}
      class:w-[40%]={reportPanelOpen}
      class:lg:w-[30%]={reportPanelOpen}
      class:xl:w-[25%]={reportPanelOpen}
    >
      {#if reportPanelOpen}
        <div class="p-5 h-full">
          <h3 class="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <span class="text-blue-600">📄</span> Laporan Kerja (Real-time)
          </h3>
          <ReportPanel bind:this={reportRef} />
        </div>
      {/if}
    </section>
    
    <!-- Area Chat Utama -->
    <aside class="flex flex-col w-full md:w-[60%] lg:w-[70%] xl:w-[75%] border-l border-gray-100 bg-white flex-shrink-0">
      
      <!-- Header -->
      <header class="navbar bg-white border-b border-gray-100 px-5 py-3 shadow-sm">
        <div class="flex-1">
          <span class="text-xl font-bold text-blue-600">Liora.ai</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Tombol Chat Baru -->
          <button 
            class="btn btn-sm btn-ghost hidden md:flex text-gray-600 hover:text-gray-900"
            on:click={startNewChat}
            title="Mulai chat baru"
          >
            💬 Chat Baru
          </button>

          <!-- Tombol laporan mobile -->
          <button class="btn btn-sm btn-ghost md:hidden" on:click={toggleReportPanel} title="Buka Laporan">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </button>
          
          <!-- Pengaturan -->
          <button class="btn btn-sm btn-ghost" on:click={() => (settingsOpen = true)} title="Pengaturan">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37h.001z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
          
          <!-- Toggle laporan (desktop) -->
          <button 
            class="btn btn-sm btn-ghost hidden md:flex text-gray-600 hover:text-gray-900 font-medium"
            on:click={toggleReportPanel}
            title={reportPanelOpen ? 'Sembunyikan Laporan' : 'Tampilkan Laporan'}
          >
            {reportPanelOpen ? 'Sembunyikan' : 'Laporan'}
          </button>
        </div>
      </header>

      <!-- Chat Messages -->
      <main 
        class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
        bind:this={chatContainer}
        on:scroll={handleScroll}
      >
        {#if messages.length === 0}
          <div class="text-center text-gray-500 py-10">
            <div class="text-2xl mb-2">👋</div>
            <p class="text-sm">Mulai percakapan dengan Liora!</p>
          </div>
        {:else}
          {#each messages as m}
            <MessageItem role={m.role} content={m.content} />
          {/each}
        {/if}
      </main>

      <!-- Input Composer -->
      <footer class="border-t border-gray-100 bg-white p-4">
        <Composer on:send={onSend} />
      </footer>
    </aside>
  </div>
</div>

<!-- Drawer Laporan (Mobile) -->
<div class="drawer drawer-start md:hidden" class:open={reportPanelOpen}>
  <input id="report-drawer" type="checkbox" class="drawer-toggle" bind:checked={reportPanelOpen} />
  <div class="drawer-side z-[999]">
    <label for="report-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="menu p-5 w-80 min-h-full bg-white text-gray-800 shadow-xl border-r border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <span class="text-blue-600">📄</span> Laporan Kerja
        </h2>
        <button 
          class="btn btn-sm btn-ghost text-gray-600"
          on:click={startNewChat}
          title="Chat Baru"
        >
          💬
        </button>
      </div>
      <ReportPanel bind:this={reportRef} />
    </div>
  </div>
</div>

<SettingsModal bind:open={settingsOpen} />

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
  }
</style>