import { Router } from "express";
import { login } from "../Seguranca/autenticar.js"; // Inclui extensão .js

const rotaAutenticar = Router(); 

rotaAutenticar.post("/login", login);

export default rotaAutenticar;
