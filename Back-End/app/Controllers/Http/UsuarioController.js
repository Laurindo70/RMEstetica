'use strict'

const Database = use("Database");
const Usuario = use("App/Models/Usuario");

class UsuarioController {

   async post({ request, response }){
      try {
         
         

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
