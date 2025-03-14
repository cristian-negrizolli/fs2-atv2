import Usuarios from "../Modelo/usuario.js";
import Cargos from "../Modelo/Cargo.js";

class UsuarioCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const email = dados.email;
            const senha = dados.senha;
            const cargosUsuario = dados.cargos  
            let cargos = [];

            cargos = cargosUsuario.map(cargoId => new Cargos(cargoId));

                const usuario = new Usuarios(0, nome, email, senha, cargos);
                
                console.log("Dados antes de gravar:", usuario);
                usuario.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigo": usuario.id,
                        "mensagem": "Usuário incluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o usuário: " + erro.message
                    });
                });

           
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' ) && requisicao.is('application/json')) {
            const id = requisicao.params.id;
            const nonExists = !await Usuarios.existeUsuario(id);
            if (nonExists) {
                return resposta.status(404).json({
                    "status": false,
                    "mensagem": "Usuário não encontrado!"
                });
            }

            const dados = requisicao.body;
            const nome = dados.nome;
            const email = dados.email;
            const senha = dados.senha;
            const cargos = dados.cargos;

            
                const cargo = cargos.map(cargos => new Cargos(cargos));
                const usuario = new Usuarios(id, nome, email, senha, cargo);

                usuario.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Usuário atualizado com sucesso!"
                    });
                }).catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o usuário: " + erro.message
                        });
                    });
            }
            
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um usuário!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
            const dados = requisicao.params;
            const id = dados.id;
           
            if (id) {
                const usuario = new Usuarios(id);
                if (!await Usuarios.existeUsuario(id)) {
                    return resposta.status(404).json({
                        "status": false,
                        "mensagem": "Usuário não encontrado!"
                    });
                }
                else{
                    usuario.excluir().then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Usuário excluído com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o usuário: " + erro.message
                        });
                    });
                }
                    }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça o ID do usuário!"
                });
            }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        
        if (requisicao.method === "GET") {
            Usuarios.consultar(termo).then((listaUsuarios) => {
                if (listaUsuarios.length === 0) {
                    resposta.json({
                        status: false,
                        mensagem: "Nenhum usuário encontrado!"
                    });
                }else{
                    resposta.json({
                        status: true,
                        usuarios: listaUsuarios.map(usuario => usuario.toJSON())
                      });
                }
            })
                .catch((erro) => {
                    resposta.json({
                        status: false,
                        mensagem: "Não foi possível obter os usuários: " + erro.message
                    });
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar usuários!"
            });
        }
    }
}

export default UsuarioCtrl;