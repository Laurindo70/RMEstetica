import React, { useState, useEffect } from 'react';
import './style.css';
import { PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Divider, Modal, Typography, Select, Row, Button, Table, Col, DatePicker, notification } from 'antd';
import api from '../../Utils/api';
import RegisterAgendamento from './components/register';
import PagarAgendamento from './components/pagamento';

const { Title } = Typography;

function Agendamentos() {
   const [apiNot, contextHolder] = notification.useNotification();
   const token = localStorage.getItem('TokenRm');

   const { confirm } = Modal;

   const [pagamentoId, setPagamentoId] = useState(null);

   const [isModalSelecEstab, setIsModalSelecEstab] = useState(true);
   const [isModalCadastro, setIsModalCadastro] = useState(false);
   const [isModalPagamento, setIsModalPagamento] = useState(false);
   const [datasInicio, setDataInicio] = useState(null);
   const [datasFim, setDatasFim] = useState(null);
   const [agendadamentos, setAgendamentos] = useState([])

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
   const [estabelecimentos, setEstabelecimentos] = useState();

   const handleModalEstab = () => {
      setIsModalSelecEstab(!isModalSelecEstab);
   }

   const handleModalCad = () => {
      setIsModalCadastro(!isModalCadastro);
   }

   const handleModalPag = () => {
      setIsModalPagamento(!isModalPagamento);
   }

   const colunas = [
      {
         title: 'Nome Cliente',
         dataIndex: 'nome_cliente',
         key: 'nome_cliente',
      },
      {
         title: 'Nome Profissional',
         dataIndex: 'nome_profissional',
         key: 'nome_profissional'
      },
      {
         title: 'Nome Procedimento',
         dataIndex: 'nome_procedimento',
         key: 'nome_procedimento'
      },
      {
         title: 'Data',
         dataIndex: 'data',
         key: 'data',
      },
      {
         title: 'Finalizar',
         dataIndex: 'finalizar',
         key: 'finalizar',
         render: (sit) => !sit[2] ? (sit[0] ? 'Agendamento Finalizado' : <Button type="primary" onClick={() => { finalizar(sit[1]) }} >Finalizar</Button>) : 'Cancelado'
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => !sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Cancelar</Button> : 'Cancelado'
      },
      {
         title: 'Financeiro',
         dataIndex: 'financeiro',
         key: 'financeiro',
         render: (sit) => !sit[2] ? (!sit[0] ? <Button type="primary" onClick={() => { pagar(sit[1]) }}>Pagar</Button> : 'Pago') : 'Cancelado'
      }
   ];

   const pagar = async (id) => {
      setPagamentoId(id);
      handleModalPag();
   }

   const inativar = async (id) => {
      await confirm({
         title: 'Deseja cancelar agendamento ?',
         icon: <ExclamationCircleFilled />,
         content: 'Realmente deseja cancelar o agendamento ??',
         onOk() {
            api.put(`/cancelar-agendamento/${id}`, {
               headers: {
                  Authorization: token
               }
            }).then(
               (Response) => {
                  carregarDados();
                  apiNot.success({
                     message: `Sucesso`,
                     description: 'Cancelado com sucesso!!!',
                     placement: 'topRight',
                   });
               })
         },
         onCancel() {
            
         },
      });
   }

   const finalizar = async (id) => {
      await confirm({
         title: 'Deseja cancelar agendamento ?',
         icon: <ExclamationCircleFilled />,
         content: 'Realmente deseja cancelar o agendamento ??',
         onOk() {
            api.put(`/finalizar-agendamento/${id}`, {
               headers: {
                  Authorization: token
               }
            }).then(
               (Response) => {
                  carregarDados();
                  apiNot.success({
                     message: `Sucesso`,
                     description: 'Salvo com sucesso!!!',
                     placement: 'topRight',
                   });
               })
         },
         onCancel() {
            
         },
      });
   }

   useEffect(() => {
      api.get(`/estabelecimento/nome=`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let data = [];
            for (let i = 0; i < Response.data.length; i++) {
               data.push({
                  label: Response.data[i].nome_estabelecimento,
                  value: Response.data[i].id
               });
            }
            setEstabelecimentos(data);
         }
      );
   }, []);

   async function carregarDados(){
      await api.get(`/agendadamentos/estabelecimento=${estabelecimentoSelecionado}/data-inicial=${datasInicio}/data-fim=${datasFim}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let data = [];
            for (let i = 0; i < Response.data.length; i++) {
               data.push({
                  id: Response.data[i].id,
                  nome_cliente: Response.data[i].nome_cliente,
                  nome_profissional: Response.data[i].nome_profissional,
                  nome_procedimento: Response.data[i].nome_procedimento,
                  data: Response.data[i].data,
                  finalizar: [Response.data[i].is_finalizado, Response.data[i].id, Response.data[i].is_cancelado],
                  ativo: [Response.data[i].is_cancelado, Response.data[i].id],
                  financeiro: [Response.data[i].is_pago, Response.data[i].id, Response.data[i].is_cancelado]
               })
            }
            setAgendamentos(data);
         }
      );
   }

   useEffect(() => {
      if (estabelecimentoSelecionado !== null && datasInicio !== null && datasFim !== null)
         carregarDados();
   }, [estabelecimentoSelecionado, datasFim, datasInicio, isModalCadastro, isModalPagamento]);

   return (
      <>
         {contextHolder}
         <Modal title={<Title level={3}>Selecione o Estabelecimento</Title>} open={isModalSelecEstab} onOk={handleModalEstab} onCancel={handleModalEstab}>
            <Row justify="start">
               <label className='label-cadastro'>Estabelecimento</label>
               <Select
                  style={{
                     width: '100%',
                     border: 'solid 1px #A9335D',
                     borderRadius: '5px',
                  }}
                  options={estabelecimentos}
                  onChange={(value) => { setEstabelecimentoSelecionado(value) }}
               />
            </Row>
         </Modal>

         <Modal title={<Title level={3}>Cadastro de Agendamento</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterAgendamento estabelecimento_id={estabelecimentoSelecionado} fecharModal={handleModalCad} ></RegisterAgendamento>
         </Modal>

         <Modal title={<Title level={3}>Pagar Agendamento</Title>} open={isModalPagamento} onCancel={handleModalPag} footer={[]}>
            <PagarAgendamento agendamento={pagamentoId} fecharModal={handleModalPag} ></PagarAgendamento>
         </Modal>

         <Title level={2}>Agendamentos</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}>
               <Button icon={<PlusCircleOutlined />} className='botao' onClick={handleModalCad}>Novo Agendamento</Button>
            </Col>
            <Col>
               Data Inicio:<DatePicker onChange={(date, dateString) => setDataInicio(dateString == undefined ? null : dateString)} />
               Data Fim:<DatePicker onChange={(date, dateString) => setDatasFim(dateString == undefined ? null : dateString)} />
            </Col>
         </Row>
         <Divider />
         <Table dataSource={agendadamentos} columns={colunas} pagination={false} />
      </>
   );
}


export default Agendamentos