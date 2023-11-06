import React, { useState, useEffect } from 'react';
import { PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Divider, Modal, Typography, Row, Button, Table, Col, DatePicker, Flex } from 'antd';
import dayjs from 'dayjs';
import api from '../../Utils/api';

const { Title, Text } = Typography;

function Pagamentos() {
   const token = localStorage.getItem('TokenRm');
   const date = new Date();

   const [datasInicio, setDataInicio] = useState(null);
   const [datasFim, setDatasFim] = useState(null);
   const [agendadamentos, setAgendamentos] = useState([]);

   const [modalComplementacao, setModalComplementacao] = useState(false);
   const [dadosPagamento, setDadosPagamento] = useState(null);

   const colunas = [
      {
         title: 'Nome Cliente',
         dataIndex: 'nome_cliente',
         key: 'nome_cliente',
      },
      {
         title: 'Data',
         dataIndex: 'data',
         key: 'data',
      },
      {
         title: 'Valor',
         dataIndex: 'valor',
         key: 'valor',
         render: (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      },
      {
         title: 'Finalizar',
         dataIndex: 'finalizar',
         key: 'finalizar',
         render: (sit) => !sit[1] ? (sit[0] ? <Text style={{ fontWeight: 'bold' }} type="success">AGENDAMENTO FINALIZADO</Text> : <Text style={{ fontWeight: 'bold' }} type="danger">AGENDAMENTO PENDENTE</Text>) : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => !sit[0] ? (sit[1] ? <Text style={{ fontWeight: 'bold' }} type="success">AGENDAMENTO FINALIZADO</Text> : <Text style={{ fontWeight: 'bold' }} type="danger">AGENDAMENTO PENDENTE</Text>) : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      },
      {
         title: 'Financeiro',
         dataIndex: 'financeiro',
         key: 'financeiro',
         render: (sit) => !sit[1] ? (!sit[0] ? <Text style={{ fontWeight: 'bold' }} type="danger">PENDENTE</Text> : <Text style={{ fontWeight: 'bold' }} type="success">PAGO</Text>) : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      },
      {
         title: 'Expandir',
         dataIndex: 'expandir',
         key: 'expandir',
         render: (sit) => !sit[0] ? <Button type="primary" onClick={() => { expandir(sit[1]) }}>Expandir</Button> : <Text style={{ fontWeight: 'bold' }} type="danger">CANCELADO</Text>
      }
   ];

   const handleModalOpen = () => {
      setModalComplementacao(!modalComplementacao);
   }

   async function expandir(id) {
      handleModalOpen();
      console.log(agendadamentos.filter((word) => word.id == id));
      setDadosPagamento(agendadamentos.filter((word) => word.id == id));
   }

   async function carregarDados() {
      const estab = localStorage.getItem('EstabelecimentonRm');
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
                  data: Response.data[i].data,
                  valor: Response.data[i].valor,
                  finalizar: [Response.data[i].is_finalizado, Response.data[i].is_cancelado],
                  ativo: [Response.data[i].is_cancelado, Response.data[i].is_finalizado],
                  financeiro: [Response.data[i].is_pago, Response.data[i].is_cancelado],
                  expandir: [Response.data[i].is_cancelado, Response.data[i].id]
               })
            }
            setAgendamentos(data);
         }
      );
   }

   useEffect(() => {
      if (datasInicio && datasFim) {
         console.log(datasInicio);
         carregarDados();
      } else {
         setDataInicio(`01-${date.getMonth() + 1}-${date.getFullYear()}`);
         setDatasFim(`${String(date.getDate()).padStart(2, '0')}-${date.getMonth() + 1}-${date.getFullYear()}`);
      }
   }, [datasFim, datasInicio]);

   return (
      <>
         <Modal
            title={<Title level={2} >Dados do Pagamento</Title>}
            centered
            open={modalComplementacao}
            onOk={handleModalOpen}
            onCancel={handleModalOpen}
            width={1000}
         >
            <Divider>Dados do Pagamento</Divider>
            <Row><Title level={4}>Nome do cliente: {dadosPagamento == null ? '' : dadosPagamento[0].nome_cliente}</Title></Row>
            <Row><Title level={4}>Valor Total: {dadosPagamento == null ? '' : dadosPagamento[0].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title></Row>
            <Divider>Parcelas</Divider>
            <Flex gap="middle" vertical>
               <p>Teste 01</p>
               <p>Teste 01</p>
            </Flex>
         </Modal>

         <Title level={2}>Pagamentos</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
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

export default Pagamentos