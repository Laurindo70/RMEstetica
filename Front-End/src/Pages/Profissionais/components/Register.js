import React, { useState } from 'react';
import api from '../../../Utils/api';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';

export default function RegisterProfissional({ estabelecimento_id, fecharModal }) {
   const [messageApi, contextHolder] = message.useMessage();
   const token = localStorage.getItem('TokenRm');

   const [nomeProfissional, setNomeProfissional] = useState(null);
   const [horarioInicio, setHorarioInicio] = useState(null);
   const [horarioFim, setHorarioFim] = useState(null);

   async function salvar(e) {

      e.preventDefault();

      const dados = {
         "nome_profissional": nomeProfissional,
         "horario_inicial_atendimento": horarioInicio,
         "estabelecimento_id": estabelecimento_id,
         "horario_final_atendimento": horarioFim
      }

      try {

         await api.post('/profissional', dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               fecharModal();
               messageApi.open({
                  type: 'success',
                  content: 'Cadastrado com sucesso.',
               });
            }
         )

      } catch (error) {
         console.log(error.data);
         messageApi.open({
            type: 'error',
            content: 'Erro ao realizar cadastro.',
         });
      }

   }

   return (
      <>
      {contextHolder}
         <form onSubmit={salvar}>
            <Row justify="start">
               <label className='label-cadastro'>Nome Profissional</label>
               <Input className='input-cadastro' onChange={e => setNomeProfissional(e.target.value)} value={nomeProfissional} type="text" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Horário inicio atendimento</label>
            </Row>
            <Row justify="start">
               <input onChange={e => setHorarioInicio(e.target.value)} value={horarioInicio} className='input-time' type="time" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Horário fim atendimento</label>
            </Row>
            <Row justify="start">
               <input onChange={e => setHorarioFim(e.target.value)} value={horarioFim} className='input-time' type="time" required />
            </Row>
            <Row justify="end" className='botao-salvar'>
               <button className='botao-salvar' >Salvar</button>
            </Row>
         </form>
      </>
   );

}