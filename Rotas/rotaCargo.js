import { Router } from "express";
import CargosCtrl from "../Controle/cargosCtrl.js";

const cargosCtrl = new CargosCtrl();
const rotaCargo = new Router();

rotaCargo.post("/", cargosCtrl.gravar).
get("/:termo?", cargosCtrl.consultar)
.get("/possui/:id", cargosCtrl.possuiCargos);

export default rotaCargo;