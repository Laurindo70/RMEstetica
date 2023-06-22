'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Permissao = use("App/Models/Permissao");

const { msgCadastro } = require('../../../Utils/Validator/Messages/Permissao.js');
const { camposCadastro } = require('../../../Utils/Validator/fields/Permissao.js');

class NivelPermissaoController {

   async post({ request, response }){
      try {
         
         const mensagemErro = msgCadastro;
         const validacao = await validateAll(request.all(), camposCadastro, mensagemErro);

         if(validacao.fails()){
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_nivel } = request.all();

         const nivelCadastrado = await Permissao.create({ nome_nivel });

         return response.status(201).send(nivelCadastrado);

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

module.exports = NivelPermissaoController
