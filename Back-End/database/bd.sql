CREATE TABLE nivel_permissao(
   id SERIAL PRIMARY KEY,
   nome_nivel VARCHAR(150) NOT NULL UNIQUE,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now()
);

INSERT INTO nivel_permissao (nome_nivel) values ('Administrador');

CREATE TABLE usuario(
   id SERIAL PRIMARY KEY,
   nivel_permissao_id INTEGER NOT NULL,
   nome_usuario VARCHAR(150) NOT NULL,
   cpf CHAR(14),
   senha VARCHAR(255) NOT NULL,
   email_usuario VARCHAR(150) NOT NULL UNIQUE,
   ativo BOOLEAN DEFAULT TRUE,
   usuario_criador INTEGER,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(nivel_permissao_id) REFERENCES nivel_permissao(id)
);

CREATE TABLE estabelecimento(
   id SERIAL PRIMARY KEY,
   nome_estabelecimento VARCHAR(150) NOT NULL,
   endereco_bairro VARCHAR(255) NOT NULL,
   endereco_numero INTEGER NOT NULL,
   endereco_logradouro VARCHAR(150) NOT NULL,
   endereco_nome_logradouro VARCHAR(150) NOT NULL,
   endereco_cidade VARCHAR(100) NOT NULL,
   endereco_estado VARCHAR(100) NOT NULL,
   endereco_complemento TEXT,
   endereco_cep CHAR(9) NOT NULL,
   ativo BOOLEAN DEFAULT TRUE,
   visivel_agendamento BOOLEAN NOT NULL,
   horario_abertura TIME NOT NULL,
   horario_fechamento_almoco TIME,
   horario_volta_almoco TIME,
   horario_fechamento TIME NOT NULL,
   fechamento_almoco BOOL NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now()
);

CREATE TABLE estabelecimento_has_usuario(
   estabelecimento_id INTEGER NOT NULL,
   usuario_id INTEGER NOT NULL
);