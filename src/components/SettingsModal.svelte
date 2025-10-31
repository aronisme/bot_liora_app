<script lang="ts">
  import { loadSettings, setProvider, setOpenRouter, setGroq } from '../settings';
  import { setOpenRouterConfig } from '../providers/openRouter';
  import { setGroqConfig } from '../providers/groq';

  export let open = false;

  let provider: 'openrouter' | 'groq' = 'openrouter';
  let orKey = '';
  let orModel = 'google/gemini-2.0-flash-exp:free';
  let gqKey = '';
  let gqModel = 'llama-3.3-70b-versatile';

  function init() {
    const s = loadSettings();
    provider = s.provider as any;
    orKey = s.orKey;
    orModel = s.orModel;
    gqKey = s.gqKey;
    gqModel = s.gqModel;
    setProvider(provider);
    setOpenRouter(orKey, orModel);
    setOpenRouterConfig(orKey, orModel);
    setGroq(gqKey, gqModel);
    setGroqConfig(gqKey, gqModel);
  }

  init();

  function save() {
    setProvider(provider);
    setOpenRouter(orKey, orModel);
    setOpenRouterConfig(orKey, orModel);
    setGroq(gqKey, gqModel);
    setGroqConfig(gqKey, gqModel);
    open = false;
  }
</script>

{#if open}
  <!-- Overlay transparan lembut -->
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
    
    <!-- Modal modern -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
      
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>⚙️</span> Pengaturan AI Provider
        </h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 space-y-5">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Provider</label>
          <select 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            bind:value={provider}
          >
            <option value="openrouter">OpenRouter (Rekomendasi)</option>
            <option value="groq">GROQ (Performa Tinggi)</option>
          </select>
        </div>
        
        {#if provider === 'openrouter'}
          <div class="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <h4 class="font-medium text-gray-800">Konfigurasi OpenRouter</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
              <input 
                type="text" 
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                bind:value={orModel} 
                placeholder="google/gemini-2.0-flash-exp:free"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">OPENROUTER_API_KEY</label>
              <input 
                type="password" 
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                bind:value={orKey} 
                placeholder="sk-or-..."
              />
            </div>
          </div>
        {:else}
          <div class="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <h4 class="font-medium text-gray-800">Konfigurasi GROQ</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
              <input 
                type="text" 
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                bind:value={gqModel} 
                placeholder="llama-3.3-70b-versatile"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">GROQ_API_KEY</label>
              <input 
                type="password" 
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                bind:value={gqKey} 
                placeholder="gsk_..."
              />
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <p class="text-xs text-gray-500">
          Kunci API disimpan di LocalStorage perangkatmu.
        </p>
        <div class="flex gap-2">
          <button 
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            on:click={() => (open = false)}
          >
            Batal
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            on:click={save}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}