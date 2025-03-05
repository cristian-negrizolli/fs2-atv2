import CargosDAO from "../Persistencia/cargosDAO.js";

class Cargos {
  #id;
  #nome;
  #descricao;

  constructor(id = 0, nome, descricao = "") {
    this.#id = id;
    this.#nome = nome;
    this.#descricao = descricao;
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

  get descricao() {
    return this.#descricao;
  }
  set descricao(descricao) {
    this.#descricao = descricao;
  }



  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      descricao: this.#descricao
    };
  }

  async gravar() {
    const cargoDAO = new CargosDAO();
    await cargoDAO.gravar(this);
  }

  async atualizar() {
    const cargoDAO = new CargosDAO();
    await cargoDAO.atualizar(this);
  }
  async excluir() {
    const cargoDAO = new CargosDAO();
    await cargoDAO.excluir(this);
  }

  async consultar(parametro) {
    const cargoDAO = new CargosDAO();
    return await cargoDAO.consultar(parametro);
  }

  static async existeCargo(id) {
    return await CargosDAO.existeCargo(id);
  }

  async possuiCargos() {
    const cargoDAO = new CargosDAO();
    return await cargoDAO.possuiCargos(this.id);
  }

}

export default Cargos;
