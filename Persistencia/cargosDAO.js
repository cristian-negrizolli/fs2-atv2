import conectar from "./conexao.js";
import Cargos from "../Modelo/cargo.js";

class CargosDAO {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const conexao = await conectar();
      const sql = `
                CREATE TABLE IF NOT EXISTS cargos (
                    c_id INT NOT NULL AUTO_INCREMENT,
                    c_nome VARCHAR(100),
                    c_descricao TEXT,
                    PRIMARY KEY (c_id) 
                );`;

      await conexao.execute(sql);
      global.poolConexoes.releaseConnection(conexao);
    } catch (error) {
      console.error("iniciando banco de dados:" + error);
    }
  }

  async gravar(cargo) {
    if (cargo instanceof Cargos) {
      const sql = `INSERT INTO cargos (c_nome, c_descricao) VALUES (?, ?);`;
      const parametros = [cargo.nome, cargo.descricao];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      cargo.id = retorno[0].insertId;
      global.poolConexoes.releaseConnection(conexao);
    }
  }

  static async existeCargo(id) {
    const sql = `SELECT * FROM cargos WHERE c_id = ?;`;
    const parametros = [id];
    
    const conexao = await conectar();
  
    const [registros, campos] = await conexao.execute(sql, parametros);

    global.poolConexoes.releaseConnection(conexao);
    
    return registros.length > 0;
    
  }

  async atualizar(cargo) {
    if (cargo instanceof Cargos) {
      const sql = `UPDATE cargos SET c_nome = ?, c_descricao = ? WHERE c_id = ?;`;
      const parametros = [cargo.nome, cargo.descricao, cargo.id];
      const conexao = await conectar();
      await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
    }
  }

  async excluir(cargo) {
    if (cargo instanceof Cargos) {
      const sql = `DELETE FROM cargos WHERE c_id = ?;`;
      const parametros = [cargo.id];
      const conexao = await conectar();
      await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
    }
  }

  async consultar(parametroConsulta) {
    let sql = "";
    let parametros = [];

    if (!isNaN(parseInt(parametroConsulta))) {
      sql = `SELECT * FROM cargos WHERE c_id = ? order by c_nome`;
      parametros = [parametroConsulta];
    } else {
      if (!parametroConsulta) {
        parametroConsulta = "";
      }
      sql = `SELECT * FROM cargos WHERE c_nome like ?`;
      parametros = ["%" + parametroConsulta + "%"];
    }
    const conexao = await conectar();
    const [registros, campos] = await conexao.execute(sql, parametros);
    global.poolConexoes.releaseConnection(conexao);

    let listaCargos = [];
    for (const registro of registros) {
      const cargo = new Cargos(
        registro.c_id,
        registro.c_nome,
        registro.c_descricao
      );
      console.log("Objeto cargo criado:", cargo);
      listaCargos.push(cargo);
    }

    console.log("Lista de cargos criada manualmente:", listaCargos);

    console.log("SQL executado:", sql, "Parâmetros:", parametros);
    console.log("Registros retornados:", registros);
    return listaCargos;
  }
  async possuiCargos(cargoId) {
    const sql = `SELECT count(*) as qtd FROM usuario_cargo uc
                 INNER JOIN usuarios u ON uc.u_id = u.u_id
                 INNER JOIN cargos c ON uc.c_id = c.c_id
                 WHERE c.c_id = ?`;
    const parametros = [cargoId];
    
    let conexao;
    try {
        conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        return registros[0].qtd > 0; // Retorna verdadeiro se o cargo estiver sendo utilizado
    } catch (error) {
        console.error("Erro ao verificar se o cargo possui usuários:", error);
        return false; // Retorna false em caso de erro
    } finally {
        if (conexao) {
            global.poolConexoes.releaseConnection(conexao); // Garante que a conexão seja liberada
        }
    }
  }
}


export default CargosDAO;