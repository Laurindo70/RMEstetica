'use strict'

const { validateAll } = use('Validator');
const Database = use("Database");
const Pagamento = use("App/Models/Pagamento");

const { msgCadastroPagamento } = require("../../../Utils/Validator/Messages/Agendamento");
const { camposPagamento } = require("../../../Utils/Validator/fields/Agendamento");
class PagamentoController {

   async post({ request, response, params }) {
      const transacao = await Database.beginTransaction();
      try {

         const { pagamentos } = request.all();

         if (pagamentos.length <= 0) {
            await transacao.commit();
            return response.status(417).send({ msg: 'É necessario preencher as formas de pagamento' });
         }

         let pagamentosCadastrados = []

         for (let i = 0; i < pagamentos.length; i++) {
            const validacao = await validateAll(pagamentos[i], camposPagamento, msgCadastroPagamento);
            if (validacao.fails()) {
               return response.status(417).send({ mensagem: validacao.messages() });
            }
            try {
               pagamentosCadastrados.push(
                  await Pagamento.create({
                     agendamento_id: params.id,
                     formas_pagamento_id: pagamentos[i].formaPagamento,
                     valor: +pagamentos[i].valor,
                     data_vencimento: pagamentos[i].data,
                     desconto: 0
                  }, transacao)
               );
            } catch (error) {
               console.error(error);
               throw new Error("Erro ao realizar cadastro de nova parcela de pagamento.");
            }

         }

         await transacao.commit();
         return response.status(201).send(pagamentosCadastrados);

      } catch (error) {
         await transacao.rollback();
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async getById({ request, response, params }) {
      try {

         const parcelas = await Database.raw(`select pagamentos.id, formas_pagamento.nome_forma_pagamento as nome_forma_pagamento,formas_pagamento_id as forma_pagamento, valor, is_pago, to_char(data_vencimento, 'DD/MM/YYYY') as data_vencimento from pagamentos inner JOIN formas_pagamento on formas_pagamento.id = pagamentos.formas_pagamento_id
         where pagamentos.agendamento_id = ${params.id};`);

         console.log(parcelas.rows);

         return response.status(200).send(parcelas.rows);

      } catch (error) {
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async baixaParcela({ request, response, params }) {
      const transacao = await Database.beginTransaction();
      try {

         const { forma_pagamento, agendamento_id } = request.all();

         await transacao
            .table('pagamentos')
            .where('id', params.id)
            .update({
               is_pago: true,
               atualizado_em: new Date(),
               data_pagamento: new Date(),
               formas_pagamento_id: forma_pagamento
            });

         const agendamento = await transacao.raw(`select count(*) as total from pagamentos where agendamento_id = ${agendamento_id} and is_pago = false;`);

         if (agendamento.rows[0].total == 0) {
            await transacao
               .table('agendamento')
               .where('id', agendamento_id)
               .update({
                  is_pago: true,
                  atualizado_em: new Date()
               });
         }

         await transacao.commit();
         return response.status(201).send({msg: 'Parcela baixa com sucesso!!'});

      } catch (error) {
         await transacao.rollback();
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

   async dashboard({ request, response, params }){
      try {

         const { ano } = request.all();

         const monetario = await Database.raw(`select (select sum(pagamentos.valor) as total from pagamentos 
         inner join agendamento on agendamento_id=agendamento.id
         inner join profissional on profissional.id=agendamento.profissional_id
         where EXTRACT(YEAR from data_pagamento) = ${ano} and profissional.estabelecimento_id = ${params.id} and pagamentos.is_pago = true) as arrecadado,
         (select sum(valor_despesa) as total from despesas
         where EXTRACT(YEAR from data_despesa) = ${ano} and despesas.estabelecimento_id = ${params.id}) as gasto,
         (select sum(agendamento.valor) from agendamento
         inner join profissional on profissional.id=agendamento.profissional_id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and profissional.estabelecimento_id = ${params.id} and agendamento.is_cancelado = FALSE and agendamento.is_pago = false
         ) as pendente`);

         const agendamentos = await Database.raw(`select (select COUNT(*) as total from agendamento
         inner JOIN profissional ON agendamento.profissional_id = profissional.id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and profissional.estabelecimento_id = ${params.id} and is_cancelado = true) as cancelado, 
         (select COUNT(*) as total from agendamento
         inner JOIN profissional ON agendamento.profissional_id = profissional.id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and profissional.estabelecimento_id = ${params.id} and is_finalizado = true and is_cancelado = false) as finalizado, 
         (select COUNT(*) as total from agendamento
         inner JOIN profissional ON agendamento.profissional_id = profissional.id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and profissional.estabelecimento_id = ${params.id} and is_finalizado = FALSE and is_cancelado = false) as pendente,
         (select COUNT(*) as total from agendamento
         inner JOIN profissional ON agendamento.profissional_id = profissional.id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and profissional.estabelecimento_id = ${params.id}) as total;`);
         
         const dadosRecebimento = await Database.raw(`SELECT 
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 1 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Jan,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 2 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Fev,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 3 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Mar,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 4 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Abr,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 5 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Mai,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 6 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Jun,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 7 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Jul,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 8 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Ago,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 9 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Set,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 10 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Out,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 11 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Nov,
         sum(case when (EXTRACT(MONTH FROM data_pagamento)= 12 and EXTRACT(YEAR from data_pagamento) = ${ano}) then pagamentos.valor else 0 end) as Dez
       FROM 
         pagamentos
         inner join agendamento on agendamento_id=agendamento.id
         inner join profissional on profissional.id=agendamento.profissional_id
         where profissional.estabelecimento_id = ${params.id};`);

         const dadosDespesas = await Database.raw(`SELECT 
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 1 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Jan,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 2 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Fev,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 3 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Mar,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 4 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Abr,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 5 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Mai,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 6 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Jun,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 7 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Jul,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 8 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Ago,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 9 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Set,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 10 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Out,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 11 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Nov,
         sum(case when (EXTRACT(MONTH FROM data_despesa)= 12 and EXTRACT(YEAR from data_despesa) = ${ano}) then valor_despesa else 0 end) as Dez
       FROM 
         despesas
         where estabelecimento_id = ${params.id};`);

         const procedimentos = await Database.raw(`select sum(agendamento.valor), procedimento.id, procedimento.nome_procedimento from agendamento
         inner JOIN procedimento ON agendamento.procedimento_id = procedimento.id
         where EXTRACT(YEAR from data_agendamento) = ${ano} and agendamento.is_pago = true and agendamento.is_cancelado = FALSE and procedimento.estabelecimento_id = ${params.id}
         GROUP BY agendamento.procedimento_id, procedimento.nome_procedimento, procedimento.id;`);
         let procedimento = [];
         for(let i = 0; i < procedimentos.rows.length; i++){
            let consultaProcedimento = await Database.raw(`SELECT (case
               when sum(valor) is NULL THEN 0
               else sum(valor)
            end) as sum
            from agendamento where agendamento.procedimento_id = ${procedimentos.rows[i].id} and is_pago = false and is_cancelado = FALSE;`)
            procedimento.push({
               nome_procedimento: procedimentos.rows[i].nome_procedimento,
               pago: procedimentos.rows[i].sum,
               pendente: consultaProcedimento.rows[0].sum
            })
         }


         return response.status(200).send({ dadosRecebimento: dadosRecebimento.rows[0], dadosDespesas: dadosDespesas.rows[0], arrecadado: monetario.rows[0].arrecadado, gasto: monetario.rows[0].gasto, pendente: monetario.rows[0].pendente, agendamentos: agendamentos.rows[0], procedimentos: procedimento });

      } catch (error) {
         console.error(error);
         return response.status(500).send(
            {
               erro: error.message.toString(),
               mensagem: "Servidor não conseguiu processar a solicitação."
            }
         )
      }
   }

}

module.exports = PagamentoController
