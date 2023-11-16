import React, { useState, useEffect } from 'react';
import { Switch, Input } from 'antd';
import './style.css';
import cep from 'cep-promise';
import imagemInicio from '../../Images/Spring flower-pana.svg';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import { cepMask } from '../../Utils/mascaras';

function RegisterEstabelecimento() {
   const navigate = useNavigate();

   const [tab, setTab] = useState(0);
   const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
   const [enderecoBairro, setEnderecoBairro] = useState('');
   const [enderecoNumero, setEnderecoNumero] = useState(0);
   const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
   const [enderecoNomeLogradouro, setEnderecoNomeLogradouro] = useState('');
   const [enderecoCidade, setEnderecoCidade] = useState('');
   const [enderecoEstado, setEnderecoEstado] = useState('');
   const [enderecoCep, setEnderecoCep] = useState('');
   const [visivelAgendamento, setVisivelAgendamento] = useState(true);
   const [horarioAbertura, setHorarioAbertura] = useState('');
   const [horarioFechamento, setHorarioFechamento] = useState('');
   const [fechamentoAlmoco, setFechamentoAlmoco] = useState(true);
   const [enderecoComplemento, setEnderecoComplemento] = useState('');
   const [horarioFechamentoAlmoco, setHorarioFechamentoAlmoco] = useState('');
   const [horarioVoltaAlmoco, setHorarioVoltaAlmoco] = useState('');

   const alteracaoTab = (e) => { e.preventDefault(); setTab(tab === 0 ? 1 : 0) };

   const onChangeDispAgendamento = (checked) => {
      setVisivelAgendamento(checked);
   };

   const onChangeFecAlmoco = (checked) => {
      setFechamentoAlmoco(checked);
   };

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         nome_estabelecimento: nomeEstabelecimento,
         endereco_bairro: enderecoBairro,
         endereco_numero: enderecoNumero,
         endereco_logradouro: enderecoLogradouro,
         endereco_nome_logradouro: enderecoNomeLogradouro,
         endereco_cidade: enderecoCidade,
         endereco_estado: enderecoEstado,
         endereco_cep: enderecoCep,
         visivel_agendamento: visivelAgendamento,
         horario_abertura: horarioAbertura,
         horario_fechamento: horarioFechamento,
         fechamento_almoco: fechamentoAlmoco,
         endereco_complemento: enderecoComplemento,
         horario_fechamento_almoco: horarioFechamentoAlmoco,
         horario_volta_almoco: horarioVoltaAlmoco
      };

      try {
         await api.post('/estabelecimento', dados).then(
            (Response) => {
               navigate(`/register-user/${Response.data.id}`);
            }
         )
      } catch (error) {
         console.log(error.response.data.mensagem);
      }
   }

   useEffect(() => {
      if (enderecoCep !== null && enderecoCep.length == 9) {
         cep(enderecoCep.replace(/[^a-zA-Z0-9]/g, ""))
            .then(
               (response) => {
                  setEnderecoCidade(response.city);
                  setEnderecoEstado(response.state);
                  setEnderecoBairro(response.neighborhood);
                  setEnderecoNomeLogradouro(response.street);
               }
            )
      }
   }, [enderecoCep])

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
                        <input onChange={e => setNomeEstabelecimento(e.target.value)} value={nomeEstabelecimento} type="text" required />

                        <label>Disponível para agendamento de todos usuários ?</label>
                        <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeDispAgendamento} /></p>

                        <label>Horário de abertura e fechamento do estabelecimento</label>
                        <p><input onChange={e => setHorarioAbertura(e.target.value)} value={horarioAbertura} className='time' type="time" required /><span> as </span><input onChange={e => setHorarioFechamento(e.target.value)} value={horarioFechamento} className='time' type="time" required /></p>

                        <label>Fecha para horario de almoço ?</label>
                        <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeFecAlmoco} /></p>

                        {fechamentoAlmoco
                           ? <><label>Horário do começo do almoço e retorno</label>
                              <input onChange={e => setHorarioFechamentoAlmoco(e.target.value)} value={horarioFechamentoAlmoco} className='time' type="time" /><span> as </span><input onChange={e => setHorarioVoltaAlmoco(e.target.value)} value={horarioVoltaAlmoco} className='time' type="time" /></>
                           : null}

                        <div className='card-footer-empresa'>
                           <button>Próximo</button>
                        </div>
                     </form>
                     :
                     <form onSubmit={salvar}>
                        <label>Cep</label>
                        <Input onChange={e => setEnderecoCep(cepMask(e.target.value))} value={enderecoCep} type="text" required />
                        <p>
                           <p><label>Logradouro</label> <label className='nome_logradouro_label'>Nome Logradouro</label></p>
                           <input onChange={e => setEnderecoLogradouro(e.target.value)} value={enderecoLogradouro} className='logradouro' type="text" required />
                           <input Input disabled={true} onChange={e => setEnderecoNomeLogradouro(e.target.value)} value={enderecoNomeLogradouro} className='nome_logradouro' type="text" required />
                        </p>

                        <p>
                           <p><label>Bairro</label> <label className='numero_label'>Numero</label></p>
                           <Input disabled={true} onChange={e => setEnderecoBairro(e.target.value)} value={enderecoBairro} type="text" className='bairro' /> <Input onChange={e => setEnderecoNumero(e.target.value)} value={enderecoNumero} type="number" required className='numero' />
                        </p>

                        <label>Cidade</label>
                        <Input disabled={true} onChange={e => setEnderecoCidade(e.target.value)} value={enderecoCidade} type="text" />

                        <label>Estado</label>
                        <Input disabled={true} onChange={e => setEnderecoEstado(e.target.value)} value={enderecoEstado} type="text" />

                        <label>Complemento</label>
                        <textarea onChange={e => setEnderecoComplemento(e.target.value)} value={enderecoComplemento} type="textarea"></textarea>

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