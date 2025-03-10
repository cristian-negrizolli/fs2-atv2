import express from "express";
import cors from "cors";
import rotaCargo from "./Rotas/rotaCargo.js";
import rotaUsuarios from "./Rotas/rotaUsuarios.js";
import rotaAutenticar from "./Rotas/rotaAutenticar.js";
import dotenv from "dotenv";
import { verificarAutenticacao } from "./Seguranca/autenticar.js";


dotenv.config(); 


const port = 4001;
const host = "0.0.0.0";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/cargos",verificarAutenticacao, rotaCargo);
app.use("/usuarios",verificarAutenticacao, rotaUsuarios);
app.use("/autenticar", rotaAutenticar);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})