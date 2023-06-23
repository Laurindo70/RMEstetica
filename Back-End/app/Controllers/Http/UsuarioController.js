'use strict'

const { validateAll } = use('Validator');

const Database = use("Database");
const Usuario = use("App/Models/Usuario");

const { msgCadastro } = require('../../../Utils/Validator/Messages/Usuario.js');
const { camposCadastro } = require('../../../Utils/Validator/fields/Usuario.js');

class UsuarioController {

   async post({ request, response }){
      try {
         
         const validacao = await validateAll(request.all(), camposCadastro, msgCadastro);

         if(validacao.fails()){
            return response.status(417).send({ mensagem: validacao.messages() });
         }

         const { nome_usuario, nivel_permissao_id, senha, email_usuario, cpf } = request.all();

         const usuarioCadastrado = await Usuario.create({
            nome_usuario, 
            nivel_permissao_id, 
            senha, 
            email_usuario, 
            cpf
         });

         return response.status(201).send(usuarioCadastrado);

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

module.exports = UsuarioController
