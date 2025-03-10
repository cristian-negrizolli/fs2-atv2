import conectar from "./conexao.js";
import Usuarios from "../Modelo/usuario.js";
import Cargos from "../Modelo/Cargo.js";

class UsuariosDAO {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const conexao = await conectar();

      const sql = `
              CREATE TABLE IF NOT EXISTS usuarios (
                u_id INT PRIMARY KEY AUTO_INCREMENT,
                u_nome VARCHAR(100) NOT NULL,
                u_email VARCHAR(100) UNIQUE NOT NULL,
                u_senha TEXT NOT NULL 
              );
            `;
      await conexao.execute(sql);
      global.poolConexoes.releaseConnection(conexao);
    } catch (error) {
      console.error("Erro ao iniciar banco de dados table usuario: " + error);
    }
  }

  async gravar(usuario) {
    if (usuario instanceof Usuarios) {
      const conexao = await conectar();
      await conexao.beginTransaction();

      try {
        const sql = `INSERT INTO usuarios (u_nome, u_email, u_senha) 
                      VALUES (?, ?, ?)`;
        const parametros = [usuario.nome, usuario.email, usuario.senha];

        const retorno = await conexao.execute(sql, parametros);
        usuario.id = retorno[0].insertId;
        const sql2 = `INSERT INTO usuario_cargo (u_id, c_id) 
        VALUES (?, ?)`;

        console.log("Parâmetros SQL:", parametros);

        for (const cargo of usuario.cargos) {
          let parametros2 = [usuario.id, cargo.id];
          console.log("Parâmetros SQL:", parametros2);
          await conexao.execute(sql2, parametros2);
        }

        await conexao.commit();
      } catch (error) {
        await conexao.rollback();

        throw error;
      } finally {
        global.poolConexoes.releaseConnection(conexao);
      }
    }
  }

  /**
   * Busca um usuário pelo email.
   * 
   * @param {string} email - Email do usuário a ser buscado.
   * @returns {Usuarios|null} - O objeto do usuário encontrado ou nulo se não encontrado.
   * @throws {Error} Erro ao buscar usuário.
   */
  static async getUserByEmail(email) {
    try {
        const conexao = await conectar(); 
        const [rows] = await conexao.execute("SELECT * FROM usuarios WHERE u_email = ?", [email]);

        if (!rows || rows.length === 0) {
            return null;
        }


        const row = rows[0];
        console.log("User:", row);


        return new Usuarios(
          row.u_id,
          row.u_nome,
          row.u_email,
          row.u_senha,  
          [] 
      );
    } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        throw new Error("Erro ao buscar usuário"); // Para que o erro possa ser tratado em outro lugar
    }
}


  async atualizar(usuario) {
    const conexao = await conectar();
    await conexao.beginTransaction();

    try {
      const sql = `UPDATE usuarios 
                     SET u_nome = ?, u_email = ?, u_senha = ? 
                     WHERE u_id = ?`;

      const parametros = [
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.id,
      ];

      await conexao.execute(sql, parametros);
      console.log("Parâmetros SQL1:", parametros);

      const sql2 = `DELETE FROM usuario_cargo WHERE u_id = ?`;

      await conexao.execute(sql2, [usuario.id]);
      console.log("Parâmetros SQL2:", usuario.id);

      const sql3 = `INSERT INTO usuario_cargo (u_id, c_id) 
          VALUES (?, ?)`;


      for (const cargo of usuario.cargos) {
        let parametros2 = [usuario.id, cargo.id];
        console.log("Parâmetros SQL3:", parametros2);
        await conexao.execute(sql3, parametros2);
      }

      await conexao.commit();
    } catch (error) {
      await conexao.rollback();

      throw error;
    } finally {
      global.poolConexoes.releaseConnection(conexao);
    }
  }

  static async existeUsuario(id) {
      const sql = `SELECT * FROM usuarios WHERE u_id = ?;`;
      const parametros = [id];
      
      const conexao = await conectar();
    
      const [registros, campos] = await conexao.execute(sql, parametros);

      global.poolConexoes.releaseConnection(conexao);
      
      return registros.length > 0;
      
  }

  async excluir(usuario) {
    if (usuario instanceof Usuarios) {
      const sql = `DELETE FROM usuarios WHERE u_id = ?`;
      const parametros = [usuario.id];
      const conexao = await conectar();
      await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
    }
  }

  async consultar(termo) {
    if (!termo) {
      termo = "";
    }

    const conexao = await conectar();
    let listaUsuarios = [];

    try {
      let sql, parametros;

      if (!isNaN(parseInt(termo))) {
        // Para um usuário específico, buscando todos os cargos associados a ele
        sql = `SELECT u.u_id, u.u_nome, u.u_email, u.u_senha, c.c_id, c.c_nome, c_descricao
                   FROM usuarios u
                   LEFT JOIN usuario_cargo uc ON u.u_id = uc.u_id
                   LEFT JOIN cargos c ON uc.c_id = c.c_id
                   WHERE u.u_id = ?
                   ORDER BY u.u_nome`;
        parametros = [termo];
      } else {
        // Para uma busca por nome de usuário, buscando todos os cargos associados
        sql = `SELECT u.u_id, u.u_nome, u.u_email, u.u_senha, c.c_id, c.c_nome, c_descricao
                   FROM usuarios u
                   LEFT JOIN usuario_cargo uc ON u.u_id = uc.u_id
                   LEFT JOIN cargos c ON uc.c_id = c.c_id
                   WHERE u.u_id LIKE ?
                   ORDER BY u.u_nome`;
        parametros = ["%" + termo + "%"];
      }

      const [registros] = await conexao.execute(sql, parametros);

      // Dicionário para armazenar cargos por usuário
      let usuariosMap = {};

      for (const registro of registros) {
        // console.log("Registro do banco:", registro);

        // Verifica se o usuário já foi adicionado ao dicionário
        if (!usuariosMap[registro.u_id]) {
          // Se o usuário não existe, cria um novo e adiciona a lista de cargos
          usuariosMap[registro.u_id] = new Usuarios(
            registro.u_id,
            registro.u_nome,
            registro.u_email,
            registro.u_senha,
            []
          );
        }

        // Cria o objeto cargo e associa ao usuário
        const cargo = registro.c_id
          ? new Cargos(registro.c_id, registro.c_nome, registro.c_descricao)
          : null;
        if (cargo) {
          usuariosMap[registro.u_id].cargos.push(cargo); // Adiciona o cargo à lista do usuário
        }

        // console.log("Usuário com cargos:", usuariosMap[registro.u_id].toJSON());
      }

      // Converter o dicionário para uma lista
      listaUsuarios = Object.values(usuariosMap);
    } finally {
      global.poolConexoes.releaseConnection(conexao);
    }

    return listaUsuarios;
  }
}

export default UsuariosDAO;



