import jwt from 'jsonwebtoken';

export function gerarToken(user) {
    const payload = {user};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });
    return token;
}

export function validarToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("Erro ao validar token:", error.message);
        return null; // Ou pode-se lançar um erro com `throw new Error("Token inválido")`
    }
}
