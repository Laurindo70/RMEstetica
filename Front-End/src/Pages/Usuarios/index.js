import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message, notification } from 'antd';
import './syle.css';
import { cpfMask } from '../../Utils/mascaras';
import api from '../../Utils/api';

const { Title } = Typography;


function Usuarios() {
   const token = localStorage.getItem('TokenRm');
   const tipoUser = localStorage.getItem('TipoRm');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [messageApi, contextHolder] = message.useMessage();
   const [apiNot, contextHolderNot] = notification.useNotification();

   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [confSenha, setConfSenha] = useState('');
   const [cpf, setCpf] = useState(null);
   const [estabelecimentosId, setEstabelecimentosId] = useState([]);

   const [estabelecimentos, setEstabelecimentos] = useState();
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
      setEstabelecimentosId(value);
   };

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
         render: (sit) => sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : <Button type="primary" onClick={() => { inativar(sit[1]) }}>Ativar</Button>
      }
   ];

   async function salvar(e) {
      e.preventDefault();

      if (senha !== confSenha) {
         return messageApi.open({
            type: 'error',
            content: 'As senhas não são iguais.',
         });
      }

      const dados = {
         nome_usuario: nome,
         nivel_permissao_id: 1,
         senha: senha,
         email_usuario: email,
         estabelecimento_id: (estabelecimentosId.length > 1 ? estabelecimentosId : estabelecimentosId[0][0]),
         cpf: cpf
      }

      try {

         await api.post('/usuario', dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               setIsModalOpen(false);
               setConfSenha(null);
               setCpf('');
               setNome(null);
               setSenha('');
               setEmail(null);
               setEstabelecimentosId([]);
               messageApi.open({
                  type: 'success',
                  content: 'Cadastrado com sucesso.',
               });
            }
         )

      } catch (error) {
         apiNot.error({
            message: `Não foi possível realizar o cadastro.`,
            description: error.response.data.mensagem[0].message,
            placement: 'top',
         });
      }
   }

   async function inativar(id) {
      try {
         await api.delete(`/usuario/${id}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               carregarDados();
               messageApi.open({
                  type: 'success',
                  content: 'Inativado com sucesso.',
               });
            }
         )
      } catch (error) {
         messageApi.open({
            type: 'error',
            content: error.response.data.mensagem,
         });
      }

   }

   async function carregarDados() {
      await api.get(`/usuario/${filtro}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            console.log(Response.data);
            let usuarioss = [];

            for (let i = 0; i < Response.data.length; i++) {
               usuarioss.push({
                  nome_usuario: Response.data[i].nome_usuario,
                  permissao: Response.data[i].permissao,
                  email_usuario: Response.data[i].email_usuario,
                  ativo: [Response.data[i].ativo, Response.data[i].id]
               });
            }

            setUsuarios(usuarioss);
         }
      );
   }

   useEffect(() => {
      carregarDados();
   }, [filtro, isModalOpen]);

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
      <div className='container-usuarios'>
         {contextHolder}
         {contextHolderNot}
         <Modal title={<Title level={3}>Cadastro de Usuários</Title>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
            <form onSubmit={salvar}>
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
                     options={estabelecimentos}
                     value={estabelecimentosId}
                     required
                  />
               </Row>

               {senha === confSenha ? <p className={senha.length < 4 ? 'senha-erro' : 'senha-ok'} >A senha deve conter pelo menos 4 dígitos</p> : ''}
               <p className={senha !== confSenha ? 'senha-erro' : 'senha-ok'} >{senha !== confSenha ? 'As senhas não batem' : 'As senhas são iguais'}</p>

               <Row justify="end" className='botao-salvar'>
                  <button className='botao-salvar' >Salvar</button>
               </Row>
            </form>
         </Modal>

         <Title level={3}>Usuários</Title>
         <Divider />
         {tipoUser === '1' ?
            <Row justify="end" className='opcoes-usuarios'>
               <Col span={5}><Button icon={<PlusCircleOutlined />} className='botao' onClick={showModal}>Novo Usuário</Button></Col>
               <Col span={8}><Input onChange={e => setFiltro(e.target.value)} value={filtro} className='input-filtro' placeholder="Digite o nome do Usuário" /></Col>
            </Row>
            : null
         }
         <Divider />
         <Table dataSource={usuarios} columns={colunas} pagination={false} />
      </div>
   );
};

export default Usuarios;