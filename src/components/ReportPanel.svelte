<script lang="ts">
  import { onMount } from 'svelte';
  import { getOrCreateReport, resetReport } from '../db';

  let content = '';
  let updatedAt = 0;

  export async function refresh() {
    const r = await getOrCreateReport();
    content = r.content;
    updatedAt = r.updatedAt;
  }

  async function onReset() {
    if (confirm('Yakin mau reset laporan abadi? Semua data akan hilang.')) {
      const r = await resetReport();
      content = r.content;
      updatedAt = r.updatedAt;
      alert('✅ Laporan berhasil di-reset!');
    }
  }

  onMount(refresh);
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="mb-3">
    <h3 class="text-lg font-semibold text-gray-800">Laporan Abadi</h3>
    <p class="text-xs text-gray-500 mt-1">
      Terakhir diperbarui: {updatedAt ? new Date(updatedAt).toLocaleString('id-ID') : '-'}
    </p>
  </div>

  <!-- Area Scrollable untuk Konten -->
  <div class="flex-1 overflow-y-auto custom-scrollbar mb-4">
    <div 
      class="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200"
      style="min-height: 100px;"
    >
      {#if content}
        {content}
      {:else}
        <span class="text-gray-400 italic">Belum ada laporan.</span>
      {/if}
    </div>
  </div>

  <!-- Tombol Tetap di Bawah (tidak ikut scroll) -->
  <div class="flex gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
    <button
      on:click={refresh}
      class="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
    >
      🔄 Refresh
    </button>
    <button
      on:click={onReset}
      class="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition"
    >
      🗑️ Reset
    </button>
  </div>
</div>

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