'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EstabelecimentoHasUsuario extends Model {
   static get table() {
      return 'estabelecimento_has_usuario'
   }

   static get createdAtColumn() {
      return 'criado_em'
   }

   static get updatedAtColumn() {
      return false
   }

   static get primaryKey() {
      return false
   }
}

module.exports = EstabelecimentoHasUsuario
