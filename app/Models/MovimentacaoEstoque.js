'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MovimentacaoEstoque extends Model {
   static get table() {
      return 'movimentacao_estoque'
   }

   static get createdAtColumn() {
      return 'criado_em'
   }

   static get updatedAtColumn() {
      return false
   }
}

module.exports = MovimentacaoEstoque
