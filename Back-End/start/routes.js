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
Route.put('/usuario', 'UsuarioController.put');
Route.get('/usuario/:nome?', 'UsuarioController.get');
Route.delete('/usuario/:id', 'UsuarioController.delete');

/// --------------- Estabelecimentos --------------- 
Route.post('/estabelecimento', 'EstabelecimentoController.post');
Route.post('/cadastro-estabelecimento', 'EstabelecimentoController.cadastroEmpresa').middleware('auth');
Route.put('/estabelecimento/:id', 'EstabelecimentoController.put').middleware('auth');
Route.delete('/estabelecimento/:id', 'EstabelecimentoController.delete').middleware('auth');
Route.get('/estabelecimento/nome=:nome?', 'EstabelecimentoController.getAll').middleware('auth');
Route.get('/estabelecimento/:id', 'EstabelecimentoController.getById').middleware('auth');

/// --------------- Depesas --------------- 
Route.post('/despesa', 'DespesaController.post').middleware('auth');
Route.delete('/despesa/:id', 'DespesaController.delete').middleware('auth');
Route.get('/despesa', 'DespesaController.getAll').middleware('auth');

/// --------------- Produtos --------------- 
Route.post('/produto', 'ProdutoController.post').middleware('auth');
Route.delete('/produto/:id', 'ProdutoController.delete').middleware('auth');
Route.get('/produto/:estabelecimentoId', 'ProdutoController.getAll').middleware('auth');

/// --------------- movimentação --------------- 
Route.post('/movimentacao', 'MovimentacaoController.post').middleware('auth');
Route.get('/movimentacao/estabelecimento-id=:estabelecimentoId/data-inicio=:dataInicio/data-fim=:dataFim', 'MovimentacaoController.getAll').middleware('auth');

/// --------------- procedimento ---------------
Route.post('/procedimento', 'ProcedimentoController.post').middleware('auth');
Route.get('/procedimento/:id', 'ProcedimentoController.getAll');
Route.delete('/procedimento/:id', 'ProcedimentoController.delete').middleware('auth');

/// --------------- profissional ---------------
Route.post('/profissional', 'ProfissionalController.post').middleware('auth');
Route.get('/profissional/:id', 'ProfissionalController.getAll');
Route.get('/profissional/procedimento/:id', 'ProfissionalController.getAllProcedimento');

/// --------------- Agendamento ---------------
Route.post('/agendamento', 'AgendamentoController.post').middleware('auth');
Route.post('/cadastro-agendamento', 'AgendamentoController.cadastroAgendamento'); 
Route.put('/finalizar-agendamento/:id', 'AgendamentoController.finalizarAtendimento').middleware('auth'); 
Route.put('/cancelar-agendamento/:id', 'AgendamentoController.cancelarAtendimento').middleware('auth');
Route.get('/datas-agendadas/:id', 'AgendamentoController.datasAgenda').middleware('auth');
Route.get('/lista-estabelecimento', 'AgendamentoController.listaEstabelecimentosAgend');
Route.get('/historico-agendamento', 'AgendamentoController.historicoAgendamento');
Route.get('/agendadamentos/estabelecimento=:id/data-inicial=:dataInicial/data-fim=:dataFim', 'AgendamentoController.getByData').middleware('auth');

/// --------------- Pagamento ---------------
Route.post('/parcelas/:id', 'PagamentoController.post');
Route.get('/parcelas-geradas/:id','PagamentoController.getById');
Route.put('/baixar-parcela/:id','PagamentoController.baixaParcela');
Route.get('/forma-pagamento', 'AgendamentoController.formasPagamento');

Route.post('/dashboard/:id', 'PagamentoController.dashboard');