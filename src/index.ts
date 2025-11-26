import readline from 'readline';
import { Biblioteca } from './library';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(q: string) { return new Promise<string>(res => rl.question(q, ans => res(ans.trim()))); }

async function main(){
  const b = new Biblioteca();
  await b.carregar();
  console.log('Bem-vindo ao Sistema de Biblioteca (CLI)');

  while(true){
    console.log('\nMenu:');
    console.log('1) Gerenciar livros');
    console.log('2) Gerenciar membros');
    console.log('3) Empréstimos');
    console.log('0) Sair');
    const opt = await question('Escolha: ');
    try{
      if(opt === '1') await menuLivros(b);
      else if(opt === '2') await menuMembros(b);
      else if(opt === '3') await menuEmprestimos(b);
      else if(opt === '0') { await b.salvar(); break; }
      else console.log('Opção inválida');
    }catch(e:any){ console.log('Erro: ', e.message); }
  }
  console.log('Saindo...');
  rl.close();
}

async function menuLivros(b: Biblioteca){
  console.log('\n-- Livros --');
  console.log('a) Adicionar');
  console.log('b) Listar');
  console.log('c) Atualizar');
  console.log('d) Remover');
  console.log('x) Voltar');
  const o = await question('> ');
  if(o === 'a'){
    const titulo = await question('Título: ');
    const autor = await question('Autor: ');
    const isbn = await question('ISBN: ');
    const ano = Number(await question('Ano: '));
    const l = b.adicionarLivro(titulo, autor, isbn, ano);
    await b.salvar();
    console.log('Livro adicionado: ', l.id);
  }else if(o === 'b'){
    const livros = b.listarLivros();
    livros.forEach(l => console.log(`${l.id} | ${l.titulo} | ${l.autor} | ${l.isbn} | ${l.ano} | disp:${l.disponivel}`));
  }else if(o === 'c'){
    const id = await question('ID do livro: ');
    const titulo = await question('Novo título (enter para pular): ');
    const autor = await question('Novo autor (enter para pular): ');
    const isbn = await question('Novo ISBN (enter para pular): ');
    const anoStr = await question('Novo ano (enter para pular): ');
    const changes:any = {};
    if(titulo) changes.titulo = titulo;
    if(autor) changes.autor = autor;
    if(isbn) changes.isbn = isbn;
    if(anoStr) changes.ano = Number(anoStr);
    b.atualizarLivro(id, changes);
    await b.salvar();
    console.log('Atualizado.');
  }else if(o === 'd'){
    const id = await question('ID do livro a remover: ');
    b.removerLivro(id);
    await b.salvar();
    console.log('Removido.');
  }
}

async function menuMembros(b: Biblioteca){
  console.log('\n-- Membros --');
  console.log('a) Adicionar');
  console.log('b) Listar');
  console.log('c) Atualizar');
  console.log('d) Remover');
  console.log('x) Voltar');
  const o = await question('> ');
  if(o === 'a'){
    const nome = await question('Nome: ');
    const matricula = await question('Matrícula: ');
    const endereco = await question('Endereço: ');
    const telefone = await question('Telefone: ');
    b.adicionarMembro(nome, matricula, endereco, telefone);
    await b.salvar();
    console.log('Membro adicionado.');
  }else if(o === 'b'){
    b.listarMembros().forEach(m => console.log(`${m.matricula} | ${m.nome} | ${m.endereco} | ${m.telefone}`));
  }else if(o === 'c'){
    const mat = await question('Matrícula: ');
    const nome = await question('Novo nome (enter para pular): ');
    const endereco = await question('Novo endereço (enter para pular): ');
    const tel = await question('Novo telefone (enter para pular): ');
    const changes:any = {};
    if(nome) changes.nome = nome;
    if(endereco) changes.endereco = endereco;
    if(tel) changes.telefone = tel;
    b.atualizarMembro(mat, changes);
    await b.salvar();
    console.log('Atualizado.');
  }else if(o === 'd'){
    const mat = await question('Matrícula a remover: ');
    b.removerMembro(mat);
    await b.salvar();
    console.log('Removido.');
  }
}

async function menuEmprestimos(b: Biblioteca){
  console.log('\n-- Empréstimos --');
  console.log('a) Realizar empréstimo');
  console.log('b) Listar empréstimos ativos');
  console.log('c) Registrar devolução');
  console.log('d) Histórico');
  console.log('x) Voltar');
  const o = await question('> ');
  if(o === 'a'){
    const livroId = await question('ID do livro: ');
    const mat = await question('Matrícula do membro: ');
    const e = b.emprestar(livroId, mat);
    await b.salvar();
    console.log('Empréstimo realizado: ', e.id);
  }else if(o === 'b'){
    b.listarEmprestimosAtivos().forEach(e => console.log(`${e.id} | livro:${e.livroId} | membro:${e.membro} | emprestado:${e.dataEmprestimo} | prev devol:${e.dataPrevDevolucao}`));
  }else if(o === 'c'){
    const id = await question('ID do empréstimo: ');
    b.registrarDevolucao(id);
    await b.salvar();
    console.log('Devolução registrada.');
  }else if(o === 'd'){
    b.listarHistorico().forEach(e => console.log(`${e.id} | livro:${e.livroId} | membro:${e.membro} | emprest:${e.dataEmprestimo} | devol:${e.dataDevolucao ?? '-'} `));
  }
}

// start
main().catch(err => { console.error(err); process.exit(1); });