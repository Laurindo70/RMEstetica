import React, { useEffect, useState } from 'react';
import './style.css';
import {
   ExclamationCircleFilled,
   BankOutlined,
} from '@ant-design/icons';
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbClockPlus } from "react-icons/tb";
import { Layout, Menu, Button, Dropdown, Modal, Typography, Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import CadastroAgendamento from './components/cadastroAgendamento';

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;
const { Title } = Typography;


function AgendamentosSemLogin() {
   const token = localStorage.getItem('TokenRm');
   const nomeUsuario = localStorage.getItem('NomeRm');
   const navigate = useNavigate();

   const [modalCadastro, setModalCadastro] = useState(false);

   const [estabelecimentos, setEstabelecimentos] = useState([]);
   const [estabelecimentoId, setEstabelecimentoId] = useState(0);
   const [histotico, setHistotico] = useState([]);

   const handleModalOpen = () => {
      setModalCadastro(!modalCadastro);
   }

   const sair = () => {
      confirm({
         title: 'ATENÇÃO?',
         icon: <ExclamationCircleFilled />,
         content: 'Realmente deseja sair ?',
         okText: 'Sair',
         okType: 'danger',
         cancelText: 'Cancelar',
         cancelButtonProps: {
            type: 'text'
         },
         onOk() {
            localStorage.setItem('TokenRm', ``);
            localStorage.setItem('NomeRm', ``);
            localStorage.setItem('EstabelecimentonRm', ``);
            navigate("/");
         },
         onCancel() {
         },
      });
   };

   const items = [
      {
         key: '1',
         label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
               {nomeUsuario ? nomeUsuario : 'Anonimo'}
            </a>
         ),
      },
      {
         key: '2',
         label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
               Alterar Senha
            </a>
         ),
      },
      {
         key: '3',
         label: (
            <a onClick={sair} rel="noopener noreferrer">
               Sair
            </a>
         ),
      },
   ];

   function mudarPagina(value) {
      navigate(`${value.key}`);
   }

   useEffect(() => {
      api.get(`/lista-estabelecimento`, {
         headers: {
            Authorization: token
         }
      }).then(
         (response) => {
            console.log(response.data);
            setEstabelecimentos(response.data);
         }
      );
   }, [])

   return (
      <Layout className="main-home">
         <Modal
            title={<Title level={2} >Cadastro de agendamento</Title>}
            centered
            open={modalCadastro}
            onOk={handleModalOpen}
            onCancel={handleModalOpen}
            footer={[
               <Button onClick={handleModalOpen} danger>
                  Fechar
               </Button>
            ]}
         >
            <CadastroAgendamento fecharModal={handleModalOpen} estabelecimento={estabelecimentoId} />
         </Modal>
         <Layout>
            <Header
               className='header-home'
            >
               <div className='opcao-sair'>
                  <Menu
                     style={{ background: 'none', color: '#FE9CCC', fontWeight: 'bold' }}
                     mode="horizontal"
                     onClick={mudarPagina}
                     items={[
                        {
                           key: '/',
                           label: 'Inicio',
                        },
                        {
                           key: '/agendamentos',
                           label: 'Agendamentos',
                        },
                        {
                           key: '/estabelecimentos',
                           label: 'Estabelecimentos',
                        }
                     ]}
                  />
                  <Dropdown
                     style={{ display: 'inline', float: 'right' }}
                     menu={{
                        items,
                     }}
                     placement="bottomRight"
                  >
                     <Button className='botao-sair'>Opções</Button>
                  </Dropdown>
               </div>
            </Header>
            <Content
               className='home-main'
            >

               <Layout
                  style={{
                     borderRadius: '10px'
                  }}
               >
                  <Sider
                     className='side'
                  >
                     <Menu
                        mode="inline"
                        defaultSelectedKeys={['estabelecimentos']}
                        className='menu-side'
                        items={[
                           {
                              key: 'estabelecimentos',
                              icon: <BankOutlined />,
                              label: 'Estabelecimentos'
                           },
                           {
                              key: 'historico',
                              icon: <FaClockRotateLeft />,
                              label: 'Histórico Agen.'
                           }
                        ]}
                     />
                  </Sider>
                  <Content
                     style={{
                        padding: '0 24px',
                        minHeight: 280,
                        borderLeft: 'solid 1px #A9335D',
                        height: '80vh'
                     }}
                  >
                     <Row gutter={16} className='pc'>

                        {estabelecimentos.map((estabelecimento) => (<Col span={8}>
                           <Card key={estabelecimento.id}
                              title={<Typography.Title level={4} style={{ color: '#fff' }}  >{estabelecimento.nome_estabelecimento}</Typography.Title>}
                              bordered={false}
                              style={{ background: '#FE9CCC', boxShadow: '3px 3px 3px #1E1E1E', color: '#fff' }}
                              actions={[
                                 <TbClockPlus key="setting" onClick={() => { setEstabelecimentoId(estabelecimento.id); handleModalOpen(); }} />,
                              ]}
                              className='cards-estab'
                           >
                              {estabelecimento.endereco}
                           </Card>
                        </Col>))}
                     </Row>

                     <Row justify="center" gutter={16} className='mobile' >
                        {estabelecimentos.map((estabelecimento) => (<Card key={estabelecimento.id}
                           title={<Typography.Title level={4} style={{ color: '#fff' }}  >{estabelecimento.nome_estabelecimento}</Typography.Title>}
                           bordered={false}
                           style={{ background: '#FE9CCC', boxShadow: '3px 3px 3px #1E1E1E', color: '#fff' }}
                           actions={[
                              <TbClockPlus key="setting" onClick={() => { setEstabelecimentoId(estabelecimento.id); handleModalOpen(); }} />,
                           ]}
                           className='cards-estab'
                        >
                           {estabelecimento.endereco}
                        </Card>))}
                     </Row>
                  </Content>
               </Layout>

            </Content>
         </Layout>
      </Layout>
   );
};

export default AgendamentosSemLogin;