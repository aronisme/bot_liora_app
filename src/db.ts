import Dexie, { type Table } from 'dexie';

export interface Report { id?: number; content: string; updatedAt: number; }
export interface Msg { id?: number; role: 'user'|'assistant'|'system'; content: string; createdAt: number; }

class DB extends Dexie {
  report!: Table<Report, number>;
  messages!: Table<Msg, number>;
  constructor() {
    super('LioraReportAISmart');
    this.version(1).stores({ report: '++id, updatedAt', messages: '++id, createdAt' });
  }
}
export const db = new DB();

export async function getOrCreateReport(){
  const r = await db.report.get(1);
  if (r) return r;
  const init = { id:1, content:`- Tanggal:\n- Kegiatan:\n- Proses:\n- Masalah:\n- Tugas:\n- Progres:\n- Catatan lain:\n`, updatedAt: Date.now() };
  await db.report.add(init as Report);
  return init as Report;
}

export async function resetReport() {
  await db.report.clear();
  const init = { 
    id: 1, 
    content: `- Tanggal:\n- Kegiatan:\n- Proses:\n- Masalah:\n- Tugas:\n- Progres:\n- Catatan lain:\n`, 
    updatedAt: Date.now() 
  };
  await db.report.put(init);
  return init;
}
