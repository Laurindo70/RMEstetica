'use strict'

const { test, trait } = use('Test/Suite')('Usuários')
const User = use('App/Models/User')

trait('Test/ApiClient')


test('Lista de níveis de permissão', async ({ client }) => {
  const response = await client.get('/nivel-permissao').end();

  response.assertStatus(200);
  response.assertJSONSubset([
    {
      nome_nivel: "Usuários"
    }
  ])
})


test('Cadastro de nível de permissão', async ({ client }) => {
  const response = await client
    .post('/nivel-permissao')
    .send({
      nome_nivel: "teste",
      rotas_menu: [1,2],
      rota_api: [1, 2]
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    message: "Usuário cadastrado com sucesso."
  }])
})