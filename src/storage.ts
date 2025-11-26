import fs from 'fs/promises';
import path from 'path';
import { Livro, Membro, Emprestimo } from './models';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch (e) { /* ignore */ }
}

async function readJsonFile<T>(name: string): Promise<T[]> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, name + '.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as T[];
    return parsed;
  } catch (e) {
    return [];
  }
}

async function writeJsonFile<T>(name: string, data: T[]) {
  await ensureDataDir();
  const file = path.join(DATA_DIR, name + '.json');
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

export async function loadLivros(): Promise<Livro[]> {
  const raw = await readJsonFile<any>('books');
  return raw.map(r => {
    const l = new Livro(r.titulo, r.autor, r.isbn, r.ano, r.id);
    l.disponivel = typeof r.disponivel === 'boolean' ? r.disponivel : true;
    return l;
  });
}

export async function saveLivros(livros: Livro[]) {
  await writeJsonFile('books', livros.map(l => l.toJSON()));
}

export async function loadMembros(): Promise<Membro[]> {
  const raw = await readJsonFile<any>('members');
  return raw.map(r => new Membro(r.nome, r.matricula, r.endereco, r.telefone));
}

export async function saveMembros(membros: Membro[]) {
  await writeJsonFile('members', membros.map(m => m.toJSON()));
}

export async function loadEmprestimos(): Promise<Emprestimo[]> {
  const raw = await readJsonFile<any>('loans');
  return raw.map(r => {
    const e = new Emprestimo(r.livroId, r.matriculaMembro, 14, r.id, r.dataEmprestimo);
    if (r.dataDevolucao) { e.devolver(); }
    return e;
  });
}

export async function saveEmprestimos(emp: Emprestimo[]) {
  await writeJsonFile('loans', emp.map(e => e.toJSON()));
}