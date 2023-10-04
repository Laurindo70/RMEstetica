import React from "react";
import { Col, Input, Row, Dropdown, Table, Button, DatePicker, Collapse, notification, Collapse  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Procedimentos() {

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_procedimento',
         key: 'nome_procedimento'
      },
      {
         title: 'Tempo',
         dataIndex: 'tempo',
         key: 'tempo'
      },
      {
         title: 'Profissionais',
         dataIndex: 'profissionais',
         key: 'profissionais',
         render: (prof) => <Dropdown
            menu={{
               items,
            }}
            placement="bottomLeft"
         >
            <Button>mostrar</Button>
         </Dropdown>
      },
      {
         title: 'Situação',
         dataIndex: 'situacao',
         key: 'situacao',
         render: (sit) => sit[1] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : <Button type="primary" onClick={() => { inativar(sit[1]) }}>Ativar</Button>
      },
      {
         title: 'Estabelecimentos',
         dataIndex: 'estabelecimentos',
         key: 'estabelecimentos',
         render: (est) => est[0].nome
      }
   ]

   const items = [
      {
         key: '1',
         label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
               1st menu item
            </a>
         ),
      },
      {
         key: '2',
         label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
               2nd menu item
            </a>
         ),
      },
      {
         key: '3',
         label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
               3rd menu item
            </a>
         ),
      },
   ];

   async function inativar(id) {
      console.log(id);
   }

   const dados = [
      {
         key: 1,
         nome_procedimento: 'Procedimento 01',
         tempo: '00:30',
         profissionais: [{ key: 1, label: 'Teste 01' }, { id: 1, nome: 'Teste 02' }],
         situacao: [1, false],
         estabelecimentos: [{ id: 1, nome: 'Estabelecimento 01' }]
      }
   ]

   return (
      <>
         <Row justify="end" className='opcoes-usuarios header-movs'>
            <Col span={3}>
               <Button icon={<SearchOutlined />} className='botao'>Novo Procedimento</Button>
            </Col>
            <Col span={2}>
               <Button icon={<SearchOutlined />} className='botao'>Filtrar</Button>
            </Col>
            <Col span={5}>
               <Input className='input-filtro' placeholder="Digite o nome do procedimento" />
            </Col>
         </Row>
         <Table dataSource={dados} columns={colunas} pagination={false} />
      </>
   );
}

export default Procedimentos