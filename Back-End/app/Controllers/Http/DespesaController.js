'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Despesa = use("App/Models/Despesa");

const { msgCadastro } = require("../../../Utils/Validator/Messages/Despesas.js");
const { camposCadastro } = require("../../../Utils/Validator/fields/Despesas.js");

class DespesaController {
   
   async post({ request, response, auth }){
      try {

         const usuario = await auth.getUser();
         
         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const {
            estabelecimento_id,
            nome_despesa,
            valor_despesa
         } = request.all();

         const despesa = await Despesa.create({
            estabelecimento_id,
            nome_despesa,
            valor_despesa,
            usuario_id: usuario.$attributes.id
         });

         return response.status(201).send(despesa);

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
         
         const despesa = await Database
            .table('despesas')
            .where('id', params.id)
            .update({
               ativo: false,
               atualizado_em: new Date()
            });

         return response.status(200).send(despesa);

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

   async getAll({ request, response, auth }){
      try {
         
         const usuario = await auth.getUser();

         const despesas = await Database.select("despesas.id", "despesas.nome_despesa", "despesas.valor_despesa", "despesas.ativo", "usuario.nome_usuario as usuario", "estabelecimento.nome_estabelecimento as estabelecimento")
         .table('despesas')
         .innerJoin('usuario', 'despesas.usuario_id', 'usuario.id')
         .innerJoin('estabelecimento', 'despesas.estabelecimento_id', 'estabelecimento.id')
         .innerJoin('estabelecimento_has_usuario', 'despesas.estabelecimento_id', 'estabelecimento_has_usuario.estabelecimento_id')
         .where('estabelecimento_has_usuario.usuario_id', '=', usuario.$attributes.id);

         return response.status(200).send(despesas);

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

module.exports = DespesaController
