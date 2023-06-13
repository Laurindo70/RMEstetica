const { test, trait } = use('Test/Suite')('Usuários')
const User = use('App/Models/User')

trait('Test/ApiClient')

test('Lista de usuários', async ({ client }) => {
  const response = await client.get('/user').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    nome_usuario: "teste",
    cpf: "045.000.000-00",
    senha: "3214",
    email_usuario: "teste@gmail.com"
  }])
})

test('Cadastro de usuários', async ({ client }) => {
  const response = await client
    .post('/user')
    .send({
      nome_usuario: "teste",
      cpf: "045.000.000-00",
      senha: "3214",
      email_usuario: "teste@gmail.com"
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    message: "Usuário cadastrado com sucesso."
  }])
})

test('Recuperando usuário', async ({ client }) => {
  const response = await client
    .get('/user/1')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    nome_usuario: "teste",
    cpf: "045.000.000-00",
    senha: "3214",
    email_usuario: "teste@gmail.com"
  })
})