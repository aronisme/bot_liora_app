<script lang="ts">
  import { onMount } from 'svelte';
  import { getOrCreateReport, resetReport } from '../db';
  let content = '';
  let updatedAt = 0;

  export async function refresh(){
    const r = await getOrCreateReport();
    content = r.content; updatedAt = r.updatedAt;
  }

  async function onReset() {
    if (confirm("Yakin mau reset laporan abadi? Semua data akan hilang.")) {
      const r = await resetReport();
      content = r.content;
      updatedAt = r.updatedAt;
      alert("✅ Laporan berhasil di-reset!");
    }
  }

  onMount(refresh);
</script>

<div class="panel">
  <h3>Laporan Abadi</h3>
  <div class="small">Terakhir diperbarui: {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}</div>
  <pre style="margin-top:8px">{content}</pre>

  <div style="margin-top:12px;display:flex;gap:8px">
    <button on:click={refresh}>🔄 Refresh</button>
    <button on:click={onReset} style="background:#ef4444;color:white;border:none">🗑️ Reset</button>
  </div>
</div>
