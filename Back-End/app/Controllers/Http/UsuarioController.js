'use strict'

const { validateAll } = use('Validator');
const Hash = use('Hash');

const Database = use("Database");
const Usuario = use("App/Models/Usuario");
const UsuarioEstabelecimento = use("App/Models/EstabelecimentoHasUsuario");

const { msgCadastro, msgAtualizacao } = require('../../../Utils/Validator/Messages/Usuario.js');
const { camposCadastro, camposAtualizacao } = require('../../../Utils/Validator/fields/Usuario.js');

class UsuarioController {

   async post({ request, response }) {
      const transacao = await Database.beginTransaction();
      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_usuario, nivel_permissao_id, senha, email_usuario, cpf, estabelecimento_id } = request.all();

         let usuarioCadastrado;

         if (estabelecimento_id) {

            usuarioCadastrado = await Usuario.create({
               nome_usuario,
               nivel_permissao_id,
               senha,
               email_usuario,
               cpf
            }, transacao);

            await UsuarioEstabelecimento.create({
               usuario_id: usuarioCadastrado.id,
               estabelecimento_id
            }, transacao);

            await transacao.commit();
            return response.status(201).send(usuarioCadastrado);

         }

         usuarioCadastrado = await Usuario.create({
            nome_usuario,
            nivel_permissao_id,
            senha,
            email_usuario,
            cpf
         });


         return response.status(201).send(usuarioCadastrado);

      } catch (error) {
         await transacao.rollback();
         console.log(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async put({ request, response, params }) {
      try {

         const validacao = await validateAll(request.all(), camposAtualizacao, msgAtualizacao);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_usuario, nivel_permissao_id, senha, cpf } = request.all();

         if (senha) {
            const usuarioAtualizado = await Database
               .table('usuario')
               .where('id', params.id)
               .update({
                  nome_usuario,
                  senha: await Hash.make(senha),
                  nivel_permissao_id,
                  cpf,
                  atualizado_em: new Date()
               });
            return response.status(200).send(usuarioAtualizado);
         }

         const usuarioAtualizado = await Database
            .table('usuario')
            .where('id', params.id)
            .update({
               nome_usuario,
               nivel_permissao_id,
               cpf,
               atualizado_em: new Date()
            });

         return response.status(200).send(usuarioAtualizado);

      } catch (error) {
         console.log(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async delete({ request, response, params }) {
      try {

         const usuarioAtualizado = await Database
            .table('usuario')
            .where('id', params.id)
            .update({
               ativo: false,
               atualizado_em: new Date()
            });

         return response.status(200).send(usuarioAtualizado);

      } catch (error) {
         console.log(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async login({ request, response, auth }) {
      try {

         const { email_usuario, senha } = request.all();

         const permissao = await Database
            .table('usuario')
            .where('email_usuario', email_usuario)
            .first()

         if (!permissao) {
            return response.status(401).send({ mensagem: "Usuario não cadastrado." });
         }

         if (!permissao.ativo) {
            return response.status(417).send({ mensagem: "Usuario inativado." });
         }

         const token = await auth.attempt(email_usuario, senha);

         return response.status(200).send({ token: token.token, permissao });

      } catch (error) {
         console.log(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async get({ request, response, params }){
      try {
         
         const nome = await params.nome || '';

         console.log(nome);

         const usuarios = await Database
            .raw(`select nome_usuario, email_usuario, ativo, nivel_permissao.nome_nivel as permissao from usuario 
            inner JOIN nivel_permissao on nivel_permissao.id=usuario.nivel_permissao_id 
            where nome_usuario ilike '%${nome}%'`);
         console.log(usuarios.rows);

         return response.status(200).send(usuarios.rows);

      } catch (error) {
         console.log(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

}

module.exports = UsuarioController
