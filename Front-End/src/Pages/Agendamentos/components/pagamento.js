import React, { useState, useEffect } from 'react';
import api from '../../../Utils/api';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';
import { moneyMask } from '../../../Utils/mascaras';

export default function PagarAgendamento({ agendamento, fecharModal }) {
   const token = localStorage.getItem('TokenRm');

   const [formasPagamento, setFormasPagamento] = useState([]);

   const [formaPagamento, setFormaPagamento] = useState(null);
   const [dataPagamento, setDataPagamento] = useState(null);
   const [desconto, setDesconto] = useState(0);

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         "formas_pagamento_id": formaPagamento,
         "data_pagamento": dataPagamento,
         "desconto": desconto
      }

      try {

         await api.post(`/pagar-agendamento/${agendamento}`, dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               fecharModal();
               Modal.success({
                  content: 'Finalizado com sucesso.',
               });
            }
         )

      } catch (error) {
         Modal.error({
            title: 'Error',
            content: error.response.data.mensagem,
         });
      }
   }

   useEffect(() => {
      api.get(`/forma-pagamento`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let data = [];
            for (let i = 0; i < Response.data.length; i++) {
               data.push({
                  value: Response.data[i].id,
                  label: Response.data[i].nome_forma_pagamento
               })
            }
            setFormasPagamento(data);
         }
      );
   }, [])

   return (
      <>
         <form onSubmit={salvar}>
            <Row justify="start">
               <label className='label-cadastro'>Forma de Pagamento</label>
               <Select
                  style={{
                     width: '100%',
                     border: 'solid 1px #A9335D',
                     borderRadius: '5px',
                  }}
                  options={formasPagamento}
                  onChange={(value) => { setFormaPagamento(value) }}
               />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Data Pagamento</label>
               <Input className='input-cadastro' value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} type="date" />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Desconto</label>
               <Input className='input-cadastro' value={desconto} onChange={e => setDesconto(moneyMask(e.target.value))} type="text" />
            </Row>
            <Row justify="end" className='botao-salvar'>
               <button className='botao-salvar' >Salvar</button>
            </Row>
         </form>
      </>
   )
}