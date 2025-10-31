<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let text = '';
  function send(){
    if (!text.trim()) return;
    dispatch('send', { text });
    text = '';
  }
  function key(e: KeyboardEvent){
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault(); send();
    }
  }
</script>
<div class="composer">
  <textarea rows="4" bind:value={text} on:keydown={key} placeholder="Tulis apa saja. Deteksi kerjaan pakai AI, lalu disusun & merge ke laporan jika relevan."></textarea>
  <button class="primary" on:click={send}>Kirim</button>
</div>
