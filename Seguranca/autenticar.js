import Usuarios from "../Modelo/usuario.js";
import { gerarToken, validarToken } from "./funcoesJWT.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        const { email, senha } = req.body;
        console.log("Email:", email);  // Verifica se o email está vindo correto
        console.log("Senha:", senha);  // Verifica se a senha está sendo recebida

        // Verifica se o usuário existe no banco de dados
        const user = await Usuarios.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ status: false, mensagem: "Usuário ou senha incorretos" });
        }

        console.log("Usuário encontrado:", user);

        // Verifica se a senha está correta
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (!passwordMatch) {
            return res.status(401).json({ status: false, mensagem: "Usuário ou senha incorretos" });
        }

        // Gera o token JWT
         // Gera o token JWT
         const token = gerarToken(user);  // Corrigido: agora o token é gerado e armazenado

         return res.status(200).json({ status: true, token }); // Retorna o token para o cliente
     
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ status: false, mensagem: "Erro interno do servidor" });
    }
}


  export async function verificarAutenticacao(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ status: false, mensagem: "Faça login!" });
    }

    const token = authHeader.split(" ")[1]; // Remove o "Bearer" e pega o token
    const tokenValido = validarToken(token);

    if (!tokenValido) {
        return res.status(401).json({ status: false, mensagem: "Token inválido ou expirado!" });
    }

    req.user = tokenValido; // Adiciona o usuário validado ao request
    next(); // Continua para a próxima rota
}
