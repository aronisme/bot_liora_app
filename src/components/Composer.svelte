<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let text = '';

  function send() {
    if (text.trim().length === 0) return;
    dispatch('send', { text });
    text = '';
  }
</script>

<div class="flex items-center gap-2 w-full max-w-3xl mx-auto px-2">
  <!-- Emoji Button (opsional, bisa disembunyikan jika tidak dipakai) -->
  <button 
    class="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
    title="Emoji"
    disabled
  >
    😊
  </button>

  <!-- Input Pesan -->
  <input
    bind:value={text}
    on:keydown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }}
    type="text"
    placeholder="Tulis pesan..."
    class="w-full px-5 py-3.5 text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
  />

  <!-- Tombol Kirim -->
  <button 
    class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200"
    on:click={send}
    title="Kirim"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  </button>
</div>