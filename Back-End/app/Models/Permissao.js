'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permissao extends Model {
   static get table() {
      return 'nivel_permissao'
   }

   static get createdAtColumn() {
      return 'criado_em'
   }

   static get updatedAtColumn() {
      return 'atualizado_em'
   }
}

module.exports = Permissao
