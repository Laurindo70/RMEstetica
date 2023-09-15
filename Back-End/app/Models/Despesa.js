'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Despesa extends Model {
   static get table() {
      return 'despesas'
   }

   static get createdAtColumn() {
      return 'criado_em'
   }

   static get updatedAtColumn() {
      return 'atualizado_em'
   }
}

module.exports = Despesa
