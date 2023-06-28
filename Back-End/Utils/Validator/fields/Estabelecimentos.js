const camposCadastro = {
   nome_estabelecimento: 'required|unique:estabelecimento',
   endereco_bairro: 'required',
   endereco_numero: 'required',
   endereco_logradouro: 'required',
   endereco_nome_logradouro: 'required',
   endereco_cidade: 'required',
   endereco_estado: 'required',
   endereco_cep: 'required',
   visivel_agendamento: 'required',
   horario_abertura: 'required',
   horario_fechamento: 'required',
   fechamento_almoco: 'required'
};

const camposAtualizacao = {
   endereco_bairro: 'required',
   endereco_numero: 'required',
   endereco_logradouro: 'required',
   endereco_nome_logradouro: 'required',
   endereco_cidade: 'required',
   endereco_estado: 'required',
   endereco_cep: 'required',
   visivel_agendamento: 'required',
   horario_abertura: 'required',
   horario_fechamento: 'required',
   fechamento_almoco: 'required'
};

module.exports = { camposCadastro, camposAtualizacao };