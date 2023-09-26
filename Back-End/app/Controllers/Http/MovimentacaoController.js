'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Movimentacao = use("App/Models/MovimentacaoEstoque");
const MovimentacaoProdutos = use("App/Models/MovimentacaoEstoqueHasProduto");

class MovimentacaoController {

   async post({ request, response, auth }) {
      const transacao = await Database.beginTransaction();
      try {
         const usuario = await auth.getUser();

         const validacao = await validateAll(request.all(), {
            entrada: 'required', estabelecimento_id: 'required'
         }, {
            "entrada.required": "É necessario preencher se é entrada ou saída.",
            "estabelecimento_id": "É necessario selecionar o estabelecimento."
         });

         if(validacao.fails()){
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { agendamento_id = null, estabelecimento_id, entrada, produtos } = request.all();

         if(produtos.length <= 0){
            return response.status(417).send({ mensagem: "É necessario selecionar pelo menos um produto." });
         }

         const movimentacao = await Movimentacao.create({
            estabelecimento_id,
            agendamento_id,
            entrada,
            usuario_id: usuario.$attributes.id
         }, transacao);

         for(let i = 0; i < produtos.length; i++){
            await MovimentacaoProdutos.create({
               movimentacao_estoque_id: movimentacao.$attributes.id,
               produto_id: produtos[i].produto_id,
               quantidade: produtos[i].quantidade
            }, transacao);

            if(entrada){
               await transacao.raw(`UPDATE produtos set quantidade = ${produtos[i].quantidade} + (select quantidade from produtos WHERE id = ${produtos[i].produto_id}) where id = ${produtos[i].produto_id}; `);
            } else {
               await transacao.raw(`UPDATE produtos 
               set quantidade = case
                  when (select quantidade from produtos WHERE id = ${produtos[i].produto_id}) - ${produtos[i].quantidade}  < 0 then 0
                  else (select quantidade from produtos WHERE id = ${produtos[i].produto_id}) - ${produtos[i].quantidade} 
               end
               where id = ${produtos[i].produto_id};`);
            }
         }

         await transacao.commit();
         return response.status(201).send(movimentacao);
         
      } catch (error) {
         await transacao.rollback();
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         );
      }
   }

   async getAll({ request, response, params }){
      try {
         
         // const estabelecimentos = await 

      } catch (error) {
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         );
      }
   }

}

module.exports = MovimentacaoController
