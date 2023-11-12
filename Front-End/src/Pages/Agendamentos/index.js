import React, { useState, useEffect } from 'react';
import './style.css';
import { PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Divider, Modal, Typography, Row, Button, Table, Col, DatePicker, notification } from 'antd';
import dayjs from 'dayjs';
import api from '../../Utils/api';
import RegisterAgendamento from './components/register';

const { Title, Text } = Typography;

function Agendamentos() {
   const [apiNot, contextHolder] = notification.useNotification();
   const token = localStorage.getItem('TokenRm');
   const date = new Date();

   const { confirm } = Modal;

   const [isModalCadastro, setIsModalCadastro] = useState(false);
   const [datasInicio, setDataInicio] = useState(null);
   const [datasFim, setDatasFim] = useState(null);
   const [agendadamentos, setAgendamentos] = useState([]);

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

   const handleModalCad = () => {
      setIsModalCadastro(!isModalCadastro);
   }

   const colunas = [
      {
         title: 'Nome Cliente',
         dataIndex: 'nome_cliente',
         key: 'nome_cliente',
      },
      {
         title: 'Valor',
         dataIndex: 'valor',
         key: 'valor',
         render: (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
         render: (sit) => !sit[2] ? (sit[0] ? <Text style={{ fontWeight: 'bold' }} type="success">AGENDAMENTO FINALIZADO</Text> : <Button type="primary" onClick={() => { finalizar(sit[1]) }} >Finalizar</Button>) : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => sit[2] ? <Text style={{ fontWeight: 'bold' }} type="success">AGENDAMENTO FINALIZADO</Text> : (!sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Cancelar</Button> : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>)
      },
      {
         title: 'Financeiro',
         dataIndex: 'financeiro',
         key: 'financeiro',
         render: (sit) => !sit[2] ? (!sit[0] ? <Text style={{ fontWeight: 'bold' }} type="warning">PENDENTE</Text> : <Text style={{ fontWeight: 'bold' }} type="success">PAGO</Text>) : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      }
   ];

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

   async function carregarDados() {
      const estab = localStorage.getItem('EstabelecimentonRm');
      setEstabelecimentoSelecionado(localStorage.getItem('EstabelecimentonRm'))

      await api.get(`/agendadamentos/estabelecimento=${estab}/data-inicial=${datasInicio}/data-fim=${datasFim}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            console.log(Response.data)
            let data = [];
            for (let i = 0; i < Response.data.length; i++) {
               data.push({
                  id: Response.data[i].id,
                  nome_cliente: Response.data[i].nome_cliente,
                  valor: Response.data[i].valor,
                  nome_profissional: Response.data[i].nome_profissional,
                  nome_procedimento: Response.data[i].nome_procedimento,
                  data: Response.data[i].data,
                  finalizar: [Response.data[i].is_finalizado, Response.data[i].id, Response.data[i].is_cancelado],
                  ativo: [Response.data[i].is_cancelado, Response.data[i].id, Response.data[i].is_finalizado],
                  financeiro: [Response.data[i].is_pago, Response.data[i].id, Response.data[i].is_cancelado]
               })
            }
            setAgendamentos(data);
         }
      );
   }

   useEffect(() => {
      if (datasInicio && datasFim){
         console.log(datasInicio);
         carregarDados();
      } else {
         setDataInicio(`01-${date.getMonth() + 1}-${date.getFullYear()}`);
         setDatasFim(`${String(date.getDate()).padStart(2, '0')}-${date.getMonth() + 1}-${date.getFullYear()}`);
      }
   }, [estabelecimentoSelecionado, datasFim, datasInicio, isModalCadastro]);

   return (
      <>
         {contextHolder}
         <Modal title={<Title level={3}>Cadastro de Agendamento</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterAgendamento estabelecimento_id={estabelecimentoSelecionado} fecharModal={handleModalCad} ></RegisterAgendamento>
         </Modal>

         <Title level={2}>Agendamentos</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}>
               <Button icon={<PlusCircleOutlined />} className='botao' onClick={handleModalCad}>Novo Agendamento</Button>
            </Col>
            <Col>
               Data Inicio:<DatePicker defaultValue={dayjs(`01-${date.getMonth() + 1}-${date.getFullYear()}`, 'DD-MM-YYYY')} format={'DD-MM-YYYY'} onChange={(date, dateString) => setDataInicio(dateString == undefined ? null : dateString)} />
               Data Fim:<DatePicker defaultValue={dayjs(dayjs(), 'DD-MM-YYYY')} format={'DD-MM-YYYY'} onChange={(date, dateString) => setDatasFim(dateString == undefined ? null : dateString)} />
            </Col>
         </Row>
         <Divider />
         <Table dataSource={agendadamentos} columns={colunas} pagination={false} />
      </>
   );
}


export default Agendamentos