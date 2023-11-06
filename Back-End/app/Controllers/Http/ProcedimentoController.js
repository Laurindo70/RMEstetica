'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Procedimento = use("App/Models/Procedimento");
const ProcedimentoProfissional = use("App/Models/ProcedimentoHasProfissional");
const ProcedimentoProdutos = use("App/Models/ProcedimentosHasProduto");

const { msgCadastro } = require("../../../Utils/Validator/Messages/Procedimento.js");
const { camposCadastro } = require("../../../Utils/Validator/fields/Procedimento.js");

class ProcedimentoController {

   async post({ request, response }) {
      const transacao = await Database.beginTransaction();

      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_procedimento, duracao_procedimento, valor_procedimento, estabelecimento_id, profissionais, produtos } = request.all();

         const procedimento = await Procedimento.create({
            estabelecimento_id,
            nome_procedimento,
            duracao_procedimento,
            valor_procedimento
         }, transacao);

         for(let i = 0; i < produtos.length; i++){
            await ProcedimentoProdutos.create({
               procedimento_id: procedimento.$attributes.id,
               produto_id: produtos[i].produto_id,
               quantidade: produtos[i].quantidade
            }, transacao);
         }

         for(let i = 0; i < profissionais.length; i++){
            await ProcedimentoProfissional.create({
               procedimento_id: procedimento.$attributes.id,
               profissional_id: profissionais[i],
            }, transacao);
         }

         await transacao.commit();
         return response.status(201).send(procedimento);

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

   async getAll({ request, response, params }){
      try {
         let procedimentos = [];
         const consultaProcedimentos = await Database.raw(`select procedimento.id, nome_procedimento, duracao_procedimento as tempo, valor_procedimento, ativo from procedimento where procedimento.estabelecimento_id = ${params.id};`);

         for(let i = 0; i < consultaProcedimentos.rows.length; i++){
            const produtos = await Database.raw(`select produtos.id, produtos.nome_produto, procedimento_has_produtos.quantidade from procedimento_has_produtos
            inner join produtos on procedimento_has_produtos.produto_id=produtos.id
            where procedimento_has_produtos.procedimento_id = ${consultaProcedimentos.rows[i].id};`);
            const profissionais = await Database.raw(`select profissional.id, profissional.nome_profissional from procedimento_has_proficional 
            inner join profissional on profissional.id = procedimento_has_proficional.profissional_id
            where procedimento_has_proficional.procedimento_id = ${consultaProcedimentos.rows[i].id};`)

            procedimentos.push({
               id: consultaProcedimentos.rows[i].id,
               nome_procedimento: consultaProcedimentos.rows[i].nome_procedimento,
               tempo: consultaProcedimentos.rows[i].tempo,
               valor: consultaProcedimentos.rows[i].valor,
               ativo: consultaProcedimentos.rows[i].ativo,
               produtos: produtos.rows,
               valor: consultaProcedimentos.rows[i].valor_procedimento,
               profissionais: profissionais.rows
            });
         }

         return response.status(200).send(procedimentos);

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

   async delete({ request, response, params }) {
      try {

         const sitProced = await Database.raw(`select * from procedimento where id = ${params.id};`);

         const procedimento = await Database
            .table('procedimento')
            .where('id', params.id)
            .update({
               ativo: !sitProced.rows[0].ativo,
               atualizado_em: new Date()
            });

         return response.status(200).send(procedimento);

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

module.exports = ProcedimentoController
