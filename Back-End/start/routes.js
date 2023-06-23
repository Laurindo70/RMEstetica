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
Route.put('/usuario/:id', 'UsuarioController.put');