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

}

module.exports = PagamentoController
