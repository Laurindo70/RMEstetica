import React, { useEffect, useState } from 'react';
import { Col, Empty, Row, Typography, Table, Button, DatePicker, Collapse, notification, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../Utils/api';
const { RangePicker } = DatePicker;
const { Text } = Typography;

function ListMov(props) {
   const token = localStorage.getItem('TokenRm');
   const [apiNot, contextHolderNot] = notification.useNotification();

   const [dataInicio, setDataInicio] = useState(null);
   const [dataFim, setDataFim] = useState(null);
   const [movimentacoes, setMovimentacoes] = useState([]);


   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_produto',
         key: 'nome_produto',
      },
      {
         title: 'Quantidade',
         dataIndex: 'quantidade',
         key: 'quantidade',
      },
   ];

   async function carregarMov(e) {

      e.preventDefault();

      try {
         await api.get(`/movimentacao/estabelecimento-id=${props.estabelecimento_id}/data-inicio=${dataInicio}/data-fim=${dataFim}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (response) => {
               console.log(response);
               let dados = [];
               for (let i = 0; i < response.data.length; i++) {
                  dados.push(
                     {
                        key: response.data[i].key,
                        label: `${response.data[i].data} por ${response.data[i].usuario}`,
                        children: <Table dataSource={response.data[i].produtos} columns={colunas} pagination={false} />,
                     },
                  );
               }

               setMovimentacoes(dados);
            }
         );
      } catch (error) {
         apiNot.error({
            message: `Error.`,
            description: error.response.data.mensagem[0].message,
            placement: 'top',
         });
      }
   }

   const onChange = (value, dateString) => {
      setDataInicio(dateString[0]);
      setDataFim(dateString[1]);
   };

   useEffect(() => {
      if (dataInicio !== null && dataFim !== null) {
         carregarMov();
      }
   }, [])

   return (
      <>
         {contextHolderNot}
         <Row justify="center" className='opcoes-usuarios header-movs'>
            <Col span={5}>
               <Text style={{ color: "#fff", fontWeight: 'bold' }} >Selecione os dias das movimentações:</Text>
            </Col>
            <Col span={8}>
               <RangePicker onChange={onChange} />
            </Col>
            <Col span={5}>
               <Button icon={<SearchOutlined />} className='botao' onClick={carregarMov}>Carregar Movimentações</Button>
            </Col>
         </Row>
         {
            movimentacoes.length > 0 ?
               <Collapse items={movimentacoes} /> :
               <Empty />
         }
      </>

   )
}

export default ListMov;