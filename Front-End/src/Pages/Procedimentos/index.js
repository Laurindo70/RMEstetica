import React, { useState, useEffect } from 'react';
import { Col, Row, Table, Button, Typography, List, Modal, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import api from '../../Utils/api';
import RegisterProcedimento from './components/Register';

const { Title } = Typography;

function Procedimentos() {
   const token = localStorage.getItem('TokenRm');

   const [isModalCadastro, setIsModalCadastro] = useState(false);

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
   const [profissionais, setProfissionais] = useState();

   const [produtos, setProdutos] = useState([]);
   const [procedimentos, setProcedimentos] = useState([]);

   const [messageApi, contextHolder] = message.useMessage();

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
         render: (sit) => sit[0] ? <Button type="primary" onClick={() => { inativar(sit) }} danger>Desativar</Button> : <Button type="primary" onClick={() => { inativar(sit) }}>Ativar</Button>
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
      try {
         await api.delete(`/procedimento/${id[1]}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               messageApi.open({
                  type: 'success',
                  content: id[0] ? 'Inativado com sucesso.' : 'ativado com sucesso.',
               });
               window.location.reload();
            }
         )
      } catch (error) {
         console.log(error.response.data.mensagem);
      }
   }

   async function carregarDados() {
      const estab = localStorage.getItem('EstabelecimentoRm');

      try {
         await api.get(`/procedimento/${estab}`, {
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

         await api.get(`/profissional/${estab}`, {
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

               setProfissionais(dadosProfissionais);
            }
         )
      } catch (error) {
         console.log(error.data);
         alert('Erro ao carregar dados.')
      }

   }

   useEffect(() => {
      const estab = localStorage.getItem('EstabelecimentoRm');
      setEstabelecimentoSelecionado(localStorage.getItem('EstabelecimentoRm'))
      carregarDados();

      api.get(`/produto/${estab}`, {
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
   }, [isModalCadastro]);

   return (
      <>
         {contextHolder}
         <Modal title={<Title level={3}>Cadastro de Procedimento</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterProcedimento estabelecimento_id={estabelecimentoSelecionado} produtos={produtos} fecharModal={handleModalCad} listaProfissionais={profissionais} />
         </Modal>

         <Row justify="end" className='opcoes-usuarios header-movs'>
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