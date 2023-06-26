'use strict'

const { validateAll } = use('Validator');
const Hash = use('Hash');

const Database = use("Database");
const Usuario = use("App/Models/Usuario");

const { msgCadastro, msgAtualizacao } = require('../../../Utils/Validator/Messages/Usuario.js');
const { camposCadastro, camposAtualizacao } = require('../../../Utils/Validator/fields/Usuario.js');

class UsuarioController {

   async post({ request, response }) {
      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_usuario, nivel_permissao_id, senha, email_usuario, cpf } = request.all();

         const usuarioCadastrado = await Usuario.create({
            nome_usuario,
            nivel_permissao_id,
            senha,
            email_usuario,
            cpf
         });

         return response.status(201).send(usuarioCadastrado);

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

   async delete({ request, response, params }){
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

   async login({ request, response, auth }){
      try {
         
         const { email_usuario, senha } = request.all();

         const permissao =  await Database
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

}

module.exports = UsuarioController
