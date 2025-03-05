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
                    listaCargos: listaCargos.map(cargo => cargo.toJson())
                  });
                console.log("Lista de cargos no controlador:", listaCargos);

            }).catch((err) => {
                res.status(500).json({ status: false, erro: err});
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