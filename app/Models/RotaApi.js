'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RotaApi extends Model {

   static get table() {
      return 'rota_api'
   }

   static get createdAtColumn() {
      return 'criado_em'
   }

   static get updatedAtColumn() {
      return 'atualizado_em'
   }

   //static get primaryKey() {
      //return false
   //}

}

module.exports = RotaApi
