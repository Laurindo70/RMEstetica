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
Route.post('/cadastro-estabelecimento', 'EstabelecimentoController.cadastroEmpresa').middleware('auth');
Route.put('/estabelecimento/:id', 'EstabelecimentoController.put');
Route.delete('/estabelecimento/:id', 'EstabelecimentoController.delete');
Route.get('/estabelecimento/nome=:nome?', 'EstabelecimentoController.getAll').middleware('auth');
Route.get('/estabelecimento/:id', 'EstabelecimentoController.getById');

/// --------------- Depesas --------------- 
Route.post('/despesa', 'DespesaController.post').middleware('auth');
Route.delete('/despesa/:id', 'DespesaController.delete');
Route.get('/despesa', 'DespesaController.getAll').middleware('auth');

/// --------------- Produtos --------------- 
Route.post('/produto', 'ProdutoController.post');
Route.delete('/produto/:id', 'ProdutoController.delete');
Route.get('/produto/:estabelecimentoId', 'ProdutoController.getAll');

/// --------------- movimentação --------------- 
Route.post('/movimentacao', 'MovimentacaoController.post');
Route.get('/movimentacao/estabelecimento-id=:estabelecimentoId/data-inicio=:dataInicio/data-fim=:dataFim', 'MovimentacaoController.getAll');

/// --------------- procedimento ---------------
Route.post('/procedimento', 'ProcedimentoController.post'); 
Route.get('/procedimento/:id', 'ProcedimentoController.getAll');
Route.delete('/procedimento/:id', 'ProcedimentoController.delete');

/// --------------- profissional ---------------
Route.post('/profissional', 'ProfissionalController.post'); 
Route.get('/profissional/:id', 'ProfissionalController.getAll'); 
Route.get('/profissional/procedimento/:id', 'ProfissionalController.getAllProcedimento');

/// --------------- Agendamento ---------------
Route.post('/agendamento', 'AgendamentoController.post'); 
Route.post('/cadastro-agendamento', 'AgendamentoController.cadastroAgendamento'); 
Route.put('/finalizar-agendamento/:id', 'AgendamentoController.finalizarAtendimento'); 
Route.put('/cancelar-agendamento/:id', 'AgendamentoController.cancelarAtendimento'); 
Route.get('/datas-agendadas/:id', 'AgendamentoController.datasAgenda'); 
Route.get('/lista-estabelecimento', 'AgendamentoController.listaEstabelecimentosAgend');
Route.get('/historico-agendamento', 'AgendamentoController.historicoAgendamento');
Route.get('/agendadamentos/estabelecimento=:id/data-inicial=:dataInicial/data-fim=:dataFim', 'AgendamentoController.getByData'); 

/// --------------- Pagamento ---------------
Route.post('/parcelas/:id', 'PagamentoController.post');
Route.get('/parcelas-geradas/:id','PagamentoController.getById');
Route.put('/baixar-parcela/:id','PagamentoController.baixaParcela');
Route.get('/forma-pagamento', 'AgendamentoController.formasPagamento');

Route.post('/dashboard/:id', 'PagamentoController.dashboard');