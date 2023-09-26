import React, { useState, useEffect } from 'react';
import './style.css';
import { PlusCircleOutlined, SyncOutlined, PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';
import api from '../../Utils/api';
import { moneyMask } from '../../Utils/mascaras';
const { Title } = Typography;


function Estoque() {
   const token = localStorage.getItem('TokenRm');

   const [isModalSelecEstab, setIsModalSelecEstab] = useState(true);
   const [isModalCadastro, setIsModalCadastro] = useState(false);
   const [isModalMovimentacao, setIsModalMovimentacao] = useState(false);

   const [messageApi, contextHolder] = message.useMessage();
   const [produtos, setProdutos] = useState([]);
   const [produtosMov, setProdutosMov] = useState([]);
   const [produtosSelecMov, setProdutosSelecMov] = useState([]);
   const [estabelecimentos, setEstabelecimentos] = useState();
   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

   const [nomeProduto, setNomeProduto] = useState(null);
   const [valorProduto, setValorProduto] = useState(null);

   const [tipoMovimentacao, setTipoMovimentacao] = useState(null);
   const [produtoSelecMovimentacao, setProdutoSelecMovimentacao] = useState(null);
   const [quantidadeMov, setQuantidadeMov] = useState(null);

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_produto',
         key: 'nome_produto',
      },
      {
         title: 'Valor',
         dataIndex: 'valor_produto',
         key: 'valor_produto',
         render: (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      },
      {
         title: 'Quantidade',
         dataIndex: 'quantidade',
         key: 'quantidade',
      },
      {
         title: 'Situação',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : <Button type="primary" style={{ cursor: 'default' }}>Inativado</Button>
      }
   ];

   const handleModal = () => {
      setIsModalSelecEstab(!isModalSelecEstab);
   }

   const handleModalCadastro = () => {
      setIsModalCadastro(!isModalCadastro);
   }

   const handleModalMovimentacao = () => {
      setIsModalMovimentacao(!isModalMovimentacao);
   }

   async function inativar(id) {
      try {
         await api.delete(`/produto/${id}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               messageApi.open({
                  type: 'success',
                  content: 'Inativado com sucesso.',
               });
            }
         )
      } catch (error) {
         console.log(error.response.data.mensagem);
      }
   }

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         "estabelecimento_id": estabelecimentoSelecionado,
         "nome_produto": nomeProduto,
         "valor_produto": valorProduto
      }

      try {

         await api.post('/produto', dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               handleModalCadastro();
               messageApi.open({
                  type: 'success',
                  content: 'Cadastrado com sucesso.',
               });
            }
         )

      } catch (error) {
         console.log(error.data);
         alert('Erro no cadastro')
      }

   }

   function adicionarProduto(e) {
      e.preventDefault();
      try {
         let dadosProd = produtosSelecMov;
         dadosProd.push({
            nome_produto: produtos[produtoSelecMovimentacao].nome_produto,
            produto_id: produtos[produtoSelecMovimentacao].id,
            quantidade: quantidadeMov,
            remove: produtos[produtoSelecMovimentacao].id
         });
         console.log(dadosProd);
         setProdutosSelecMov(dadosProd);
         setQuantidadeMov(0);

      } catch (error) {
         messageApi.open({
            type: 'error',
            content: 'Erro ao adicionar produto.',
         });
      }
   }

   function removerProduto(id) {
      setProdutosSelecMov(produtosSelecMov.filter((produtoMov) => produtoMov.produto_id !== id));
   }

   async function salvar

   useEffect(() => {
      if (estabelecimentoSelecionado !== null) {
         api.get(`/produto/${estabelecimentoSelecionado}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               let dadosProdutos = [];
               let dadosMov = [];

               for (let i = 0; i < Response.data.length; i++) {
                  dadosProdutos.push({
                     id: Response.data[i].id,
                     nome_produto: Response.data[i].nome_produto,
                     quantidade: Response.data[i].quantidade,
                     valor_produto: Response.data[i].valor_produto,
                     ativo: [Response.data[i].ativo, Response.data[i].id]
                  });
                  dadosMov.push({
                     id: Response.data[i].id,
                     label: Response.data[i].nome_produto,
                     value: i
                  })
               }

               setProdutos(dadosProdutos);
               setProdutosMov(dadosMov);
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
      <div className='container-estabelecimento'>
         {contextHolder}
         <Modal title={<Title level={3}>Selecione o Estabelecimento</Title>} open={isModalSelecEstab} onOk={handleModal} onCancel={handleModal}>
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

         <Modal title={<Title level={3}>Cadastro de novo Produto</Title>} open={isModalCadastro} onOk={handleModalCadastro} onCancel={handleModalCadastro} footer={[]}>
            <form onSubmit={salvar}>
               <Row justify="start">
                  <label className='label-cadastro'>Nome Produto</label>
                  <Input className='input-cadastro' onChange={e => setNomeProduto(e.target.value)} value={nomeProduto} type="text" required />
               </Row>
               <Row justify="start">
                  <label className='label-cadastro'>Valor Produto</label>
                  <Input className='input-cadastro' onChange={e => setValorProduto(moneyMask(e.target.value))} value={valorProduto} type="text" required />
               </Row>
               <Row justify="end" className='botao-salvar'>
                  <button className='botao-salvar' >Salvar</button>
               </Row>
            </form>
         </Modal>

         <Modal title={<Title level={3}>Realizar movimentação</Title>} open={isModalMovimentacao} onOk={handleModalMovimentacao} onCancel={handleModalMovimentacao} footer={[]}>
            <form>
               <Row justify="start">
                  <label className='label-cadastro'>Selecione o tipo da movimentação</label>
                  <Select
                     style={{
                        width: '100%',
                        border: 'solid 1px #A9335D',
                        borderRadius: '5px',
                     }}
                     onChange={(value) => { setTipoMovimentacao(value) }}
                     options={[{ label: "Entrada", value: true }, { label: "Saida", value: false }]}
                  />
               </Row>
               <Divider />
               <Row justify="start">
                  <label className='label-cadastro'>Selecione o produto</label>
                  <Select
                     style={{
                        width: '100%',
                        border: 'solid 1px #A9335D',
                        borderRadius: '5px',
                     }}
                     onChange={(value) => { setProdutoSelecMovimentacao(value) }}
                     options={produtosMov}
                  />
               </Row>
               <Row justify="start">
                  <label className='label-cadastro'>Quantidade</label>
                  <Input className='input-cadastro' onChange={e => setQuantidadeMov(e.target.value)} value={quantidadeMov} type="number" required />
               </Row>
               <Row justify="center" className='botao-salvar'>
                  <button className='botao-salvar' onClick={adicionarProduto} >Adicionar</button>
               </Row>
               <Divider />

               <table className='tabela-produtos-mov'>
                  <tr>
                     <th>Nome</th>
                     <th>Quantidade</th>
                     <th>Remover</th>
                  </tr>
                  
                  {produtosSelecMov.map((produtoMovSel) => (
                   <tr>
                     <td>{produtoMovSel.nome_produto}</td>
                     <td>{produtoMovSel.quantidade}</td>
                     <td><Button type="primary" onClick={() => { removerProduto(produtoMovSel.produto_id) }} danger><DeleteOutlined /></Button></td>
                  </tr>
                  ))}
               </table>
               <Divider />
               <Row justify="end" className='botao-salvar'>
                  <button className='botao-salvar' >Salvar</button>
               </Row>

            </form>
         </Modal>

         <Title level={3}>Estoque</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}>
               <Button icon={<SyncOutlined />} className='botao' onClick={handleModal}>Trocar Estabelecimento</Button>
            </Col>
            <Col span={4}>
               <Button icon={<PlusCircleOutlined />} className='botao' onClick={handleModalCadastro}>Novo Produto</Button>
            </Col>
            <Col span={5}>
               <Button icon={<PlusOutlined />} className='botao' onClick={handleModalMovimentacao}>Realizar Movimentação</Button>
            </Col>
            <Col span={4}>
               <Button icon={<MinusOutlined />} className='botao' onClick={handleModalCadastro}>Saida Produto</Button>
            </Col>
         </Row>
         <Divider />
         <Table dataSource={produtos} columns={colunas} pagination={false} />
      </div>
   );

}
export default Estoque;