const camposCadastro = {
   data_agendamento: 'required',
   profissional_id: 'required',
   procedimento_id: 'required'
};

const camposPagamento = {
   formaPagamento: 'required',
   data: 'required',
   valor: 'required'
}

module.exports = { camposCadastro, camposPagamento };