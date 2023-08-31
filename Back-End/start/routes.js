'use strict'

const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
});

/// --------------- Níveis de permissões --------------- 
Route.post('/permissao', 'NivelPermissaoController.post');
Route.get('/permissao/:id', 'NivelPermissaoController.getById');
Route.get('/permissao', 'NivelPermissaoController.getAll');


/// --------------- Usuários --------------- 
Route.post('/usuario', 'UsuarioController.post');
Route.post('/usuario-register', 'UsuarioController.registerUser');
Route.post('/login', 'UsuarioController.login');
Route.put('/usuario/:id', 'UsuarioController.put');
Route.get('/usuario/:nome?', 'UsuarioController.get');
Route.delete('/usuario/:id', 'UsuarioController.delete');

/// --------------- Estabelecimentos --------------- 
Route.post('/estabelecimento', 'EstabelecimentoController.post');
Route.put('/estabelecimento/:id', 'EstabelecimentoController.put');
Route.delete('/estabelecimento/:id', 'EstabelecimentoController.delete');
Route.get('/estabelecimento/nome=:nome?', 'EstabelecimentoController.getAll').middleware('auth');
Route.get('/estabelecimento/:id', 'EstabelecimentoController.getById');