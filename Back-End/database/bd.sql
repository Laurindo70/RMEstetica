CREATE TABLE nivel_permissao(
   id SERIAL PRIMARY KEY,
   nome_nivel VARCHAR(150) NOT NULL UNIQUE,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now()
);
INSERT INTO nivel_permissao (nome_nivel)
values ('Administrador'),
   ('Usuário Comum');
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
   usuario_id INTEGER NOT NULL,
   FOREIGN KEY(usuario_id) REFERENCES usuario(id),
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id)
);
CREATE TABLE produtos(
   id SERIAL PRIMARY KEY,
   estabelecimento_id INTEGER NOT NULL,
   nome_produto VARCHAR(150) NOT NULL,
   quantidade INTEGER DEFAULT 0,
   valor_produto DOUBLE PRECISION NOT NULL,
   ativo BOOLEAN DEFAULT TRUE,
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id),
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now()
);
CREATE TABLE despesas(
   id SERIAL PRIMARY KEY,
   estabelecimento_id INTEGER NOT NULL,
   usuario_id INTEGER NOT NULL,
   nome_despesa VARCHAR(150) NOT NULL,
   valor_despesa DOUBLE PRECISION NOT NULL,
   ativo BOOLEAN DEFAULT true,
   data_despesa timestamp DEFAULT now(),
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(usuario_id) REFERENCES usuario(id),
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id)
);
CREATE TABLE movimentacao_estoque(
   id SERIAL PRIMARY KEY,
   agendamento_id INTEGER,
   usuario_id INTEGER NOT NULL,
   estabelecimento_id INTEGER NOT NULL,
   data_movimentacao TIMESTAMP DEFAULT NOW(),
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   entrada BOOLEAN DEFAULT TRUE,
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id),
   FOREIGN KEY(usuario_id) REFERENCES usuario(id)
);
CREATE TABLE movimentacao_estoque_has_produtos(
   movimentacao_estoque_id INTEGER NOT NULL,
   produto_id INTEGER NOT NULL,
   quantidade INTEGER NOT NULL,
   FOREIGN KEY(movimentacao_estoque_id) REFERENCES movimentacao_estoque(id),
   FOREIGN KEY(produto_id) REFERENCES produtos(id)
);
CREATE TABLE profissional(
   id SERIAL PRIMARY KEY,
   estabelecimento_id INTEGER NOT NULL,
   nome_profissional VARCHAR(150) NOT NULL,
   horario_inicial_atendimento TIME NOT NULL,
   horario_final_atendimento TIME NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id)
);
CREATE TABLE procedimento(
   id SERIAL PRIMARY KEY,
   estabelecimento_id INTEGER NOT NULL,
   nome_procedimento VARCHAR(150) NOT NULL,
   duracao_procedimento TIME NOT NULL,
   ativo BOOLEAN DEFAULT TRUE,
   valor_procedimento DOUBLE PRECISION NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id)
);
CREATE TABLE procedimento_has_produtos(
   produto_id INTEGER NOT NULL,
   procedimento_id INTEGER NOT NULL,
   quantidade INTEGER NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(produto_id) REFERENCES produtos(id),
   FOREIGN KEY(procedimento_id) REFERENCES procedimento(id)
);
CREATE TABLE procedimento_has_proficional(
   profissional_id INTEGER NOT NULL,
   procedimento_id INTEGER NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(profissional_id) REFERENCES profissional(id),
   FOREIGN KEY(procedimento_id) REFERENCES procedimento(id)
);
CREATE TABLE formas_pagamento(
   id SERIAL PRIMARY KEY,
   nome_forma_pagamento VARCHAR(150) NOT NULL,
   estabelecimento_id INTEGER NOT NULL,
   FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimento(id)
);
CREATE TABLE agendamento(
   id SERIAL PRIMARY KEY,
   profissional_id INTEGER NOT NULL,
   procedimento_id INTEGER NOT NULL,
   data_agendamento TIMESTAMP NOT NULL,
   valor DOUBLE PRECISION NOT NULL,
   desconto DOUBLE PRECISION NOT NULL,
   cliente_id INTEGER,
   nome_cliente VARCHAR(150) NOT NULL,
   is_finalizado BOOLEAN default false,
   is_pago BOOLEAN default false,
   is_cancelado BOOLEAN default false,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(profissional_id) REFERENCES profissional(id),
   FOREIGN KEY(procedimento_id) REFERENCES procedimento(id)
);
CREATE TABLE pagamentos(
   id SERIAL PRIMARY KEY,
   agendamento_id INTEGER NOT NULL,
   formas_pagamento_id INTEGER NOT NULL,
   valor DOUBLE PRECISION NOT NULL,
   data_pagamento DATE NOT NULL,
   desconto DOUBLE PRECISION NOT NULL,
   criado_em timestamp without time zone DEFAULT now(),
   atualizado_em timestamp without time zone DEFAULT now(),
   FOREIGN KEY(agendamento_id) REFERENCES agendamento(id),
   FOREIGN KEY(formas_pagamento_id) REFERENCES formas_pagamento(id)
);
CREATE TABLE feedbacks(
	id SERIAL PRIMARY KEY,
	feedback TEXT NOT NULL,
	usuario_id INTEGER NOT NULL,
   	criado_em timestamp without time zone DEFAULT now(),
   	FOREIGN KEY(usuario_id) REFERENCES usuario(id)
);