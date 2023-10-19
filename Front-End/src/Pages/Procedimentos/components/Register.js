import React, { useState } from 'react';
import api from '../../../Utils/api';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';
import { PlusCircleOutlined, SyncOutlined, PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { moneyMask } from '../../../Utils/mascaras';

export default function RegisterProcedimento({ estabelecimento_id, produtos, fecharModal, listaProfissionais }) {
   const [messageApi, contextHolder] = message.useMessage();
   const token = localStorage.getItem('TokenRm');

   const [nomeProcedimento, setNomeProcedimento] = useState(null);
   const [duracaoProcedimento, setDuracaoProcedimento] = useState(null);
   const [valorProcedimento, setValorProcedimento] = useState(null);
   const [profissionais, setProfissionais] = useState([]);
   const [produtosCadastro, setProdutosCadastro] = useState([]);

   const [quantidade, setQuantidade] = useState(0);
   const [produtoSelec, setProdutoSelec] = useState(null);

   async function salvar(e) {

      e.preventDefault();

      const dados = {
         "nome_procedimento": nomeProcedimento,
         "duracao_procedimento": duracaoProcedimento,
         "estabelecimento_id": estabelecimento_id,
         "profissionais": [],
         "produtos": produtosCadastro,
         "valor_procedimento": valorProcedimento,
         "profissionais": profissionais
      }

      try {

         await api.post('/procedimento', dados, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               fecharModal();
               messageApi.open({
                  type: 'success',
                  content: 'Cadastrado com sucesso.',
               });
            }
         )

      } catch (error) {
         console.log(error.data);
         messageApi.open({
            type: 'error',
            content: 'Erro ao realizar cadastro.',
         });
      }

   }

   function adicionarProduto(e) {
      e.preventDefault();
      try {
         console.log(produtos[produtoSelec]);
         let dadosProd = produtosCadastro;
         dadosProd.push({
            nome_produto: produtos[produtoSelec].label,
            produto_id: produtos[produtoSelec].id,
            quantidade: quantidade,
            remove: produtos[produtoSelec].id
         });
         setProdutosCadastro(dadosProd);
         setQuantidade(0);

      } catch (error) {
         messageApi.open({
            type: 'error',
            content: 'Erro ao adicionar produto.',
         });
      }
   }

   function removerProduto(id) {
      setProdutosCadastro(produtosCadastro.filter((produtoMov) => produtoMov.produto_id !== id));
   }

   return (
      <>
         {contextHolder}
         <form onSubmit={salvar}>
            <Row justify="start">
               <label className='label-cadastro'>Nome Procedimento</label>
               <Input className='input-cadastro' onChange={e => setNomeProcedimento(e.target.value)} value={nomeProcedimento} type="text" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Valor Procedimento</label>
               <Input className='input-cadastro' onChange={e => setValorProcedimento(moneyMask(e.target.value))} value={valorProcedimento} type="text" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Tempo de duração do Procedimento</label>
            </Row>
            <Row justify="start">
               <input onChange={e => setDuracaoProcedimento(e.target.value)} value={duracaoProcedimento} className='input-time' type="time" required />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Selecione os profissionais</label>
               <Select
                  mode="multiple"
                  allowClear
                  style={{
                     width: '100%',
                     border: 'solid 1px #A9335D',
                     borderRadius: '5px',
                  }}
                  placeholder="Please select"
                  onChange={e => setProfissionais(e)}
                  options={listaProfissionais}
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
                  onChange={(value) => { setProdutoSelec(value) }}
                  options={produtos}
               />
            </Row>
            <Row justify="start">
               <label className='label-cadastro'>Quantidade</label>
               <Input className='input-cadastro' onChange={e => setQuantidade(e.target.value)} value={quantidade} type="number" required />
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

               {produtosCadastro.map((produtoMovSel) => (
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
      </>
   );
}