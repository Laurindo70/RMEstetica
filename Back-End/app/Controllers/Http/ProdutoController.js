'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Produto = use("App/Models/Produto");

const { msgCadastro } = require("../../../Utils/Validator/Messages/Produtos.js");
const { camposCadastro } = require("../../../Utils/Validator/fields/Produtos.js");

class ProdutoController {

   async post({ request, response }) {
      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const {
            estabelecimento_id,
            nome_produto,
            valor_produto
         } = request.all();

         const produto = await Produto.create({
            estabelecimento_id,
            nome_produto,
            valor_produto
         });

         return response.status(201).send(produto);

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

         const produto = await Database
            .table('produtos')
            .where('id', params.id)
            .update({
               ativo: false,
               atualizado_em: new Date()
            });

         return response.status(200).send(produto);

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

   async getAll({ request, response, params }) {
      try {

         const produtos = await Database.select("id", "nome_produto", "quantidade", "valor_produto", "ativo")
            .table("produtos")
            .where('estabelecimento_id', '=', params.estabelecimentoId)
            .orderBy('nome_produto');

         return response.status(200).send(produtos);

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

module.exports = ProdutoController
