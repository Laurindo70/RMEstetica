import React, { useState, useEffect } from 'react';
import { Col, Input, Row, Table, Button, DatePicker, Select, Typography, List, Modal } from 'antd';
import { SearchOutlined, SyncOutlined, PlusCircleOutlined } from '@ant-design/icons';
import api from '../../Utils/api';
import RegisterProcedimento from './components/Register';

const { Title } = Typography;

function Procedimentos() {
   const token = localStorage.getItem('TokenRm');

   const [isModalSelecEstab, setIsModalSelecEstab] = useState(true);
   const [isModalCadastro, setIsModalCadastro] = useState(false);

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
   const [estabelecimentos, setEstabelecimentos] = useState();
   const [profissionais, setProfissionais] = useState();

   const [produtos, setProdutos] = useState([]);
   const [procedimentos, setProcedimentos] = useState([]);

   const [filtro, setFiltro] = useState(null);

   const handleModalEstab = () => {
      setIsModalSelecEstab(!isModalSelecEstab);
   }

   const handleModalCad = () => {
      setIsModalCadastro(!isModalCadastro);
   }

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_procedimento',
         key: 'nome_procedimento'
      },
      {
         title: 'Valor',
         dataIndex: 'valor',
         key: 'valor',
         render: (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      },
      {
         title: 'Tempo',
         dataIndex: 'tempo',
         key: 'tempo'
      },
      {
         title: 'Profissionais',
         dataIndex: 'profissionais',
         key: 'profissionais',
         render: (prof) => <List
            bordered
            dataSource={prof}
            renderItem={(item) => (
               <List.Item>
                  {item.nome_profissional}
               </List.Item>
            )}
         />
      },
      {
         title: 'Situação',
         dataIndex: 'situacao',
         key: 'situacao',
         render: (sit) => sit[1] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : <Button type="primary" onClick={() => { inativar(sit[1]) }}>Ativar</Button>
      },
      {
         title: 'Produtos',
         dataIndex: 'produtos',
         key: 'produtos',
         render: (est) => <List
            bordered
            dataSource={est}
            renderItem={(item) => (
               <List.Item>
                  {item.nome_produto} - {item.quantidade}
               </List.Item>
            )}
         />
      }
   ]

   async function inativar(id) {
      console.log(id);
   }

   async function carregarDados() {

      try {
         await api.get(`/procedimento/${estabelecimentoSelecionado}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let dadosProcedimentos = [];

               for (let i = 0; i < Response.data.length; i++) {
                  dadosProcedimentos.push({
                     id: Response.data[i].id,
                     nome_procedimento: Response.data[i].nome_procedimento,
                     tempo: Response.data[i].tempo,
                     valor: Response.data[i].valor,
                     situacao: [Response.data[i].ativo, Response.data[i].id],
                     produtos: Response.data[i].produtos,
                     profissionais: Response.data[i].profissionais
                  })
               }

               setProcedimentos(dadosProcedimentos);
            }
         )

         await api.get(`/profissional/${estabelecimentoSelecionado}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let dadosProfissionais = [];

               for (let i = 0; i < Response.data.length; i++) {
                  dadosProfissionais.push({
                     label: Response.data[i].nome_profissional,
                     value: Response.data[i].id
                  })
               }

               console.log(dadosProfissionais);

               setProfissionais(dadosProfissionais);
            }
         )
      } catch (error) {
         console.log(error.data);
         alert('Erro ao carregar dados.')
      }

   }

   useEffect(() => {
      if (estabelecimentoSelecionado !== null) {
         carregarDados();

         api.get(`/produto/${estabelecimentoSelecionado}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let dadosProdutos = [];

               for (let i = 0; i < Response.data.length; i++) {
                  dadosProdutos.push({
                     id: Response.data[i].id,
                     label: Response.data[i].nome_produto,
                     value: i
                  })
               }

               setProdutos(dadosProdutos);
            }
         )
      }
   }, [isModalSelecEstab, isModalCadastro]);

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
      <>
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

         <Modal title={<Title level={3}>Cadastro de estabelecimento</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterProcedimento estabelecimento_id={estabelecimentoSelecionado} produtos={produtos} fecharModal={handleModalCad} listaProfissionais={profissionais} />
         </Modal>

         <Row justify="end" className='opcoes-usuarios header-movs'>
            <Col span={20}>
               <Button icon={<SyncOutlined />} onClick={handleModalEstab} className='botao'>Trocar Estabelecimento</Button>
            </Col>
            <Col span={3}>
               <Button icon={<PlusCircleOutlined />} onClick={handleModalCad} className='botao'>Novo Procedimento</Button>
            </Col>
            {/* <Col span={2}>
               <Button onClick={carregarDados} icon={<SearchOutlined />} className='botao'>Filtrar</Button>
            </Col>
            <Col span={5}>
               <Input value={filtro} onChange={e => setFiltro(e.target.value)} className='input-filtro' placeholder="Digite o nome do procedimento" />
            </Col> */}
         </Row>
         <Table dataSource={procedimentos} columns={colunas} pagination={false} />
      </>
   );
}

export default Procedimentos