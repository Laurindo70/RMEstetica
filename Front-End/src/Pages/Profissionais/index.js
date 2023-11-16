import React, { useState, useEffect } from 'react';
import { Col, Row, Table, Button, Typography, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import api from '../../Utils/api';
import RegisterProfissional from './components/Register';

const { Title } = Typography;

function Profissionais() {
   const token = localStorage.getItem('TokenRm');

   const [isModalCadastro, setIsModalCadastro] = useState(false);

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

   const [profissionais, setProfissionais] = useState([]);

   const handleModalCad = () => {
      setIsModalCadastro(!isModalCadastro);
   }

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_profissional',
         key: 'nome_profissional'
      },
      {
         title: 'Horario Incio',
         dataIndex: 'horario_inicial_atendimento',
         key: 'horario_inicial_atendimento'
      },
      {
         title: 'Horario Fim',
         dataIndex: 'horario_final_atendimento',
         key: 'horario_final_atendimento'
      }
   ];

   useEffect(() => {
      const estab = localStorage.getItem('EstabelecimentoRm');
      setEstabelecimentoSelecionado(localStorage.getItem('EstabelecimentoRm'))
      api.get(`/profissional/${estab}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            setProfissionais(Response.data);
         }
      )

   }, [isModalCadastro])

   return (
      <>
         <Modal title={<Title level={3}>Cadastro de Profissional</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterProfissional estabelecimento_id={estabelecimentoSelecionado} fecharModal={handleModalCad} />
         </Modal>

         <Row justify="end" className='opcoes-usuarios header-movs'>
            <Col span={3}>
               <Button icon={<PlusCircleOutlined />} onClick={handleModalCad} className='botao'>Novo Profissional</Button>
            </Col>
         </Row>
         <Table dataSource={profissionais} columns={colunas} pagination={false} />
      </>
   );
}

export default Profissionais