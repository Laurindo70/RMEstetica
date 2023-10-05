import React, { useState, useEffect } from 'react';
import { Col, Input, Row, Table, Button, DatePicker, Select, Typography, List, Modal } from 'antd';
import { SearchOutlined, SyncOutlined, PlusCircleOutlined } from '@ant-design/icons';
import api from '../../Utils/api';
import RegisterProfissional from './components/Register';

const { Title } = Typography;

function Profissionais() {
   const token = localStorage.getItem('TokenRm');

   const [isModalSelecEstab, setIsModalSelecEstab] = useState(true);
   const [isModalCadastro, setIsModalCadastro] = useState(false);

   const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
   const [estabelecimentos, setEstabelecimentos] = useState();

   const [profissionais, setProfissionais] = useState([]);

   const handleModalEstab = () => {
      setIsModalSelecEstab(!isModalSelecEstab);
   }

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

   useEffect(() => {

      if (estabelecimentoSelecionado !== null) {
         api.get(`/profissional/${estabelecimentoSelecionado}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               setProfissionais(Response.data);
            }
         )
      }

   }, [isModalCadastro, isModalSelecEstab])

   return (
      <>
         <Modal title={<Title level={3}>Selecione o Estabelecimento</Title>} open={isModalSelecEstab} onOk={handleModalEstab} onCancel={handleModalEstab}>
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

         <Modal title={<Title level={3}>Cadastro de estabelecimento</Title>} open={isModalCadastro} onCancel={handleModalCad} footer={[]}>
            <RegisterProfissional estabelecimento_id={estabelecimentoSelecionado} fecharModal={handleModalCad} />
         </Modal>

         <Row justify="end" className='opcoes-usuarios header-movs'>
            <Col span={20}>
               <Button icon={<SyncOutlined />} onClick={handleModalEstab} className='botao'>Trocar Estabelecimento</Button>
            </Col>
            <Col span={3}>
               <Button icon={<PlusCircleOutlined />} onClick={handleModalCad} className='botao'>Novo Profissional</Button>
            </Col>
         </Row>
         <Table dataSource={profissionais} columns={colunas} pagination={false} />
      </>
   );
}

export default Profissionais