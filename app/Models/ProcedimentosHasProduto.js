'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProcedimentosHasProduto extends Model {
   static get table() {
      return 'procedimento_has_produtos'
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

module.exports = ProcedimentosHasProduto
