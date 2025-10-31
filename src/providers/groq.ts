let _apiKey = '';
let _model = 'llama-3.3-70b-versatile';
export function setGroqConfig(key: string, model: string){ _apiKey = key; _model = model || _model; }
type Msg = { role: 'user'|'assistant'|'system'; content: string };
export async function groqChat(messages: Msg[]){
  if (!_apiKey) throw new Error('GROQ_API_KEY_EMPTY');
  const headers = { 'Authorization': `Bearer ${_apiKey}`, 'Content-Type': 'application/json' };
  const body = { model: _model, messages, stream: false };
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', { method:'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GROQ_ERR ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}
