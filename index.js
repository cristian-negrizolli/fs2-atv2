import express from "express";
import cors from "cors";
import rotaCargo from "./Rotas/rotaCargo.js";
import rotaUsuarios from "./Rotas/rotaUsuarios.js";

const port = 4001;
const host = "0.0.0.0";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/cargos", rotaCargo);
app.use("/usuarios", rotaUsuarios);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})