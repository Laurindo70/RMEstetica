import React, { useEffect, useState } from 'react';
import './style.css';
import {
   HomeOutlined,
   MenuUnfoldOutlined,
   MenuFoldOutlined,
   ExclamationCircleFilled,
   UserOutlined,
   BankOutlined,
   DollarOutlined,
   ShoppingCartOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Modal } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

function Home() {
   let location = useLocation();
   const nomeUsuario = localStorage.getItem('NomeRm');
   const navigate = useNavigate();

   const [collapsed, setCollapsed] = useState(false);
   const [ itens, setItens ] = useState([]);

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

   function mudarPagina(value){
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
         }
      ]);
      console.log(location)
      console.log();
   }, [location])

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