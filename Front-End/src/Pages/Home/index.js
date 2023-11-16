import React, { useEffect, useLayoutEffect, useState } from 'react';
import './style.css';
import {
   HomeOutlined,
   MenuUnfoldOutlined,
   MenuFoldOutlined,
   ExclamationCircleFilled,
   UserOutlined,
   BankOutlined,
   DollarOutlined,
   ShoppingCartOutlined,
   CalendarOutlined,
   UsergroupAddOutlined
} from '@ant-design/icons';
import { BsFillClipboard2PlusFill, BsTable, BsFillPiggyBankFill } from "react-icons/bs";
import { AiFillSignal } from "react-icons/ai";
import { Layout, Menu, Button, Dropdown, Modal, Select, Row , Input, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../../Utils/api';

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;
const { Title } = Typography;

function Home() {
   const token = localStorage.getItem('TokenRm');
   let location = useLocation();
   const nomeUsuario = localStorage.getItem('NomeRm');
   const navigate = useNavigate();

   const [collapsed, setCollapsed] = useState(false);
   const [estabelecimentos, setEstabelecimentos] = useState(null);
   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
   const [modalSenha, setModalSenha] = useState(false);
   const [novaSenha, setNovaSenha] = useState(null);
   const [itens, setItens] = useState([]);

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
            localStorage.setItem('EstabelecimentoRm', ``);
            navigate("/");
         },
         onCancel() {
         },
      });
   };

   const handleModalOpenSenha = () => {
      setModalSenha(!modalSenha);
   }

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

   function mudarPagina(value) {
      setCollapsed(true)
      navigate(`${value.key}`);
   }

   useEffect(() => {
      setItens([
         {
            key: '',
            icon: <HomeOutlined />,
            label: 'Home',
         },
         {
            key: 'dashboard',
            icon: <AiFillSignal />,
            label: 'Dashboard'
         },
         {
            key: 'agendamento',
            icon: <BsTable />,
            label: 'Agendamentos'
         },
         {
            key: 'pagamentos',
            icon: <BsFillPiggyBankFill />,
            label: 'Pagamentos'
         },
         {
            key: 'despesas',
            icon: <DollarOutlined />,
            label: 'Despesas'
         },
         {
            key: 'usuarios',
            icon: <UserOutlined />,
            label: 'Usuários',
         },
         {
            key: 'estabelecimentos',
            icon: <BankOutlined />,
            label: 'Estabelecimentos',
         },
         {
            key: 'estoque',
            icon: <ShoppingCartOutlined />,
            label: 'Estoque'
         },
         {
            key: 'procedimento',
            icon: <BsFillClipboard2PlusFill />,
            label: 'Procedimentos'
         },
         {
            key: 'profissionais',
            icon: <UsergroupAddOutlined />,
            label: 'Profissionais'
         },
      ]);
   }, [location]);

   useLayoutEffect(() => {
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
                  value: i,
                  id: Response.data[i].id
               });
            }
            let est = localStorage.getItem('EstabelecimentoRm');
            if (est) {
               for (let i = 0; i < Response.data.length; i++) {
                  if (Response.data[i].id == est) {
                     setEstabelecimentoSelecionado(i);
                  }
               }
            } else {
               setEstabelecimentoSelecionado(+data[0].value);
               localStorage.setItem('EstabelecimentoRm', data[0].id);
            }
            setEstabelecimentos(data);
         }
      ).catch((error) => {
         if (error.response.status === 401) {
            localStorage.setItem('TokenRm', ``);
            localStorage.setItem('NomeRm', ``);
            localStorage.setItem('EstabelecimentoRm', ``);
            navigate("/");
         }
      });
   }, []);

   return (
      <Layout className="main-home">
         <Modal
            title={<Title level={2} >Alterar Senha</Title>}
            centered
            open={modalSenha}
            onOk={mudarSenha}
            onCancel={handleModalOpenSenha}
         >
            <label>*Nova Senha:</label>
            <Input placeholder='Digite a nova senha' value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
         </Modal>
         <Sider style={{ background: '#FE9CCC' }} className='sidebar-home' trigger={null} collapsible collapsed={collapsed}>
            <Menu
               style={{ background: '#FE9CCC', color: '#fff', fontWeight: 'bold' }}
               mode="inline"
               defaultSelectedKeys={[location.pathname.substring(6, location.pathname.length)]}
               onClick={mudarPagina}
               items={itens}
            />
         </Sider>
         <Layout>
            <Header
               className='header-home'
            >
               <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                     fontSize: '16px',
                     width: 64,
                     height: 64,
                  }}
               />
               <div className='opcao-sair'>
                  {localStorage.getItem('TipoRm') == 1 ? <>
                     <Row>
                        <p>Estabelecimento:</p>
                     </Row>
                     <Row justify="start">
                        <Select
                           style={{
                              width: '200px',
                              border: 'solid 1px #A9335D',
                              borderRadius: '5px',
                              marginRight: '10px'
                           }}
                           placeholder={estabelecimentos == null ? '' : estabelecimentos[estabelecimentoSelecionado].label}
                           options={estabelecimentos}
                           onChange={(value) => {
                              if (value != estabelecimentoSelecionado) {
                                 setEstabelecimentoSelecionado(value);
                                 localStorage.setItem('EstabelecimentoRm', estabelecimentos[value].id);
                                 window.location.reload();
                              }
                           }}
                        />
                     </Row> </> : null}
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
               <Outlet />
            </Content>
         </Layout>
      </Layout>
   )
}

export default Home;