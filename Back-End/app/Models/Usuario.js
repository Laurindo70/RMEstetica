'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Usuario extends Model {
   static boot() {
      super.boot()

      this.addHook('beforeSave', async (userInstance) => {
         if (userInstance.dirty.senha) {
            userInstance.senha = await Hash.make(userInstance.senha)
         }
      })
   }
   static get table() {
      return 'usuario'
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

module.exports = Usuario
