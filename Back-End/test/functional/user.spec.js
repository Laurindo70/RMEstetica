'use strict'

const { test, trait } = use('Test/Suite')('Usuários')

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
  response.assertJSONSubset({
    message: "Usuário cadastrado com sucesso."
  })
})

test('Login', async ({ client }) => {
  const response = await client
    .post('/login')
    .send({
      senha: "3214",
      email_usuario: "teste@gmail.com"
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c.",
    nome_usuario: "teste"
  })
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