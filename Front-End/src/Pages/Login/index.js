import React, { useState } from 'react';
import './style.css';
import imagemInicio from '../../Images/Spring flower-pana.svg'
import { useNavigate } from 'react-router-dom';

function Login() {
   const navigate = useNavigate();

   function cadastroUser(){
      navigate("/register-user");
   }

   function cadastroEstabelecimento(){
      navigate("/register-estabelecimento");
   }

   return (
      <div className="main">
         <div className="card-login">
            <div className="card">
               <h1>Login</h1>
               <div className='main-card'>
                  <form>
                     <label>Email</label>
                     <input type="email" required />

                     <label>Senha</label>
                     <input type="password" required />

                     <div className='card-footer'>
                        <button>Login</button>
                        <a onClick={cadastroUser}>Inscrever-se</a>
                        <a  onClick={cadastroEstabelecimento}>Cadastrar Empresa</a>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <div className="imagem-login">
            <h1>Seja muito Bem-Vindo</h1>
            <img src={imagemInicio}></img>
         </div>
      </div>
   )
}

export default Login;