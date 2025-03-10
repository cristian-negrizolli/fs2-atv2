import Cargos from "../Modelo/Cargo.js";

class CargosCtrl {

    async gravar(req, res) {
        res.type("application/json");
    
        try {
            // Verifica se o cargo já existe no banco
            if (await Cargos.existeCargoByName(req.body.nome)) {
                return res.status(400).json({ status: false, erro: "Cargo já cadastrado" });
            }
    
            // Verifica se a requisição é POST e se o conteúdo é JSON
            if (req.method === "POST" && req.is("application/json")) {
                const { nome, descricao } = req.body;
    
                if (!nome) {
                    return res.status(400).json({ erro: "Dados inválidos, nome não informado" });
                }
    
                // Cria um novo cargo e tenta salvar no banco
                const cargo = new Cargos(0, nome, descricao);
                
                await cargo.gravar();
    
                return res.status(200).json({
                    status: true,
                    codigoCargo: cargo.id,
                    mensagem: "Cargo gravado com sucesso"
                });
            } else {
                return res.status(400).json({ erro: "Requisição inválida" });
            }
        } catch (err) {
            console.error("Erro ao gravar cargo:", err);
            return res.status(500).json({ erro: "Erro interno do servidor" });
        }
    }
    

    consultar(req, res) {
        res.type("application/json");
        let termo = req.params.termo
        if(!termo) {
            termo = '';
        }
        if(req.method==="GET") {
            const cargos = new Cargos();
            cargos.consultar(termo).then((listaCargos) => {
                if(listaCargos.length === 0) {
                    res.json({
                        status: false,
                        erro: "Nenhum cargo encontrado"
                    })
                }
                else{
                    res.json({
                        status: true,
                        listaCargos: listaCargos.map(cargo => cargo.toJSON())
                      });
                }
            }).catch((err) => {
                res.status(500).json({ status: false, erro: err});
            });
        }
    }

    async atualizar(req, res) {
        res.type("application/json");
        const id = req.params.id;
        const dados = req.body;
        const nome = dados.nome;
        const descricao = dados.descricao;
        const cargos = new Cargos(id, nome, descricao);
        
        if(!await Cargos.existeCargo(id)) {
            return res.status(404).json({ status: false, erro: "Cargo não encontrado"});
        }
        else{
            cargos.atualizar().then(() => {
                res.status(200).json({
                    status: true,
                    mensagem: "Cargo atualizado com sucesso"
                });
            }).catch((err) => {
                res.status(500).json({ status: false, erro: err});
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
            const dados = requisicao.params;
            const id = dados.id;

            if (!await Cargos.existeCargo(id)) {
                return resposta.status(404).json({
                    "status": false,
                    "mensagem": "Cargo nao encontrado!"
                });
            }

            if (id) {
                const cargos = new Cargos(id);

                cargos.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Cargo excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o usuário: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, forneça o ID do usuário!"
                });
            }
    }


    possuiCargos(req, res) {
        let id = req.params.id
        const cargos = new Cargos(id);
        
        cargos.possuiCargos().then((possui) => {
            res.json({
                status: true,
                possuiCargos: possui
                });
        }).catch((err) => {
            res.status(500).json({ status: false, erro: err});
        });
    }

}

export default CargosCtrl;