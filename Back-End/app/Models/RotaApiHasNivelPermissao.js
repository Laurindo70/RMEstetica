'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RotaApiHasNivelPermissao extends Model {
   static get table() {
      return 'rota_api_has_nivel_permissao'
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

module.exports = RotaApiHasNivelPermissao
