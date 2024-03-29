import React, { useState } from 'react';
import './style.css';
import imagemInicio from '../../Images/Spring flower-pana.svg';
import { message, notification } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import { cpfMask } from '../../Utils/mascaras';

function RegisterUser() {
   const screenWidth = window.innerWidth;
   const navigate = useNavigate();
   const [messageApi, contextHolder] = message.useMessage();
   const [apiNot, contextHolderNot] = notification.useNotification();

   let { estabelecimentoId } = useParams();

   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [confSenha, setConfSenha] = useState('');
   const [cpf, setCpf] = useState(null);

   async function salvar(e) {
      e.preventDefault();
      messageApi.open({
         type: 'loading',
         content: 'Carregando...',
         duration: 0,
      });

      try {
         if (senha != confSenha) {
            return apiNot.error({
               message: `Não foi possível realizar o cadastro.`,
               description: 'As senhas não são iguais.',
               placement: 'top',
            });
         }

         await api.post('/usuario-register', {
            nome_usuario: nome,
            nivel_permissao_id: (estabelecimentoId === undefined ? 2 : 1),
            senha: senha,
            email_usuario: email,
            cpf: cpf,
            estabelecimento_id: estabelecimentoId
         }).then(
            (Response) => {
               messageApi.destroy();
               navigate("/");
            }
         )

      } catch (error) {
         messageApi.destroy();
         apiNot.error({
            message: `Não foi possível realizar o cadastro.`,
            description: error.response.data.mensagem[0].message,
            placement: 'top',
         });
      }


   }

   return (
      <div className="main">
         <div className="card-login" style={screenWidth >= 900 ? { width: '40%' } : { width: '100%' }}>
            {contextHolderNot}
            {contextHolder}
            <div className="card" style={screenWidth >= 900 ? { width: '40%' } : { width: '100%' }}>
               <h1>Cadastro Usuário</h1>
               <div className='main-card'>
                  <form onSubmit={salvar}>
                     <label>Nome Usuário</label>
                     <input onChange={e => setNome(e.target.value)} value={nome} type="text" required />

                     <label>Email</label>
                     <input onChange={e => setEmail(e.target.value)} value={email} type="email" required />

                     <label>Senha</label>
                     <input onChange={e => setSenha(e.target.value)} value={senha} type="password" required />

                     <label>Confirmar Senha</label>
                     <input onChange={e => setConfSenha(e.target.value)} value={confSenha} type="password" required />

                     <label>CPF(Opcional)</label>
                     <input onChange={e => setCpf(cpfMask(e.target.value))} value={cpf} type="text" />

                     {senha == confSenha ? <p className={senha.length < 4 ? 'senha-erro' : 'senha-ok'} >A senha deve conter pelo menos 4 dígitos</p> : ''}
                     <p className={senha != confSenha ? 'senha-erro' : 'senha-ok'} >{senha != confSenha ? 'As senhas não batem' : 'As senhas são iguais'}</p>

                     <div className='card-footer'>
                        <button>Salvar</button>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         {screenWidth >= 900 ? <div className="imagem-login">
            <h1>Seja muito Bem-Vindo</h1>
            <img src={imagemInicio}></img>
         </div> : null}
      </div>
   )
}

export default RegisterUser;