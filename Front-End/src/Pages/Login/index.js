import React, { useState } from 'react';
import './style.css';
import imagemInicio from '../../Images/Spring flower-pana.svg'

function Login() {
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
                        <a>Inscrever-se</a>
                        <a>Cadastra Empresa</a>
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