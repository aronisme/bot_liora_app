<script lang="ts">
  import { loadSettings, setProvider, setOpenRouter, setGroq } from '../settings';
  import { setOpenRouterConfig } from '../providers/openRouter';
  import { setGroqConfig } from '../providers/groq';
  export let open = false;
  let provider:'openrouter'|'groq' = 'openrouter';
  let orKey=''; let orModel='google/gemini-2.0-flash-exp:free';
  let gqKey=''; let gqModel='llama-3.3-70b-versatile';

  function init(){
    const s = loadSettings();
    provider = s.provider as any;
    orKey = s.orKey; orModel = s.orModel;
    gqKey = s.gqKey; gqModel = s.gqModel;
    setProvider(provider);
    setOpenRouter(orKey, orModel); setOpenRouterConfig(orKey, orModel);
    setGroq(gqKey, gqModel); setGroqConfig(gqKey, gqModel);
  }
  init();

  function save(){
    setProvider(provider);
    setOpenRouter(orKey, orModel); setOpenRouterConfig(orKey, orModel);
    setGroq(gqKey, gqModel); setGroqConfig(gqKey, gqModel);
    open = false;
  }
</script>

{#if open}
  <div style="position:fixed, inset:0; background:#0009; display:flex; align-items:center; justify-content:center">
    <div style="background:#0f152b;border:1px solid #1f2847;border-radius:12px;padding:16px;min-width:560px">
      <h3>Pengaturan</h3>
      <div class="grid" style="margin-top:10px">
        <div>
          <label class="small">Provider</label>
          <select bind:value={provider}>
            <option value="openrouter">OpenRouter</option>
            <option value="groq">GROQ</option>
          </select>
        </div>
        {#if provider === 'openrouter'}
          <div>
            <label class="small">Model (OpenRouter)</label>
            <input bind:value={orModel} placeholder="google/gemini-2.0-flash-exp:free"/>
          </div>
          <div class="grid" style="grid-template-columns:1fr">
            <label class="small">OPENROUTER_API_KEY</label>
            <input bind:value={orKey} placeholder="sk-or-..."/>
          </div>
        {:else}
          <div>
            <label class="small">Model (GROQ)</label>
            <input bind:value={gqModel} placeholder="llama-3.3-70b-versatile"/>
          </div>
          <div class="grid" style="grid-template-columns:1fr">
            <label class="small">GROQ_API_KEY</label>
            <input bind:value={gqKey} placeholder="gsk_..."/>
          </div>
        {/if}
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button on:click={()=> open=false}>Batal</button>
        <button class="primary" on:click={save}>Simpan</button>
      </div>
      <div class="small" style="margin-top:6px">Kunci API disimpan di LocalStorage perangkatmu.</div>
    </div>
  </div>
{/if}
