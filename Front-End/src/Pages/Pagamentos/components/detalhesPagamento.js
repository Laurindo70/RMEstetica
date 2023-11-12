import React, { useState, useEffect } from 'react';
import api from '../../../Utils/api';
import { moneyMask } from '../../../Utils/mascaras';
import { Divider, Row, Button, DatePicker, Flex, Form, Input, Select, Typography, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid'
const { Title, Text } = Typography;

const layout = {
   labelCol: {
      span: 8,
   },
   wrapperCol: {
      span: 10,
   },
};
const tailLayout = {
   wrapperCol: {
      offset: 8,
      span: 10,
   },
};

export default function DetalhesPagemento({ fecharModal, pagamento }) {
   const [apiNot, contextHolder] = notification.useNotification();
   const token = localStorage.getItem('TokenRm');
   const [formasPagamento, setFormasPagamento] = useState([]);

   const [valorParcela, setValorParcela] = useState(null);
   const [dataParcela, setDataParcela] = useState(null);
   const [formaPagamento, setFormaPagamento] = useState(null);

   const [valorParcelas, setValorParcelas] = useState(0);

   const [parcelas, setParcelas] = useState([]);

   const notificacao = (msg) => {
      setValorParcela(null);
      setFormaPagamento(formasPagamento[0].value);
      apiNot.error({
         message: `Erro de preenchimento.`,
         description:
            msg,
         placement: 'top',
      });
   }

   function onFinish() {

      let valorParcelass = 0;
      for (let i = 0; i < parcelas.length; i++) valorParcelass += +parcelas[i].valor;
      valorParcelass += +valorParcela;
      setValorParcelas(valorParcelass);

      if (valorParcelas > pagamento[0].valor) return notificacao("O valor das parcelas excede o valor do agendamento!!");
      if (valorParcela == null) return notificacao("É necessario realizar o preenchimento do valor da parcela !!");
      if (!dataParcela) return notificacao("É necessario realizar o preenchimento da data da parcela !!");

      const parcel = parcelas;
      parcel.push({
         id: nanoid(),
         data: dataParcela,
         valor: valorParcela,
         formaPagamento,
         nomeFormaPagemento: formasPagamento.filter((forma) => forma.value == formaPagamento)
      })
      setParcelas(parcel);
      setValorParcela(null);
      setFormaPagamento(formasPagamento[0].value);
   };

   async function finalizar(){
      if (pagamento[0].valor > valorParcelas) return notificacao("O valor das parcelas não é igual ao total do agendamento!!");
      fecharModal();
   }

   function apagarParcela(id) {
      setParcelas(parcelas.filter((parcela) => parcela.id !== id));
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
            setFormaPagamento(data[0].value);
         }
      );
   }, [])

   return (
      <>
         {contextHolder}
         <Divider>Dados do Pagamento</Divider>


         <Flex>
            <div className='dados-pagamentos' >
               <Row>
                  <Title level={4}>Nome do cliente:</Title>
               </Row>
               <Row>
                  <Title level={4}>{pagamento == null ? '' : pagamento[0].nome_cliente}</Title>
               </Row>
               <Divider />
               <Row>
                  <Title level={4}>Valor Total: </Title>
               </Row>
               <Row>
                  <Title level={4}>{pagamento == null ? '' : pagamento[0].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title>
               </Row>
               <Divider />
               <Row>
                  <Title style={{ fontWeight: 'bold', textTransform: 'uppercase' }} level={4}>Valor Restante: </Title>
               </Row>
               <Row>
                  <Title style={{ fontWeight: 'bold', textTransform: 'uppercase' }} level={4}>{pagamento == null ? '' : (pagamento[0].valor - (+valorParcelas)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title>
               </Row>
               <Divider />
               <Row>
                  <Title level={4}><Button style={{ fontWeight: 'bold', textTransform: 'uppercase' }} onClick={finalizar} type='primary' >Finalizar</Button></Title>
               </Row>
               <Divider />
            </div>
            <div className='parcelas-pagamentos'>
               <Form
                  {...layout}
                  name="control-hooks"
                  onFinish={onFinish}
                  style={{
                     width: '100%',
                     padding: '10px',
                     border: 'solid 1px #a9335d',
                     borderRadius: '5px'
                  }}
               >
                  <Form.Item
                     label="Valor Parcela"
                     rules={[
                        {
                           required: true,
                           message: 'Por favor preencha o valor!',
                        },
                     ]}
                  >
                     <Input onChange={e => setValorParcela(moneyMask(e.target.value))} value={valorParcela} type="text" />
                  </Form.Item>
                  <Form.Item
                     label="Data Pagamento"
                     rules={[
                        {
                           required: true,
                           message: 'Por favor preencha a data!',
                        },
                     ]}
                  >
                     <DatePicker placeholder='Selecione a data' defaultValue={null} format={'DD-MM-YYYY'} onChange={(date, dateString) => setDataParcela(dateString == undefined ? null : dateString)} />
                  </Form.Item>
                  <Form.Item
                     label="Forma Pagamento"
                     rules={[
                        {
                           required: true,
                           message: 'Por favor selecione a forma de pagamento!',
                        },
                     ]}
                  >
                     <Select
                        style={{
                           width: '100%',
                           border: 'solid 1px #A9335D',
                           borderRadius: '5px',
                        }}
                        defaultValue={formaPagamento}
                        value={formaPagamento}
                        onChange={value => setFormaPagamento(value)}
                        options={formasPagamento}
                     />
                  </Form.Item>
                  <Form.Item
                     noStyle
                     shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                  >
                     {({ getFieldValue }) =>
                        getFieldValue('gender') === 'other' ? (
                           <Form.Item
                              name="customizeGender"
                              label="Customize Gender"
                              rules={[
                                 {
                                    required: true,
                                 },
                              ]}
                           >
                              <Input />
                           </Form.Item>
                        ) : null
                     }
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                     <Button type="primary" htmlType="submit">
                        Adicionar
                     </Button>

                  </Form.Item>
               </Form>

               <table className='tabela-parcelas'>
                  <tr>
                     <th><p className='botao-deletar'>Data</p></th>
                     <th> <p className='botao-deletar'>Valor</p></th>
                     <th> <p className='botao-deletar'>Forma Pagamento</p></th>
                     <th> <p className='botao-deletar'>Deletar</p></th>
                  </tr>

                  {parcelas.map((parcela) => (
                     <tr>
                        <td>{parcela.data}</td>
                        <td>R${parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{parcela.nomeFormaPagemento[0].label}</td>
                        <td className='botao-deletar'><Button type="primary" onClick={() => { apagarParcela(parcela.id) }} danger><DeleteOutlined /></Button></td>
                     </tr>
                  ))}
               </table>
            </div>
         </Flex>
      </>
   );
}