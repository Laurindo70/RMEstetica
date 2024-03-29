import React, { useState, useEffect } from 'react';
import api from '../../../Utils/api';
import { Divider, Row, Button, DatePicker, Flex, Form, Input, Select, Typography, notification, Modal } from 'antd';

export default function CadastroAgendamento({ fecharModal, estabelecimento }) {
   const token = localStorage.getItem('TokenRm');

   const [profissionalId, setProfissionalId] = useState(null);
   const [procedimentoId, setProcedimentoId] = useState(null);
   const [horaAgendamento, SetHoraAgendamento] = useState(null);
   const [nomeCliente, setNomeCliente] = useState(null);
   const [data, setData] = useState(null);

   const [profissionais, setProfissionais] = useState([]);
   const [procedimentos, setProcedimentos] = useState([]);

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         "profissional_id": profissionalId,
         "procedimento_id": procedimentoId,
         "data_agendamento": data,
         "hora_agendamento": horaAgendamento,
         "nome_cliente": nomeCliente
      }

      try {

         if (token) {
            await api.post('/agendamento', dados, {
               headers: {
                  Authorization: token
               }
            }).then(
               (Response) => {
                  fecharModal();
                  Modal.success({
                     content: 'Cadastrado com sucesso.',
                  });
               }
            )
         } else {
            await api.post('/cadastro-agendamento', dados).then(
               (Response) => {
                  fecharModal();
                  Modal.success({
                     content: 'Cadastrado com sucesso.',
                  });
               }
            )
         }

      } catch (error) {
         Modal.error({
            title: 'Error',
            content: error.response.data.mensagem,
         });
      }
   }

   useEffect(() => {

      if (procedimentoId !== null) {
         api.get(`/profissional/procedimento/${procedimentoId}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let data = [];
               for (let i = 0; i < Response.data.length; i++) {
                  data.push({
                     label: Response.data[i].nome_profissional,
                     value: Response.data[i].id
                  });
               }
               setProfissionais(data);
            }
         )
      }

   }, [procedimentoId])

   useEffect(() => {

      if (estabelecimento !== null) {
         api.get(`/procedimento/${estabelecimento}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let data = [];
               for (let i = 0; i < Response.data.length; i++) {
                  data.push({
                     label: Response.data[i].nome_procedimento,
                     value: Response.data[i].id
                  });
               }
               setProcedimentos(data);
            }
         )
      }

   }, [])
   return (
      <>
         <form onSubmit={salvar}>
            {token ? null : <Row justify="start">
               <label className='label-cadastro'>Nome Cliente</label>
               <Input className='input-cadastro' onChange={e => setNomeCliente(e.target.value)} value={nomeCliente} type="text" required />
            </Row>}
            <Row justify="start">
               <label className='label-cadastro'>Data atendimento</label>
               <Input className='input-cadastro' defaultValue={data} value={data} onChange={e => setData(e.target.value)} type="date" />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Horário atendimento</label>
               <Input className='input-cadastro' onChange={e => SetHoraAgendamento(e.target.value)} value={horaAgendamento} type="time" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>selecione o procedimento</label>
               <Select
                  style={{
                     width: '100%',
                     border: 'solid 1px #A9335D',
                     borderRadius: '5px',
                  }}
                  options={procedimentos}
                  onChange={(value) => { setProcedimentoId(value) }}
               />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>selecione o profissional</label>
               <Select
                  style={{
                     width: '100%',
                     border: 'solid 1px #A9335D',
                     borderRadius: '5px',
                  }}
                  options={profissionais}
                  onChange={(value) => { setProfissionalId(value) }}
               />
            </Row>

            <Row justify="end" className='botao-salvar'>
               <button className='botao-salvar' >Salvar</button>
            </Row>
         </form>
      </>
   );
}