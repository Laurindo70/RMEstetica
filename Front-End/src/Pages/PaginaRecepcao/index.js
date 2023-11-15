import React from 'react';
import { Layout, Menu, Flex, Typography, Row, Button, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import imagemInicio from '../../Images/img-inicio-central.svg';
import './style.css';

const { Header, Content } = Layout;
const items = [
   {
      label: '1st menu item',
      key: '1',
   },
   {
      label: '2nd menu item',
      key: '2',
   },
   {
      label: '3rd menu item',
      key: '3',
   },
];

function PaginaRecepcao() {
   const navigate = useNavigate();

   function mudarPagina(value) {
      navigate(`${value.key}`);
   }

   return (
      <Layout className="layout">
         <Header
            style={{
               background: '#FE9CCC',
               display: 'flex',
               alignItems: 'center',
               maxWidth: '100vw'
            }}
         >
            <div className="demo-logo" />
            <Menu
               style={{ background: '#FE9CCC', color: '#fff', fontWeight: 'bold' }}
               mode="horizontal"
               onClick={mudarPagina}
               items={[
                  {
                     key: '/login',
                     label: 'Login',
                  },
                  {
                     key: '/register-user',
                     label: 'Cadastrar-se como usuário',
                  },
                  {
                     key: '/register-estabelecimento',
                     label: 'Cadastrar-se como estabelecimento',
                  },
                  {
                     key: '/agendamento',
                     label: 'Agendamentos',
                  }
               ]}
            />
         </Header>
         <Content
            style={{
               padding: '0 50px',
            }}
         >

            <Flex className='container-pagina-inicio'>
               <div className='itens-inicio-1'>
                  <Row>
                     <Typography.Title level={2} style={{ color: '#FE9CCC', fontStyle: 'italic' }}>
                        <span style={{ color: '#A9335D' }} >RME</span>stetica
                     </Typography.Title></Row>
                  <Row>
                     <Typography.Title level={3} style={{ color: '#FE9CCC', fontStyle: 'italic' }}>
                        Seja Bem-Vindo!
                     </Typography.Title>
                  </Row>
                  <Row>
                     <Typography.Title level={4} style={{ color: '#A9335D', fontStyle: 'italic' }}>
                        Esse é o seu site de controle de estabelecimento
                     </Typography.Title>
                     <Typography.Title level={4} style={{ color: '#A9335D', fontStyle: 'italic' }}>
                        e agendamento de procedimentos estéticos.
                     </Typography.Title>
                  </Row>
                  <Row>
                     <button className='botao-cadastro-inicio' onClick={() => { navigate("/register-user"); }} >Cadastrar-se como usuário</button>
                     <button className='botao-cadastro-inicio' onClick={() => { navigate("/register-estabelecimento"); }}>Cadastrar-se como Estabelecimento</button>
                     <button className='botao-cadastro-inicio' onClick={() => { navigate("/login"); }}>Realizar Login</button>
                  </Row>
                  <Row>
                     <button className='botao-cadastro-inicio' onClick={() => { navigate("/register-user"); }} >Realizar Agendamento </button>
                  </Row>
               </div>
               <div className='itens-inicio-2'>
                  <img style={{ cursor:'pointer' }} onClick={() => { window.open("https://storyset.com/work"); }} src={imagemInicio}></img>
               </div>
            </Flex>

         </Content>
      </Layout>
   );
};

export default PaginaRecepcao;