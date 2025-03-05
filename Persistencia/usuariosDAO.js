import conectar from "./conexao.js";
import Usuarios from "../Modelo/usuario.js";
import Cargos from "../Modelo/cargo.js";

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
        const parametros = [
          usuario.nome,
          usuario.email,
          usuario.senha
        ];
  
        const retorno = await conexao.execute(sql, parametros);
        usuario.id = retorno[0].insertId;
        const sql2 = `INSERT INTO usuario_cargo (u_id, c_id) 
        VALUES (?, ?)`;
       
        
        console.log("Parâmetros SQL:", parametros);
        
        for (const cargo of usuario.cargos) {
          let parametros2 = [
            usuario.id,
            cargo.id
          ];
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

  async atualizar(usuario) {
    if (usuario instanceof Usuarios) {
      const sql = `UPDATE usuarios 
                     SET u_nome = ?, u_email = ?, u_senha = ?, c_id = ? 
                     WHERE u_id = ?`;

      const parametros = [
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.cargos,
        usuario.id,
      ];

      const conexao = await conectar();
      try {
        await conexao.execute(sql, parametros);
      } finally {
        global.poolConexoes.releaseConnection(conexao);
      }
    }
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
        sql = `SELECT u.u_id, u.u_nome, u.u_email, u.u_senha, c.c_id, c.c_nome
                   FROM usuarios u
                   LEFT JOIN usuario_cargo uc ON u.u_id = uc.u_id
                   LEFT JOIN cargos c ON uc.c_id = c.c_id
                   WHERE u.u_id = ?
                   ORDER BY u.u_nome`;
        parametros = [termo];
      } else {
        // Para uma busca por nome de usuário, buscando todos os cargos associados
        sql = `SELECT u.u_id, u.u_nome, u.u_email, u.u_senha, c.c_id, c.c_nome
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
        console.log("Registro do banco:", registro);

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
          ? new Cargos(registro.c_id, registro.c_nome)
          : null;
        if (cargo) {
          usuariosMap[registro.u_id].cargos.push(cargo); // Adiciona o cargo à lista do usuário
        }

        console.log("Usuário com cargos:", usuariosMap[registro.u_id].toJSON());
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
