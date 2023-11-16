import React, { useEffect, useState } from 'react';
import './style.css';
import {
   ExclamationCircleFilled,
   BankOutlined,
} from '@ant-design/icons';
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbClockPlus } from "react-icons/tb";
import { Layout, Menu, Button, Dropdown, Modal, Typography, Card, Col, Row, notification, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import CadastroAgendamento from './components/cadastroAgendamento';

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;
const { Title } = Typography;


function AgendamentosSemLogin() {
   const [apiNot, contextHolder] = notification.useNotification();
   const token = localStorage.getItem('TokenRm');
   const nomeUsuario = localStorage.getItem('NomeRm');
   const navigate = useNavigate();

   const [modalCadastro, setModalCadastro] = useState(false);
   const [modalSenha, setModalSenha] = useState(false);
   const [novaSenha, setNovaSenha] = useState(null);

   const [estabelecimentos, setEstabelecimentos] = useState([]);
   const [estabelecimentoId, setEstabelecimentoId] = useState(0);
   const [historico, setHistorico] = useState([]);
   const [tela, setTela] = useState('estabelecimentos');

   const handleModalOpen = () => {
      setModalCadastro(!modalCadastro);
   }

   const handleModalOpenSenha = () => {
      setModalSenha(!modalSenha);
   }

   async function mudarSenha(){
      try {

         if (token) {
            await api.put('/usuario', {senha: novaSenha}, {
               headers: {
                  Authorization: token
               }
            }).then(
               (Response) => {
                  handleModalOpenSenha();
                  Modal.success({
                     content: 'Senha alterado com sucesso.',
                  });
               }
            )
         }

      } catch (error) {
         Modal.error({
            title: 'Error',
            content: error.response.data.mensagem,
         });
      }
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

   const items = (token ? [
      {
         key: '1',
         label: (
            <a>
               {nomeUsuario ? nomeUsuario : 'Anonimo'}
            </a>
         ),
      },
      {
         key: '2',
         label: (
            <a onClick={handleModalOpenSenha} >
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
   ] : 
   [
      {
         key: '1',
         label: (
            <a>
               {nomeUsuario ? nomeUsuario : 'Anonimo'}
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
   ]);

   function mudarPagina(value) {

      if (!token && value.key !== 'estabelecimentos' && value.key !== '/') {
         return apiNot.warning({
            message: `É necessario realizar o login`,
            description: "Não é possível acessar o histórico sem fazer login.",
            placement: 'topRight',
         });
      }

      if (value == '/') return navigate(`${value.key}`);

      setTela(value.key);
   }

   useEffect(() => {
      api.get(`/lista-estabelecimento`, {
         headers: {
            Authorization: token
         }
      }).then(
         (response) => {
            setEstabelecimentos(response.data);
         }
      );

      if (token) {
         api.get(`/historico-agendamento`, {
            headers: {
               Authorization: token
            }
         }).then(
            (response) => {
               setHistorico(response.data);
            }
         );
      }
   }, [modalCadastro])

   return (
      <Layout className="main-home">
         {contextHolder}
         <Modal
            title={<Title level={2} >Alterar Senha</Title>}
            centered
            open={modalSenha}
            onOk={mudarSenha}
            onCancel={handleModalOpenSenha}
         >
            <label>*Nova Senha:</label>
            <Input placeholder='Digite a nova senha' value={novaSenha} onChange={e => setNovaSenha(e.target.value)}  />
         </Modal>
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
                     defaultSelectedKeys={['estabelecimentos']}
                     items={[
                        {
                           key: '/',
                           label: 'Inicio',
                        },
                        {
                           key: 'agendamentos',
                           label: 'Agendamentos',
                        },
                        {
                           key: 'estabelecimentos',
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
                        onClick={mudarPagina}
                        items={[
                           {
                              key: 'estabelecimentos',
                              icon: <BankOutlined />,
                              label: 'Estabelecimentos'
                           },
                           {
                              key: 'agendamentos',
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
                     {tela == 'estabelecimentos' ? <>
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
                     </>
                        :
                        <>
                           <Row gutter={16} className='pc'>

                              {historico.map((histo) => (<Col span={8}>
                                 <Card key={histo.id}
                                    title={<Typography.Title level={4} style={{ color: '#fff' }}  >{histo.nome_estabelecimento}</Typography.Title>}
                                    bordered={false}
                                    style={{ background: '#FE9CCC', boxShadow: '3px 3px 3px #1E1E1E', color: '#fff' }}
                                    className='cards-estab'
                                 >
                                    <Row>{histo.nome_estabelecimento}</Row>
                                    <Row>{histo.nome_procedimento}</Row>
                                    <Row>{histo.nome_profissional}</Row>
                                    <Row>{histo.data}</Row>
                                    <Row>{histo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Row>
                                 </Card>
                              </Col>))}
                           </Row>

                           <Row justify="center" gutter={16} className='mobile' >
                              {historico.map((histo) => (<Card key={histo.id}
                                 title={<Typography.Title level={4} style={{ color: '#fff' }}  >{histo.nome_estabelecimento}</Typography.Title>}
                                 bordered={false}
                                 style={{ background: '#FE9CCC', boxShadow: '3px 3px 3px #1E1E1E', color: '#fff' }}
                                 className='cards-estab'
                              >

                              </Card>))}
                           </Row>
                        </>
                     }
                  </Content>
               </Layout>

            </Content>
         </Layout>
      </Layout>
   );
};

export default AgendamentosSemLogin;