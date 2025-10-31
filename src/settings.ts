let _provider = 'openrouter';
let _orKey = ''; let _orModel = 'google/gemini-2.0-flash-exp:free';
let _gqKey = ''; let _gqModel = 'llama-3.3-70b-versatile';

export function getProvider(){ return _provider as 'openrouter'|'groq'; }
export function setProvider(p:'openrouter'|'groq'){ _provider = p; localStorage.setItem('prov', p); }
export function setOpenRouter(key:string, model?:string){ _orKey = key; if (model) _orModel = model; localStorage.setItem('orKey', key); localStorage.setItem('orModel', _orModel); }
export function getOpenRouter(){ return { key:_orKey, model:_orModel }; }
export function setGroq(key:string, model?:string){ _gqKey = key; if (model) _gqModel = model; localStorage.setItem('gqKey', key); localStorage.setItem('gqModel', _gqModel); }
export function getGroq(){ return { key:_gqKey, model:_gqModel }; }
export function loadSettings(){
  _provider = (localStorage.getItem('prov') as any) || 'openrouter';
  _orKey = localStorage.getItem('orKey') || '';
  _orModel = localStorage.getItem('orModel') || 'google/gemini-2.0-flash-exp:free';
  _gqKey = localStorage.getItem('gqKey') || '';
  _gqModel = localStorage.getItem('gqModel') || 'llama-3.3-70b-versatile';
  return { provider:_provider, orKey:_orKey, orModel:_orModel, gqKey:_gqKey, gqModel:_gqModel };
}
