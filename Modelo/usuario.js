import Cargos from "./Cargo.js";
import UsuarioDAO from "../Persistencia/usuariosDAO.js";

class Usuarios {
  #id;
  #nome;
  #email;
  #senha;
  #cargos;

  constructor(id = 0, nome, email, senha, cargos) {
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#senha = senha;
    this.#cargos = cargos;
  }

  get id() { return this.#id;  }

  set id(id) { this.#id = id; }

  get nome() { return this.#nome; }

  set nome(nome) { this.#nome = nome; }

  get email() { return this.#email; }

  set email(email) { this.#email = email;  }

  get senha() { return this.#senha; }

  set senha(senha) { this.#senha = senha; }

  get cargos() { return this.#cargos; }

  set cargos(novoCargo) { this.#cargos = novosCargos; }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      cargos: this.#cargos.map(cargo => cargo.toJSON()) 
    };
  }

  async gravar() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.gravar(this);
  }

  async excluir() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.excluir(this);
  }

  async atualizar() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.atualizar(this);
  }

  static async consultar(termo) {
    const usuDAO = new UsuarioDAO();
    return await usuDAO.consultar(termo);
  }
}

export default Usuarios;