const { test, trait } = use('Test/Suite')('Usuários')
const User = use('App/Models/User')

trait('Test/ApiClient')


test('Lista de rotas da api', async ({ client }) => {
  const response = await client.get('/rota-api').end();

  response.assertStatus(200);
  response.assertJSONSubset([
    {
      nome_rota_api: "Usuários",
      rota_api: "/user" 
    }
  ])
})

test('Cadastro de rotas da api', async ({ client }) => {
  const response = await client
    .post('/rota-api')
    .send({
      nome_rota_api: "Usuários",
      rota_api: "user/"
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    message: "Rota cadastrada com sucesso."
  }])
})

test('Lista de rotas do menu', async ({ client }) => {
  const response = await client.get('/rota-menu').end();

  response.assertStatus(200);
  response.assertJSONSubset([
    {
      nome_rota_api: "Usuários",
      rota_api: "/user",
      icone: 'usuarios' 
    }
  ])
})

test('Cadastro de rotas da api', async ({ client }) => {
  const response = await client
    .post('/rota-menu')
    .send({
      nome_rota_menu: "Usuários",
      rota_front: "usuarios/",
      icone: 'usuarios'
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    message: "Rota cadastrada com sucesso."
  }])
})