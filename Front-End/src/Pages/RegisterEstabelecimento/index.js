import React, { useState } from 'react';
import { Switch } from 'antd';
import './style.css';
import imagemInicio from '../../Images/Spring flower-pana.svg'


function RegisterEstabelecimento() {

   const [tab, setTab] = useState(0);

   const alteracaoTab = (e) => { e.preventDefault(); setTab(tab === 0 ? 1 : 0) };

   const onChangeDispAgendamento = (checked) => {
      console.log(checked);
   };

   const onChangeFecAlmoco = (checked) => {
      console.log(checked);
   };

   async function salvar(e) {
      e.preventDefault();
   }

   return (
      <div className="main">
         <div className="card-login">
            <div className="card">
               <h1>Cadastro Estabelecimento</h1>
               <div className='main-card'>
                  <div className='main-card-buttons'>
                     <button onClick={alteracaoTab} className={`esquerda ${tab === 0 ? 'selecionado' : ''}`}>Informações</button>
                     <button onClick={alteracaoTab} className={`direita ${tab === 1 ? 'selecionado' : ''}`}>Endereço</button>
                  </div>
                  {tab === 0 ?
                     <form onSubmit={alteracaoTab}>
                        <label>Nome do Estabelecimento</label>
                        <input type="text" required />

                        <label>Disponível para agendamento de todos usuários ?</label>
                        <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeDispAgendamento} /></p>

                        <label>Horário de abertura e fechamento do estabelecimento</label>
                        <p><input className='time' type="time" required /><span> as </span><input className='time' type="time" required /></p>

                        <label>Fecha para horario de almoço ?</label>
                        <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeFecAlmoco} /></p>

                        <label>Horário do começo do almoço e retorno</label>
                        <input className='time' type="time" /><span> as </span><input className='time' type="time" />

                        <div className='card-footer-empresa'>
                           <button>Próximo</button>
                        </div>
                     </form>
                     :
                     <form onSubmit={salvar}>
                        <p>
                           <p><label>Logradouro</label> <label className='nome_logradouro_label'>Nome Logradouro</label></p>
                           <input className='logradouro' type="text" required />
                           <input className='nome_logradouro' type="text" required />
                        </p>

                        <p>
                           <p><label>Bairro</label> <label className='numero_label'>Numero</label></p>
                           <input type="text" required className='bairro'/> <input type="number" required  className='numero'/>
                        </p>

                        <label>Cidade</label>
                        <input type="text" required />

                        <label>Estado</label>
                        <input type="text" required />

                        <div className='card-footer-empresa'>
                           <button>Finalizar</button>
                        </div>
                     </form>}
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

export default RegisterEstabelecimento;