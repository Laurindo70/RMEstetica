'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Profissional = use("App/Models/Profissional");

const { msgCadastro } = require("../../../Utils/Validator/Messages/Profissional.js");
const { camposCadastro } = require("../../../Utils/Validator/fields/Profissional.js");

class ProfissionalController {

   async post({ request, response }) {
      try {

         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if (validacao.fails()) {
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_profissional, horario_inicial_atendimento, horario_final_atendimento, estabelecimento_id } = request.all();

         const profissional = await Profissional.create({
            nome_profissional,
            horario_inicial_atendimento,
            horario_final_atendimento,
            estabelecimento_id
         });

         return response.status(201).send(profissional)

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

   async getAll({ request, response, params }){
      try {
         
         const profissionais = await Database.raw(`select id, nome_profissional, horario_inicial_atendimento, horario_final_atendimento from profissional where estabelecimento_id = ${params.id};`);

         return response.status(200).send(profissionais.rows);

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

   async getAllProcedimento({ request, response, params }){
      try {
         
         const profissionais = await Database.raw(`select profissional.* from profissional inner join procedimento_has_proficional on profissional.id=procedimento_has_proficional.profissional_id
         where procedimento_has_proficional.procedimento_id = ${params.id};`);

         return response.status(200).send(profissionais.rows);

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

module.exports = ProfissionalController
