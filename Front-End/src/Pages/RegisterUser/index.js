import React, { useState } from 'react';
import './style.css';
import imagemInicio from '../../Images/Spring flower-pana.svg'

function RegisterUser() {
   return (
      <div className="main">
         <div className="card-login">
            <div className="card">
               <h1>Cadastro Usuário</h1>
               <div className='main-card'>
                  <form>
                     <label>Email</label>
                     <input type="email" required />

                     <label>Senha</label>
                     <input type="password" required />

                     <label>Confirmar Senha</label>
                     <input type="password" required />

                     <label>CPF(Opcional)</label>
                     <input type="password" required />

                     <div className='card-footer'>
                        <button>Salvar</button>
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

export default RegisterUser;