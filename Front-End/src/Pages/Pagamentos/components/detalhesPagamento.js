import React, { useState, useEffect } from 'react';
import api from '../../../Utils/api';
import { moneyMask } from '../../../Utils/mascaras';
import { Divider, Row, Button, DatePicker, Flex, Form, Input, Select, Typography, notification, message } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
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

export default function DetalhesPagemento({ fecharModal, pagamento, modalAberto }) {
   const [apiNot, contextHolder] = notification.useNotification();
   const token = localStorage.getItem('TokenRm');
   const [formasPagamento, setFormasPagamento] = useState([]);

   const [valorParcela, setValorParcela] = useState(null);
   const [dataParcela, setDataParcela] = useState(null);
   const [formaPagamento, setFormaPagamento] = useState(null);

   const [valorParcelas, setValorParcelas] = useState(0);

   const [parcelas, setParcelas] = useState([]);
   const [parcelasCad, setParcelasCad] = useState([]);

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

   async function finalizar() {
      if (pagamento[0].valor > valorParcelas) return notificacao("O valor das parcelas não é igual ao total do agendamento!!");

      await api.post(`/parcelas/${pagamento[0].id}`, {
         pagamentos: parcelas
      }, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            carregarDados();
            fecharModal();
            apiNot.success({
               message: `Sucesso.`,
               description: "Parcelas cadastradas com sucesso!!",
               placement: 'top',
            });
         }
      ).catch(
         (error) => {
            return notificacao(error.response.data.mensagem);
         }
      );
   }

   async function baixarParcela(id, posicao) {
      await api.put(`/baixar-parcela/${id}`, {
         forma_pagamento: parcelasCad[posicao].forma_pagamento,
         agendamento_id: pagamento[0].id
      }, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            carregarDados();
            apiNot.success({
               message: `Sucesso.`,
               description: "Parcelas baixada com sucesso!!",
               placement: 'top',
            });
         }
      ).catch(
         (error) => {
            return notificacao(error.response.data.mensagem);
         }
      );
   }

   function apagarParcela(id) {
      setParcelas(parcelas.filter((parcela) => parcela.id !== id));
   }

   function selecaoFormaPagamento(value, posicao) {
      let parcel = parcelasCad;
      parcel[posicao].forma_pagamento = value;
      setParcelasCad(parcel);
   }

   async function carregarDados() {
      await api.get(`/parcelas-geradas/${pagamento[0].id}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            setParcelasCad(Response.data);
         }
      );
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
      carregarDados();
   }, [parcelas, modalAberto])

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
               {parcelasCad.length > 0 ? null : <>
                  <Row>
                     <Title style={{ fontWeight: 'bold', textTransform: 'uppercase' }} level={4}>Valor Restante: </Title>
                  </Row>

                  <Row>
                     <Title style={{ fontWeight: 'bold', textTransform: 'uppercase' }} level={4}>{pagamento == null ? '' : (pagamento[0].valor - (+valorParcelas)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title>
                  </Row>
                  <Divider />
               </>}
               {parcelasCad.length > 0 ? null : <Row>
                  <Title level={4}><Button style={{ fontWeight: 'bold', textTransform: 'uppercase' }} onClick={finalizar} type='primary' >Finalizar</Button></Title>
               </Row>}
               <Divider />
            </div>
            <div className='parcelas-pagamentos'>
               {parcelasCad.length > 0 ? null :
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
               }
               {parcelasCad.length > 0 ?
                  <table className='tabela-parcelas'>
                     <tr>
                        <th><p className='botao-deletar'>Data Vencimento</p></th>
                        <th> <p className='botao-deletar'>Valor</p></th>
                        <th> <p className='botao-deletar'>Forma Pagamento</p></th>
                        <th> <p className='botao-deletar'>Situação</p></th>
                        <th> <p className='botao-deletar'>Pagar</p></th>
                     </tr>

                     {parcelasCad.map((parcela, posicao) => (
                        <tr key={posicao}>
                           <td>{parcela.data_vencimento}</td>
                           <td>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                           <td><Select
                              style={{
                                 width: '100%',
                                 border: 'solid 1px #A9335D',
                                 borderRadius: '5px',
                              }}
                              defaultValue={parcela.forma_pagamento}
                              value={parcela.forma_pagamento}
                              onChange={value => selecaoFormaPagamento(value, posicao)}
                              options={formasPagamento}
                           /></td>
                           <td>{!parcela.is_pago ? <Text style={{ fontWeight: 'bold' }} type="danger">PENDENTE</Text> : <Text style={{ fontWeight: 'bold' }} type="success">PAGO</Text>}</td>
                           <td className='botao-deletar'>{!parcela.is_pago ? <Button type="primary" onClick={() => { baixarParcela(parcela.id, posicao) }}><CheckOutlined /></Button> : <Text style={{ fontWeight: 'bold' }} type="success">PAGO</Text>}</td>
                        </tr>
                     ))}
                  </table>
                  :
                  <table className='tabela-parcelas'>
                     <tr>
                        <th><p className='botao-deletar'>Data Vencimento</p></th>
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
               }
            </div>
         </Flex>
      </>
   );
}