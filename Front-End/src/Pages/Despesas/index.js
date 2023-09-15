import React, { useState, useEffect } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';
import api from '../../Utils/api';
import { moneyMask } from '../../Utils/mascaras';
const { Title } = Typography;

function Despesas() {
   const token = localStorage.getItem('TokenRm');

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [messageApi, contextHolder] = message.useMessage();
   const [despesas, setDespesas] = useState([]);
   const [estabelecimentos, setEstabelecimentos] = useState();

   const [estabelecimentoId, setEstabelecimentoId] = useState(null);
   const [nomeDespesa, setNomeDespesa] = useState(null);
   const [valorDespesa, setValorDespesa] = useState(null);

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_despesa',
         key: 'nome_despesa',
      },
      {
         title: 'Valor',
         dataIndex: 'valor_despesa',
         key: 'valor_despesa',
         render: (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      },
      {
         title: 'Usuário',
         dataIndex: 'usuario',
         key: 'usuario',
      },
      {
         title: 'Estabelecimento',
         dataIndex: 'estabelecimento',
         key: 'estabelecimento',
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : <Button type="primary" style={{ cursor: 'default' }}>Inativado</Button>
      }
   ];

   const handleModal = () => {
      setIsModalOpen(!isModalOpen);
   }

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         estabelecimento_id: estabelecimentoId,
         nome_despesa: nomeDespesa,
         valor_despesa: valorDespesa
      }

      try {
         await api.post('/despesa', dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               handleModal();
               messageApi.open({
                  type: 'success',
                  content: 'Cadastrado com sucesso.',
               });
            }
         )
      } catch (error) {
         console.log(error.data);
         alert('Erro no cadastro')
      }
   }

   async function inativar(id) {
      try {
         await api.delete(`/despesa/${id}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               setIsModalOpen(false);
               messageApi.open({
                  type: 'success',
                  content: 'Inativado com sucesso.',
               });
            }
         )
      } catch (error) {
         console.log(error.response.data.mensagem);
      }
   }

   useEffect(() => {
      api.get(`/despesa`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let dadosDespesas = [];

            for (let i = 0; i < Response.data.length; i++) {
               dadosDespesas.push({
                  id: Response.data[i].id,
                  nome_despesa: Response.data[i].nome_despesa,
                  valor_despesa: Response.data[i].valor_despesa,
                  ativo: [Response.data[i].ativo, Response.data[i].id],
                  usuario: Response.data[i].usuario,
                  estabelecimento: Response.data[i].estabelecimento
               })
            }

            setDespesas(dadosDespesas);
         }
      )
   }, [isModalOpen]);

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

   return (
      <div className='container-estabelecimentos'>
         {contextHolder}
         <Modal title={<Title level={3}>Cadastro de despesas</Title>} open={isModalOpen} okOk={handleModal} onCancel={handleModal} footer={[]}>
            <form onSubmit={salvar}>
               <Row justify="start">
                  <label className='label-cadastro'>Nome Despesa</label>
                  <Input className='input-cadastro' onChange={e => setNomeDespesa(e.target.value)} value={nomeDespesa} type="text" required />
               </Row>
               <Row justify="start">
                  <label className='label-cadastro'>Valor Despesa</label>
                  <Input className='input-cadastro' onChange={e => setValorDespesa(moneyMask(e.target.value))} value={valorDespesa} type="text" required />
               </Row>
               <Row justify="start">
                  <label className='label-cadastro'>Estabelecimento</label>
                  <Select
                     style={{
                        width: '100%',
                        border: 'solid 1px #A9335D',
                        borderRadius: '5px',
                     }}
                     options={estabelecimentos}
                     onChange={(value) => { setEstabelecimentoId(value) }}
                  />
               </Row>
               <Row justify="end" className='botao-salvar'>
                  <button className='botao-salvar' >Salvar</button>
               </Row>
            </form>
         </Modal>

         <Title level={3}>Despesas</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}>
               <Button icon={<PlusCircleOutlined />} className='botao' onClick={handleModal}>Nova Despesa</Button>
            </Col>
         </Row>
         <Divider />
         <Table dataSource={despesas} columns={colunas} pagination={false} />
      </div>
   );
};

export default Despesas;