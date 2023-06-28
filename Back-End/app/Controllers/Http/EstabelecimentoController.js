'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Estabelecimento = use("App/Models/Estabelecimento");

const { msgCadastro } = require('../../../Utils/Validator/Messages/Estabelecimento.js');
const { camposCadastro } = require('../../../Utils/Validator/fields/Estabelecimentos.js');

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

}

module.exports = EstabelecimentoController
