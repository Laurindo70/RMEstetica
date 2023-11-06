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
   AuditOutlined,
   CalendarOutlined,
   UsergroupAddOutlined
} from '@ant-design/icons';
import { BsFillClipboard2PlusFill } from "react-icons/bs";
import { Layout, Menu, Button, Dropdown, Modal, Select, Row } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../../Utils/api';

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

function Home() {
   const token = localStorage.getItem('TokenRm');
   let location = useLocation();
   const nomeUsuario = localStorage.getItem('NomeRm');
   const navigate = useNavigate();

   const [collapsed, setCollapsed] = useState(false);
   const [estabelecimentos, setEstabelecimentos] = useState(null);
   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
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
               {nomeUsuario}
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
      setCollapsed(true)
      navigate(`${value.key}`);
   }

   useEffect(() => {
      const permissao = localStorage.getItem('TipoRm');
      if (permissao === '1') {
         setItens([
            {
               key: '',
               icon: <HomeOutlined />,
               label: 'Home',
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
               key: 'despesas',
               icon: <DollarOutlined />,
               label: 'Despesas'
            },
            {
               key: 'estoque',
               icon: <ShoppingCartOutlined />,
               label: 'Estoque'
            },
            {
               key: 'agendamento',
               icon: <CalendarOutlined />,
               label: 'Agendamentos'
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
            }
         ]);
      } else {
         setItens([
            {
               key: '',
               icon: <HomeOutlined />,
               label: 'Home',
            },
            {
               key: 'usuarios',
               icon: <UserOutlined />,
               label: 'Usuário',
            },
            {
               key: 'agendamento',
               icon: <CalendarOutlined />,
               label: 'Agendamentos'
            }
         ]);
      }
      console.log(location)
      console.log();
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
            console.log(data);
            let est = localStorage.getItem('EstabelecimentonRm');
            if (est) {
               console.log(est);
               for (let i = 0; i < Response.data.length; i++) {
                  if(Response.data[i].id == est){
                     setEstabelecimentoSelecionado(i);
                  }
               }
            } else {
               setEstabelecimentoSelecionado(+data[0].value);
               localStorage.setItem('EstabelecimentonRm', data[0].value);
            }
            setEstabelecimentos(data);
         }
      );
   }, []);

   return (
      <Layout className="main-home">
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
                                 localStorage.setItem('EstabelecimentonRm', estabelecimentos[value].id);
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