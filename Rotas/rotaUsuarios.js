import { Router } from "express";
import UsuariosCtrl from "../Controle/usuariosCtrl.js";

const usuarioCtrl = new UsuariosCtrl();
const rotaUsuarios = new Router();

rotaUsuarios.post("/", usuarioCtrl.gravar).
get("/:termo?", usuarioCtrl.consultar)
.post('/', usuarioCtrl.gravar)
.put('/:id', usuarioCtrl.atualizar)
.delete('/:id', usuarioCtrl.excluir);

export default rotaUsuarios;

