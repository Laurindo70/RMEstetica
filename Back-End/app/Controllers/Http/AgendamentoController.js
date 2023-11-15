'use strict'

const { validateAll } = use('Validator');
const Database = use("Database");
const Agendamento = use("App/Models/Agendamento");
const Pagamento = use("App/Models/Pagamento");

const { msgCadastro, msgCadastroPagamento } = require("../../../Utils/Validator/Messages/Agendamento");
const { camposCadastro, camposPagamento } = require("../../../Utils/Validator/fields/Agendamento");

class AgendamentoController {

   async post({ request, response, auth }) {
      const transacao = await Database.beginTransaction();
      try {

         const usuario = await auth.getUser();

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { profissional_id, procedimento_id, data_agendamento, hora_agendamento, nome_cliente } = request.all();

         const dadosProcedimento = await Database.raw(`select id, valor_procedimento as valor, duracao_procedimento from procedimento where id = ${procedimento_id};`);

         const verificacao = await Database.raw(`select * from agendamento 
         where is_cancelado = false 
         and profissional_id = ${profissional_id} and data_agendamento BETWEEN '${data_agendamento} ${hora_agendamento}' and (cast (CONCAT('${data_agendamento} ', (INTERVAL'${hora_agendamento}' + INTERVAL'${dadosProcedimento.rows[0].duracao_procedimento}')) as timestamp));`);

         if (verificacao.rows.length > 0) {
            return response.status(401).send({ mensagem: "Esse profissional já possui agendamento para esse horário." });
         }

         let agendamento;

         if (usuario.$attributes.nivel_permissao_id == 2) {
            agendamento = await Agendamento.create({
               profissional_id,
               procedimento_id,
               data_agendamento: `${data_agendamento} ${hora_agendamento}`,
               valor: dadosProcedimento.rows[0].valor,
               cliente_id: usuario.$attributes.id,
               nome_cliente: usuario.$attributes.nome_usuario
            }, transacao);
         } else {
            agendamento = await Agendamento.create({
               profissional_id,
               procedimento_id,
               data_agendamento: `${data_agendamento} ${hora_agendamento}`,
               valor: dadosProcedimento.rows[0].valor,
               nome_cliente
            }, transacao);
         }

         await transacao.commit();
         return response.status(201).send(agendamento);

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

   async finalizarAtendimento({ request, response, params }) {
      try {

         await Database
            .table('agendamento')
            .where('id', params.id)
            .update({
               is_finalizado: true,
               atualizado_em: new Date()
            });

         return response.status(200).send({ mensagem: 'Agendamento finalizado.' });

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

   async cancelarAtendimento({ request, response, params }) {
      try {

         await Database
            .table('agendamento')
            .where('id', params.id)
            .update({
               is_cancelado: true,
               atualizado_em: new Date()
            });

         return response.status(200).send({ mensagem: 'Agendamento cancelado.' });

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

   async getByData({ request, response, params }) {
      try {

         const datas = await Database.raw(`select agendamento.id, agendamento.valor, agendamento.nome_cliente, profissional.nome_profissional, TO_CHAR(data_agendamento, 'DD/MM/YYYY HH24:MI') as data, procedimento.nome_procedimento,
         agendamento.is_finalizado, agendamento.is_pago, agendamento.is_cancelado
         from agendamento 
         inner join profissional on profissional.id=agendamento.profissional_id
         inner join procedimento on procedimento.id=agendamento.procedimento_id
         where profissional.estabelecimento_id = ${params.id} and Date(agendamento.data_agendamento) BETWEEN '${params.dataInicial}' and '${params.dataFim}' order by data_agendamento`);

         console.log(`select agendamento.id, agendamento.valor, agendamento.nome_cliente, profissional.nome_profissional, TO_CHAR(data_agendamento, 'DD/MM/YYYY HH24:MI') as data, procedimento.nome_procedimento,
         agendamento.is_finalizado, agendamento.is_pago, agendamento.is_cancelado
         from agendamento 
         inner join profissional on profissional.id=agendamento.profissional_id
         inner join procedimento on procedimento.id=agendamento.procedimento_id
         where profissional.estabelecimento_id = ${params.id} and Date(agendamento.data_agendamento) BETWEEN '${params.dataInicial}' and '${params.dataFim}' order by data_agendamento`);
         console.log(datas.rows);

         return response.status(200).send(datas.rows);

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

   async datasAgenda({ request, response, params }) {
      try {

         const datas = await Database.raw(`select TO_CHAR(agendamento.data_agendamento, 'YYYY-MM-DD') as data from agendamento inner join profissional on profissional.id=agendamento.profissional_id
         where profissional.estabelecimento_id = ${params.id}
         group by data_agendamento`)

         return response.status(200).send(datas.rows);

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

   async pagamentoAgendamento({ request, response, params }) {
      const transacao = await Database.beginTransaction();
      try {

         const validacao = await validateAll(request.all(), camposPagamento, msgCadastroPagamento);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { formas_pagamento_id, data_pagamento, desconto } = request.all();

         const agendamento = await Database.raw(`select * from agendamento where id = ${params.id} `);

         const pagamento = await Pagamento.create({
            agendamento_id: params.id,
            formas_pagamento_id,
            valor: (+agendamento.rows[0].valor - (+desconto)),
            data_pagamento,
            desconto
         }, transacao);

         await transacao
            .table('agendamento')
            .where('id', params.id)
            .update({
               is_pago: true,
               atualizado_em: new Date()
            });

         await transacao.commit();
         return response.status(201).send(pagamento);

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

   async formasPagamento({ request, response }) {
      try {

         const formas = await Database.raw(`select * from formas_pagamento`)

         return response.status(200).send(formas.rows);

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

   async listaEstabelecimentosAgend({ request, response }) {
      try {

         const estabelecimentos = await Database.raw(`select id, nome_estabelecimento, 
         concat(endereco_logradouro, ' ', endereco_nome_logradouro, ', ', endereco_numero, ' - ', 
         endereco_bairro, ', ', endereco_cidade, ', ', endereco_estado, ' - ', endereco_cep) as endereco 
         from estabelecimento where estabelecimento.visivel_agendamento = true;`);

         return response.status(200).send(estabelecimentos.rows);

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

   async historicoAgendamento({ request, response, auth }) {
      try {

         const usuario = await auth.getUser();

         const agendamentos = await Database.raw(`select agendamento.id, agendamento.data_agendamento, agendamento.valor,
         procedimento.nome_procedimento, profissional.nome_profissional, estabelecimento.nome_estabelecimento
         from agendamento 
         INNER JOIN procedimento ON procedimento_id = procedimento.id
         INNER JOIN profissional ON profissional_id = profissional.id
         INNER JOIN estabelecimento ON procedimento.estabelecimento_id = estabelecimento.id
         where cliente_id = ${usuario.$attributes.id};`)

         return response.status(200).send(agendamentos.rows);

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

module.exports = AgendamentoController
