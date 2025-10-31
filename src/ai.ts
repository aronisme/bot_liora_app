import { openRouterChat } from './providers/openRouter';
import { groqChat } from './providers/groq';
import { getProvider } from './settings';
type Msg = { role:'user'|'assistant'|'system', content:string };
export async function aiGenerate(systemPrompt: string, userText: string){
  const messages: Msg[] = [{ role:'system', content: systemPrompt }, { role:'user', content: userText }];
  const p = getProvider();
  if (p === 'groq') return groqChat(messages);
  return openRouterChat(messages);
}
