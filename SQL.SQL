CREATE TABLE cargos (
    c_id INT PRIMARY KEY AUTO_INCREMENT,
    c_nome VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios (
    u_id INT PRIMARY KEY AUTO_INCREMENT,
    u_nome VARCHAR(100) NOT NULL,
    u_email VARCHAR(100) UNIQUE NOT NULL,
    u_senha VARCHAR(255) NOT NULL
);

CREATE TABLE usuario_cargo (
    u_id INT,
    c_id INT,
    PRIMARY KEY (u_id, c_id),
    FOREIGN KEY (u_id) REFERENCES usuarios(u_id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES cargos(c_id) ON DELETE CASCADE
);

-- Inserindo cargos
-- INSERT INTO cargos (c_nome) VALUES 
-- ('Administrador'),
-- ('Desenvolvedor'),
-- ('Analista de Suporte'),
-- ('Gerente de Projeto');

-- Inserindo usuários
-- INSERT INTO usuarios (u_nome, u_email, u_senha) VALUES
-- ('João Silva', 'joao.silva@email.com', 'senha123'),
-- ('Maria Souza', 'maria.souza@email.com', 'senha123'),
-- ('Carlos Oliveira', 'carlos.oliveira@email.com', 'senha123'),
-- ('Ana Costa', 'ana.costa@email.com', 'senha123');

-- Associando usuários aos cargos na tabela intermediária
-- INSERT INTO usuario_cargo (u_id, c_id) VALUES
-- (1, 1),  -- João Silva como Administrador
-- (1, 2),  -- João Silva como Desenvolvedor
-- (2, 3),  -- Maria Souza como Analista de Suporte
-- (3, 2),  -- Carlos Oliveira como Desenvolvedor
-- (4, 4);  -- Ana Costa como Gerente de Projeto
