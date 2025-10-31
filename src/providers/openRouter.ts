let _apiKey = '';
let _model = 'google/gemini-2.0-flash-exp:free';
export function setOpenRouterConfig(key: string, model: string){ _apiKey = key; _model = model || _model; }
type Msg = { role: 'user'|'assistant'|'system'; content: string };
export async function openRouterChat(messages: Msg[]){
  if (!_apiKey) throw new Error('OPENROUTER_API_KEY_EMPTY');
  const headers = {
    'Authorization': `Bearer ${_apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': location.origin,
    'X-Title': 'Liora Report AI Smart'
  };
  const body = { model: _model, messages, stream: false };
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', { method:'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`OPENROUTER_ERR ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}
