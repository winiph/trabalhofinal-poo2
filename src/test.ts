import { Biblioteca } from './library';
async function run(){
  const b = new Biblioteca();
  await b.carregar();
  const livro = b.adicionarLivro('TS Avançado', 'Fulano', '123-456', 2025);
  const membro = b.adicionarMembro('Ana', 'M001', 'Rua A', '9999-9999');
  const emp = b.emprestar(livro.id, membro.matricula);
  if(!emp || !emp.id) throw new Error('Erro ao criar empréstimo');
  b.registrarDevolucao(emp.id);
  console.log('Testes básicos executados com sucesso');
  await b.salvar();
}
run().catch(e=>{ console.error(e); process.exit(1); });
