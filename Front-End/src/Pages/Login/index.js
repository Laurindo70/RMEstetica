import React, { useState } from 'react';
import './style.css';
import { message, notification } from 'antd';
import imagemInicio from '../../Images/Spring flower-pana.svg';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';

function Login() {
   const navigate = useNavigate();
   const screenWidth = window.innerWidth;
   const [messageApi, contextHolder] = message.useMessage();
   const [apiNot, contextHolderNot] = notification.useNotification();

   const [email_usuario, setEmail_usuario] = useState('');
   const [senha, setSenha] = useState('');

   function cadastroUser() {
      navigate("/register-user");
   }

   function cadastroEstabelecimento() {
      navigate("/register-estabelecimento");
   }

   async function entrar(e) {
      e.preventDefault();
      messageApi.open({
         type: 'loading',
         content: 'Carregando...',
         duration: 0,
      });

      try {

         await api.post('/login', { email_usuario, senha }).then(
            (response) => {
               localStorage.setItem('TokenRm', `bearer ${response.data.token}`);
               localStorage.setItem('NomeRm', `${response.data.permissao.nome_usuario}`);
               localStorage.setItem('TipoRm', `${response.data.permissao.nivel_permissao_id}`);
               messageApi.destroy();

               if(response.data.permissao.nivel_permissao_id == 1) return navigate("/home");

               return navigate("/agendamentos");
            }
         )

      } catch (error) {
         if (error.response.status === 401) {
            messageApi.destroy();
            apiNot.error({
               message: `Não foi possível realizar o login.`,
               description: error.response.data.mensagem,
               placement: 'top',
            });

            setSenha('');
         } else {
            messageApi.destroy();
            apiNot.error({
               message: `Não foi possível realizar o login.`,
               description: 'Erro no sistema.',
               placement: 'top',
            });
         }
      }

   }

   return (
      <div className="main">
         <div className="card-login" style={screenWidth >= 900 ? {width: '40%'} : {width: '100%'}}>
            {contextHolderNot}
            {contextHolder}
            <div className="card" style={screenWidth >= 900 ? {width: '40%'} : {width: '100%'}}>
               <h1>Login</h1>
               <div className='main-card'>
                  <form onSubmit={entrar}>
                     <label>Email</label>
                     <input type="email" value={email_usuario} onChange={e => setEmail_usuario(e.target.value)} required />

                     <label>Senha</label>
                     <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />

                     <div className='card-footer'>
                        <button>Login</button>
                        <a onClick={cadastroUser}>Inscrever-se</a>
                        {screenWidth >= 900 ? <a onClick={cadastroEstabelecimento}>Cadastrar Empresa</a> : null}
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

export default Login;