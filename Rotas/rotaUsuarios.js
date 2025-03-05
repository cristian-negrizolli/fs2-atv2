import { Router } from "express";
import UsuariosCtrl from "../Controle/usuariosCtrl.js";

const usuarioCtrl = new UsuariosCtrl();
const rotaUsuarios = new Router();

rotaUsuarios.post("/", usuarioCtrl.gravar).
get("/:termo?", usuarioCtrl.consultar)
.post('/', usuarioCtrl.gravar)
.patch('/', usuarioCtrl.atualizar)
.put('/', usuarioCtrl.atualizar)
.delete('/', usuarioCtrl.excluir);

export default rotaUsuarios;

