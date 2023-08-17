import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select } from 'antd';
import './syle.css';
import { cpfMask } from '../../Utils/mascaras';
import api from '../../Utils/api';

const { Title } = Typography;
const options = [];
for (let i = 10; i < 36; i++) {
   options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
   });
}


function Usuarios() {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [confSenha, setConfSenha] = useState('');
   const [cpf, setCpf] = useState(null);

   const [filtro, setFiltro] = useState('');

   const [usuarios, setUsuarios] = useState();

   const showModal = () => {
      setIsModalOpen(true);
   };
   const handleOk = () => {
      setIsModalOpen(false);
   };
   const handleCancel = () => {
      setIsModalOpen(false);
   };
   const handleChange = (value) => {
      console.log(`selected ${value}`);
   };
   const dataSource = [
      {
         key: '1',
         nome: 'Mike',
         permissao: "Administrador",
         email: 'teste@gmail.com',
         ativo: true
      },
      {
         key: '2',
         nome: 'John',
         permissao: "Estoque",
         email: 'teste@gmail.com',
         ativo: false
      },
   ];

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_usuario',
         key: 'nome_usuario',
      },
      {
         title: 'Permissão',
         dataIndex: 'permissao',
         key: 'permissao',
      },
      {
         title: 'Email',
         dataIndex: 'email_usuario',
         key: 'email_usuario',
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => sit ? <Button type="primary" danger>Desativar</Button> : <Button type="primary">Ativar</Button>
      }
   ];

   useEffect(() => {
      api.get(`/usuario/${filtro}`).then(
         (Response) => {
            console.log(Response.data);
            setUsuarios(Response.data);
         }
      );
   }, [filtro]);

   return (
      <div className='container-usuarios'>
         <Modal title={<Title level={3}>Cadastro de Usuários</Title>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
            <form>
               <Row justify="start">
                  <label className='label-cadastro'>Nome Usuário</label>
                  <Input className='input-cadastro' onChange={e => setNome(e.target.value)} value={nome} type="text" required />
               </Row>

               <Row justify="start">
                  <label className='label-cadastro'>Email</label>
                  <Input className='input-cadastro' onChange={e => setEmail(e.target.value)} value={email} type="email" required />
               </Row>

               <Row justify="start">
                  <label className='label-cadastro'>Senha</label>
                  <Input className='input-cadastro' onChange={e => setSenha(e.target.value)} value={senha} type="password" required />
               </Row>

               <Row justify="start">
                  <label className='label-cadastro'>Confirmar Senha</label>
                  <Input className='input-cadastro' onChange={e => setConfSenha(e.target.value)} value={confSenha} type="password" required />
               </Row>

               <Row justify="start">
                  <label className='label-cadastro'>CPF(Opcional)</label>
                  <Input className='input-cadastro' onChange={e => setCpf(cpfMask(e.target.value))} value={cpf} type="text" />
               </Row>

               <Row justify="start">
                  <label className='label-cadastro'>Estabelecimentos</label>
                  <Select
                     mode="multiple"
                     allowClear
                     style={{
                        width: '100%',
                        border: 'solid 1px #A9335D',
                        borderRadius: '5px',
                     }}
                     placeholder="Selecione os estabelecimentos"
                     defaultValue={[]}
                     onChange={handleChange}
                     options={options}
                     required
                  />
               </Row>

               <Row justify="end" className='botao-salvar'>
                  <button className='botao-salvar' >Salvar</button>
               </Row>
            </form>
         </Modal>

         <Title level={3}>Usuários</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}><Button icon={<PlusCircleOutlined />} className='botao' onClick={showModal}>Novo Usuário</Button></Col>
            <Col span={3}><Button icon={<SearchOutlined />} className='botao'>Filtrar</Button></Col>
            <Col span={8}><Input onChange={e => setFiltro(e.target.value)} value={filtro} className='input-filtro' placeholder="Digite o nome do Usuário" /></Col>
         </Row>
         <Divider />
         <Table dataSource={usuarios} columns={colunas} pagination={false} />
      </div>
   );
};

export default Usuarios;