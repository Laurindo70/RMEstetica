'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Despesa = use("App/Models/Despesa");
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

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { agendamento_id = null, estabelecimento_id, entrada, produtos } = request.all();

         if (produtos.length <= 0) {
            return response.status(417).send({ mensagem: "É necessario selecionar pelo menos um produto." });
         }

         const movimentacao = await Movimentacao.create({
            estabelecimento_id,
            agendamento_id,
            entrada,
            usuario_id: usuario.$attributes.id
         }, transacao);

         for (let i = 0; i < produtos.length; i++) {
            await MovimentacaoProdutos.create({
               movimentacao_estoque_id: movimentacao.$attributes.id,
               produto_id: produtos[i].produto_id,
               quantidade: produtos[i].quantidade
            }, transacao);

            if (entrada) {
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

         if (entrada) {
            const total = await transacao.raw(`SELECT SUM( movimentacao_estoque_has_produtos.quantidade*produtos.valor_produto) as total from movimentacao_estoque_has_produtos inner join produtos on produtos.id=movimentacao_estoque_has_produtos.produto_id
            where movimentacao_estoque_id = ${movimentacao.$attributes.id}`);
            await Despesa.create({
               estabelecimento_id,
               nome_despesa: `Mov estoque - ${movimentacao.$attributes.criado_em}`,
               valor_despesa: total.rows[0].total,
               usuario_id: usuario.$attributes.id
            });
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

   async getAll({ request, response, params }) {
      try {

         let movimentacoes = [];

         const consulta = await Database.raw(`select movimentacao_estoque.id, movimentacao_estoque.entrada, to_char(data_movimentacao, 'DD/MM/YYYY ás HH24:MI') as data, usuario.nome_usuario as usuario
from movimentacao_estoque INNER JOIN usuario on usuario.id=movimentacao_estoque.usuario_id
where movimentacao_estoque.estabelecimento_id = ${params.estabelecimentoId} and movimentacao_estoque.data_movimentacao BETWEEN '${params.dataInicio} 00:00:00.0' and '${params.dataFim} 23:59:59.0';`);

         for (let i = 0; i < consulta.rows.length; i++) {
            const produtos = await Database.raw(`select produtos.id as key, produtos.nome_produto, movimentacao_estoque_has_produtos.quantidade 
            from movimentacao_estoque_has_produtos INNER JOIN produtos on produtos.id=movimentacao_estoque_has_produtos.produto_id
            where movimentacao_estoque_id = ${consulta.rows[i].id};`);
            movimentacoes.push({
               key: consulta.rows[i].id,
               data: consulta.rows[i].data,
               entrada: consulta.rows[i].entrada,
               usuario: consulta.rows[i].usuario,
               produtos: produtos.rows
            });
         }

         return response.status(200).send(movimentacoes);

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
