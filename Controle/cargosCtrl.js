import Cargos from "../Modelo/cargo.js";

class CargosCtrl {

    gravar(req, res) {
        res.type("application/json");
        if(req.method==="POST" && req.is("application/json")) {
            const dados = req.body;
            const nome = dados.nome
            if(nome)
            {
                const cargo = new Cargos(0, dados.nome, dados.descricao);
                cargo.gravar().then(() => {
                    res.status(200).json({
                        stutus : true,
                        "codigoCargo" : cargo.id,
                        "msg": "Cargo gravado com sucesso"
                    });
                }).catch((err) => {
                    res.status(500).json({erro: err});
                });
            }
            else
            {
                res.status(500).json({erro: "Dados inválidos, nome não informado"});
            } 
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
                res.json({
                    status: true,
                    listaCargos: listaCargos.map(cargo => cargo.toJSON())
                  });
            }).catch((err) => {
                res.status(500).json({ status: false, erro: err});
            });
        }
    }

    async atualizar(req, res) {
        res.type("application/json");
        const id = req.params.id;
        const nonExists = !await Cargos.existeCargo(id);
        if(nonExists) {
            return res.status(404).json({ status: false, erro: "Cargo não encontrado"});
        }
        const dados = req.body;
        const nome = dados.nome;
        const descricao = dados.descricao;
        const cargos = new Cargos(id, nome, descricao);

        cargos.atualizar().then(() => {
            res.status(200).json({
                status: true,
                mensagem: "Cargo atualizado com sucesso"
            });
        }).catch((err) => {
            res.status(500).json({ status: false, erro: err});
        });
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
            const dados = requisicao.params;
            const id = dados.id;
           
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