//Encapsulamento
export abstract class Pessoa {
  protected _nome: string;
  protected _matricula: string;
  protected _endereco: string;
  protected _telefone: string;

  constructor(nome: string, matricula: string, endereco: string, telefone: string) {
    this._nome = nome;
    this._matricula = matricula;
    this._endereco = endereco;
    this._telefone = telefone;
  }
//getters/setters
  get nome() { return this._nome; }
  get matricula() { return this._matricula; }
  get endereco() { return this._endereco; }
  get telefone() { return this._telefone; }

  set nome(v: string) { this._nome = v; }
  set endereco(v: string) { this._endereco = v; }
  set telefone(v: string) { this._telefone = v; }

  toJSON() {
    return {
      nome: this._nome,
      matricula: this._matricula,
      endereco: this._endereco,
      telefone: this._telefone
    };
  }
}
//herança
export class Membro extends Pessoa {
  constructor(nome: string, matricula: string, endereco: string, telefone: string) {
    super(nome, matricula, endereco, telefone);
  }

  // exemplo de polimorfismo
  toString(): string {
    return `Membro: ${this._nome} (matr: ${this._matricula})`;
  }
}

export class Livro {
  private _id: string; // gerado
  private _titulo: string;
  private _autor: string;
  private _isbn: string;
  private _ano: number;
  private _disponivel: boolean;

  constructor(titulo: string, autor: string, isbn: string, ano: number, id?: string) {
    this._id = id ?? generateId();
    this._titulo = titulo;
    this._autor = autor;
    this._isbn = isbn;
    this._ano = ano;
    this._disponivel = true;
  }

  get id() { return this._id; }
  get titulo() { return this._titulo; }
  get autor() { return this._autor; }
  get isbn() { return this._isbn; }
  get ano() { return this._ano; }
  get disponivel() { return this._disponivel; }

  set titulo(v: string) { this._titulo = v; }
  set autor(v: string) { this._autor = v; }
  set isbn(v: string) { this._isbn = v; }
  set ano(v: number) { this._ano = v; }
  set disponivel(v: boolean) { this._disponivel = v; }

  toJSON() {
    return {
      id: this._id,
      titulo: this._titulo,
      autor: this._autor,
      isbn: this._isbn,
      ano: this._ano,
      disponivel: this._disponivel
    };
  }
}

export class Emprestimo {
  private _id: string;
  private _livroId: string;
  private _matriculaMembro: string;
  private _dataEmprestimo: string; // ISO
  private _dataPrevDevolucao: string | null; // ISO
  private _dataDevolucao: string | null; // ISO

  constructor(livroId: string, matricula: string, diasParaDevolucao = 14, id?: string, dataEmprestimo?: string) {
    this._id = id ?? generateId();
    this._livroId = livroId;
    this._matriculaMembro = matricula;
    const now = dataEmprestimo ?? new Date().toISOString();
    this._dataEmprestimo = now;
    this._dataPrevDevolucao = new Date(Date.now() + diasParaDevolucao * 24 * 3600 * 1000).toISOString();
    this._dataDevolucao = null;
  }

  get id() { return this._id; }
  get livroId() { return this._livroId; }
  get membro() { return this._matriculaMembro; }
  get dataEmprestimo() { return this._dataEmprestimo; }
  get dataPrevDevolucao() { return this._dataPrevDevolucao; }
  get dataDevolucao() { return this._dataDevolucao; }

  devolver() {
    this._dataDevolucao = new Date().toISOString();
  }

  get ativo() { return this._dataDevolucao === null; }

  toJSON() {
    return {
      id: this._id,
      livroId: this._livroId,
      matriculaMembro: this._matriculaMembro,
      dataEmprestimo: this._dataEmprestimo,
      dataPrevDevolucao: this._dataPrevDevolucao,
      dataDevolucao: this._dataDevolucao
    };
  }
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}