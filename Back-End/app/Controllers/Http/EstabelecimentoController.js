'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Estabelecimento = use("App/Models/Estabelecimento");
const UsuarioEstabelecimento = use("App/Models/EstabelecimentoHasUsuario");

const { msgCadastro, msgAtualizacao } = require('../../../Utils/Validator/Messages/Estabelecimento.js');
const { camposCadastro, camposAtualizacao } = require('../../../Utils/Validator/fields/Estabelecimentos.js');

class EstabelecimentoController {


   async post({ request, response }) {
      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const {
            nome_estabelecimento,
            endereco_bairro,
            endereco_numero,
            endereco_logradouro,
            endereco_nome_logradouro,
            endereco_cidade,
            endereco_estado,
            endereco_cep,
            visivel_agendamento,
            horario_abertura,
            horario_fechamento,
            fechamento_almoco,
            endereco_complemento,
            horario_fechamento_almoco,
            horario_volta_almoco
         } = request.all();

         const estabelecimentoCadastrado = await Estabelecimento.create({
            nome_estabelecimento,
            endereco_bairro,
            endereco_numero,
            endereco_logradouro,
            endereco_nome_logradouro,
            endereco_cidade,
            endereco_estado,
            endereco_cep,
            visivel_agendamento,
            horario_abertura,
            horario_fechamento,
            fechamento_almoco,
            endereco_complemento,
            horario_fechamento_almoco,
            horario_volta_almoco
         });

         return response.status(201).send(estabelecimentoCadastrado);

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

   async cadastroEmpresa({ request, response, auth }){
      const transacao = await Database.beginTransaction();
      try {

         const usuario = await auth.getUser();

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const {
            nome_estabelecimento,
            endereco_bairro,
            endereco_numero,
            endereco_logradouro,
            endereco_nome_logradouro,
            endereco_cidade,
            endereco_estado,
            endereco_cep,
            visivel_agendamento,
            horario_abertura,
            horario_fechamento,
            fechamento_almoco,
            endereco_complemento,
            horario_fechamento_almoco,
            horario_volta_almoco
         } = request.all();

         const estabelecimentoCadastrado = await Estabelecimento.create({
            nome_estabelecimento,
            endereco_bairro,
            endereco_numero,
            endereco_logradouro,
            endereco_nome_logradouro,
            endereco_cidade,
            endereco_estado,
            endereco_cep,
            visivel_agendamento,
            horario_abertura,
            horario_fechamento,
            fechamento_almoco,
            endereco_complemento,
            horario_fechamento_almoco,
            horario_volta_almoco
         }, transacao);

         await UsuarioEstabelecimento.create({
            usuario_id: usuario.$attributes.id ,
            estabelecimento_id: estabelecimentoCadastrado.$attributes.id
         }, transacao);

         await transacao.commit();

         return response.status(201).send(estabelecimentoCadastrado);

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

         const validacaoCadastro = await Database.from('estabelecimento').where('id', '=', params.id);

         if(validacaoCadastro.length == 0){
            return response.status(404).send({ mensagem: 'Estabelecimento não encontrado.' });
         }

         const {
            endereco_bairro,
            endereco_numero,
            endereco_logradouro,
            endereco_nome_logradouro,
            endereco_cidade,
            endereco_estado,
            endereco_cep,
            visivel_agendamento,
            horario_abertura,
            horario_fechamento,
            fechamento_almoco,
            endereco_complemento,
            horario_fechamento_almoco,
            horario_volta_almoco
         } = request.all();

         const estabelecimentoAtualizado = await Database
            .table('estabelecimento')
            .where('id', params.id)
            .update({
               endereco_bairro,
               endereco_numero,
               endereco_logradouro,
               endereco_nome_logradouro,
               endereco_cidade,
               endereco_estado,
               endereco_cep,
               visivel_agendamento,
               horario_abertura,
               horario_fechamento,
               fechamento_almoco,
               endereco_complemento,
               horario_fechamento_almoco,
               horario_volta_almoco,
               atualizado_em: new Date()
            });

         return response.status(200).send(estabelecimentoAtualizado);

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

         const validacaoCadastro = await Database.from('estabelecimento').where('id', '=', params.id);

         if(validacaoCadastro.rows == 0){
            return response.status(404).send({ mensagem: 'Estabelecimento não encontrado.' });
         }

         const estabelecimentoAtualizado = await Database
            .table('estabelecimento')
            .where('id', params.id)
            .update({
               ativo: false,
               atualizado_em: new Date()
            });

         return response.status(200).send(estabelecimentoAtualizado);

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

   async getAll({ request, response, params, auth }){
      try {

         const usuario = await auth.getUser();

         if(params.nome == null){
            const estabelecimentos = await Database.select('estabelecimento.id', 'estabelecimento.nome_estabelecimento', 'estabelecimento.ativo as situacao', 'estabelecimento.ativo', 'estabelecimento.horario_abertura', 'estabelecimento.horario_fechamento', 'estabelecimento.fechamento_almoco', 'estabelecimento.horario_fechamento_almoco', 'estabelecimento.horario_volta_almoco', 'estabelecimento.visivel_agendamento')
               .table('estabelecimento')
               .innerJoin('estabelecimento_has_usuario', 'estabelecimento.id', 'estabelecimento_has_usuario.estabelecimento_id')
               .where('estabelecimento_has_usuario.usuario_id', '=', usuario.$attributes.id);
            
            return response.status(200).send(estabelecimentos);
         }

         const estabelecimentos = await Database.select('estabelecimento.id', 'estabelecimento.nome_estabelecimento', 'estabelecimento.ativo as situacao', 'estabelecimento.ativo', 'estabelecimento.horario_abertura', 'estabelecimento.horario_fechamento', 'estabelecimento.fechamento_almoco', 'estabelecimento.horario_fechamento_almoco', 'estabelecimento.horario_volta_almoco', 'estabelecimento.visivel_agendamento')
            .table('estabelecimento').innerJoin('estabelecimento_has_usuario', 'estabelecimento.id', 'estabelecimento_has_usuario.estabelecimento_id')
            .where('estabelecimento_has_usuario.usuario_id', '=', usuario.$attributes.id)
            .andWhere('nome_estabelecimento', 'ILIKE', `%${params.nome}%`);

         return response.status(200).send(estabelecimentos);

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

   async getById({ request, response, params }){
      try {
         
         const estabelecimento = await Database.select("*").from('estabelecimento').where('id', '=', params.id);

         if(estabelecimento.length == 0) { return response.status(404).send("Estabelecimento não encontrado.") }

         return response.status(200).send(estabelecimento);

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

module.exports = EstabelecimentoController
