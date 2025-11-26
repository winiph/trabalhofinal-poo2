import { Livro, Membro, Emprestimo } from './models';
import * as storage from './storage';

export class Biblioteca {
  livros: Livro[] = [];
  membros: Membro[] = [];
  emprestimos: Emprestimo[] = [];

  async carregar() {
    this.livros = await storage.loadLivros();
    this.membros = await storage.loadMembros();
    this.emprestimos = await storage.loadEmprestimos();
  }

  async salvar() {
    await storage.saveLivros(this.livros);
    await storage.saveMembros(this.membros);
    await storage.saveEmprestimos(this.emprestimos);
  }

  // Livros CRUD
  adicionarLivro(titulo: string, autor: string, isbn: string, ano: number) {
    const livro = new Livro(titulo, autor, isbn, ano);
    this.livros.push(livro);
    return livro;
  }

  listarLivros() { return this.livros; }

  atualizarLivro(id: string, changes: Partial<{titulo:string;autor:string;isbn:string;ano:number}>) {
    const l = this.livros.find(x => x.id === id);
    if (!l) throw new Error('Livro não encontrado');
    if (changes.titulo) l.titulo = changes.titulo;
    if (changes.autor) l.autor = changes.autor;
    if (changes.isbn) l.isbn = changes.isbn;
    if (changes.ano) l.ano = changes.ano;
    return l;
  }

  removerLivro(id: string) {
    const idx = this.livros.findIndex(x => x.id === id);
    if (idx === -1) throw new Error('Livro não encontrado');
    // não remover se emprestado
    const ativo = this.emprestimos.find(e => e.livroId === id && e.ativo);
    if (ativo) throw new Error('Livro atualmente emprestado');
    this.livros.splice(idx, 1);
  }

  // Membros CRUD
  adicionarMembro(nome: string, matricula: string, endereco: string, telefone: string) {
    if (this.membros.find(m => m.matricula === matricula)) throw new Error('Matrícula já existe');
    const m = new Membro(nome, matricula, endereco, telefone);
    this.membros.push(m);
    return m;
  }

  listarMembros() { return this.membros; }

  atualizarMembro(matricula: string, changes: Partial<{nome:string;endereco:string;telefone:string}>) {
    const m = this.membros.find(x => x.matricula === matricula);
    if (!m) throw new Error('Membro não encontrado');
    if (changes.nome) m.nome = changes.nome;
    if (changes.endereco) m.endereco = changes.endereco;
    if (changes.telefone) m.telefone = changes.telefone;
    return m;
  }

  removerMembro(matricula: string) {
    const idx = this.membros.findIndex(x => x.matricula === matricula);
    if (idx === -1) throw new Error('Membro não encontrado');
    const ativo = this.emprestimos.find(e => e.membro === matricula && e.ativo);
    if (ativo) throw new Error('Membro possui empréstimos ativos');
    this.membros.splice(idx,1);
  }

  // Empréstimos
  emprestar(livroId: string, matricula: string) {
    const livro = this.livros.find(l => l.id === livroId);
    if (!livro) throw new Error('Livro não encontrado');
    if (!livro.disponivel) throw new Error('Livro não está disponível');
    const membro = this.membros.find(m => m.matricula === matricula);
    if (!membro) throw new Error('Membro não encontrado');

    const emprestimo = new Emprestimo(livroId, matricula);
    livro.disponivel = false;
    this.emprestimos.push(emprestimo);
    return emprestimo;
  }

  listarEmprestimosAtivos() { return this.emprestimos.filter(e => e.ativo); }

  registrarDevolucao(emprestimoId: string) {
    const e = this.emprestimos.find(x => x.id === emprestimoId);
    if (!e) throw new Error('Empréstimo não encontrado');
    if (!e.ativo) throw new Error('Empréstimo já devolvido');
    e.devolver();
    const livro = this.livros.find(l => l.id === e.livroId);
    if (livro) livro.disponivel = true;
    return e;
  }

  listarHistorico() { return this.emprestimos.slice().sort((a,b)=> a.dataEmprestimo.localeCompare(b.dataEmprestimo)); }
}