<script lang="ts">
  /**
   * Komponen untuk menampilkan satu gelembung pesan (chat bubble).
   * @prop {'user' | 'assistant' | 'system'} role - Peran pengirim pesan.
   * @prop {string} content - Isi teks dari pesan.
   */
  export let role: 'user' | 'assistant' | 'system' = 'user';
  export let content = '';
</script>

<div class="flex items-start gap-3 mb-4 transition-all duration-300"
     class:flex-row-reverse={role === 'user'}>
  
  <!-- Avatar -->
  <div class="flex-shrink-0 mt-1">
    {#if role === 'assistant'}
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
        <span class="text-white text-sm font-bold">L</span>
      </div>
    {:else if role === 'user'}
      <div class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shadow-sm">
        <span class="text-white text-sm font-medium">U</span>
      </div>
    {:else}
      <div class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
        <span class="text-gray-600 text-sm">⚙️</span>
      </div>
    {/if}
  </div>

  <!-- Message Content -->
  <div class="max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
    <div class="text-xs font-medium text-gray-500 mb-1">
      {role === 'assistant' ? 'Liora' : role === 'user' ? 'Anda' : 'Sistem'}
    </div>
    
    <div
      class="px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed text-gray-800 shadow-sm"
      class:bg-blue-50={role === 'assistant'}
      class:bg-gray-100={role === 'system'}
      class:bg-indigo-50={role === 'user'}
    >
      {content}
    </div>
  </div>
</div>