const camposCadastro = {
   nome_usuario: 'required',
   nivel_permissao_id: 'required',
   senha: 'required',
   email_usuario: 'required|unique:usuario',
   cpf: 'max:14'
};

module.exports = { camposCadastro };