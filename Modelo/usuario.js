import Cargos from "./Cargo.js";
import UsuarioDAO from "../Persitencia/UsuariosDAO.js";

class Usuarios {
  #id;
  #nome;
  #email;
  #senha;
  #cargo;

  constructor(id = 0, nome, email, senha, cargo) {
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#senha = senha;
    this.#cargo = cargo;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }

  get nome() {
    return this.#nome;
  }

  set nome(nome) {
    this.#nome = nome;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get senha() {
    return this.#senha;  // Garantir que o getter esteja correto
  }

  set senha(senha) {
    this.#senha = senha;
  }

  get cargo() {
    return this.#cargo;
  }

  set cargo(novoCargo) {
    if (novoCargo instanceof Cargos) {
      this.#cargo = novoCargo;
    }
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      cargo: this.#cargo ? { id: this.#cargo.id, nome: this.#cargo.nome } : null 
    };
  }

  async gravar() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.gravar(this);
  }
//resre
  async excluir() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.excluir(this);
  }

  async atualizar() {
    const usuDAO = new UsuarioDAO();
    await usuDAO.atualizar(this);
  }

  async consultar(termo) {
    const usuDAO = new UsuarioDAO();
    return await usuDAO.consultar(termo);
  }
}

export default Usuarios;