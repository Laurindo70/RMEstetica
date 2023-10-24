const camposCadastro = {
   data_agendamento: 'required',
   profissional_id: 'required',
   procedimento_id: 'required'
};

const camposPagamento = {
   formas_pagamento_id: 'required',
   data_pagamento: 'required',
   desconto: 'required'
}

module.exports = { camposCadastro, camposPagamento };