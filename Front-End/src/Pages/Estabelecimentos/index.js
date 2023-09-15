import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Switch, message } from 'antd';
import './style.css';
import api from '../../Utils/api';
import { cepMask } from '../../Utils/mascaras';

const { Title } = Typography;
const { TextArea } = Input;

function Estabelecimentos() {
   const token = localStorage.getItem('TokenRm');
   const [messageApi, contextHolder] = message.useMessage();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [tab, setTab] = useState(0);

   const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
   const [enderecoBairro, setEnderecoBairro] = useState('');
   const [enderecoNumero, setEnderecoNumero] = useState(0);
   const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
   const [enderecoNomeLogradouro, setEnderecoNomeLogradouro] = useState('');
   const [enderecoCidade, setEnderecoCidade] = useState('');
   const [enderecoEstado, setEnderecoEstado] = useState('');
   const [enderecoCep, setEnderecoCep] = useState('');
   const [visivelAgendamento, setVisivelAgendamento] = useState(true);
   const [horarioAbertura, setHorarioAbertura] = useState('');
   const [horarioFechamento, setHorarioFechamento] = useState('');
   const [fechamentoAlmoco, setFechamentoAlmoco] = useState(true);
   const [enderecoComplemento, setEnderecoComplemento] = useState('');
   const [horarioFechamentoAlmoco, setHorarioFechamentoAlmoco] = useState('');
   const [horarioVoltaAlmoco, setHorarioVoltaAlmoco] = useState('');
   const [estabelecimentoId, setEstabelecimentoId] = useState(null);

   const [filtro, setFiltro] = useState('');

   const [estabelecimentos, setEstabelecimentos] = useState();

   const alteracaoTab = (e) => { e.preventDefault(); setTab(tab === 0 ? 1 : 0) };

   const showModal = () => {
      setIsModalOpen(true);
   };
   const handleOk = () => {
      setIsModalOpen(false);
   };
   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const onChangeDispAgendamento = (checked) => {
      setVisivelAgendamento(checked);
   };

   const onChangeFecAlmoco = (checked) => {
      setFechamentoAlmoco(checked);
   };

   const colunas = [
      {
         title: 'Nome',
         dataIndex: 'nome_estabelecimento',
         key: 'nome_estabelecimento',
      },
      {
         title: 'Situação',
         dataIndex: 'situacao',
         key: 'situacao',
         render: (sit) => sit ? 'Ativo' : 'Desativado'
      },
      {
         title: 'Inativar/Ativar',
         dataIndex: 'ativo',
         key: 'ativo',
         render: (sit) => sit[0] ? <Button type="primary" onClick={() => { inativar(sit[1]) }} danger>Desativar</Button> : "Desativado"
      },
      {
         title: 'Editar',
         dataIndex: 'editar',
         key: 'editar',
         render: (edit) => edit[0] ? <Button type="primary" onClick={() => { editar(edit[1]) }} danger>Editar</Button> : "Desativado"
      }
   ];

   async function salvar(e) {
      e.preventDefault();

      const dados = {
         nome_estabelecimento: nomeEstabelecimento,
         endereco_bairro: enderecoBairro,
         endereco_numero: enderecoNumero,
         endereco_logradouro: enderecoLogradouro,
         endereco_nome_logradouro: enderecoNomeLogradouro,
         endereco_cidade: enderecoCidade,
         endereco_estado: enderecoEstado,
         endereco_cep: enderecoCep,
         visivel_agendamento: visivelAgendamento,
         horario_abertura: horarioAbertura,
         horario_fechamento: horarioFechamento,
         fechamento_almoco: fechamentoAlmoco,
         endereco_complemento: enderecoComplemento,
         horario_fechamento_almoco: horarioFechamentoAlmoco,
         horario_volta_almoco: horarioVoltaAlmoco
      };

      if (estabelecimentoId == null) {

         try {
            await api.post('/estabelecimento', {
               headers: {
                  Authorization: token
               }
            }, dados).then(
               (Response) => {
                  setIsModalOpen(false);
                  messageApi.open({
                     type: 'success',
                     content: 'Cadastrado com sucesso.',
                  });
               }
            )
         } catch (error) {
            console.log(error.response.data.mensagem);
         }
      } else {
         try {
            await api.put(`/estabelecimento/${estabelecimentoId}`, {
               headers: {
                  Authorization: token
               }
            }, dados).then(
               (Response) => {
                  setIsModalOpen(false);
                  messageApi.open({
                     type: 'success',
                     content: 'Cadastrado com sucesso.',
                  });
               }
            )
         } catch (error) {
            console.log(error.response.data.mensagem);
         }
      }
   }

   async function inativar(id) {
      try {
         await api.delete(`/estabelecimento/${id}`, {
            headers: {
               Authorization: token
            }
         }).then(
            (Response) => {
               setIsModalOpen(false);
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

   async function editar(id) {
      setEstabelecimentoId(id);
      setIsModalOpen(true);
      console.log(id);
      await api.get(`/estabelecimento/${id}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (response) => {
            setNomeEstabelecimento(response.data[0].nome_estabelecimento);
            setEnderecoBairro(response.data[0].endereco_bairro);
            setEnderecoNumero(response.data[0].endereco_numero);
            setEnderecoLogradouro(response.data[0].endereco_logradouro);
            setEnderecoNomeLogradouro(response.data[0].endereco_nome_logradouro);
            setEnderecoCidade(response.data[0].endereco_cidade);
            setEnderecoEstado(response.data[0].endereco_estado);
            setEnderecoCep(response.data[0].endereco_cep);
            setVisivelAgendamento(response.data[0].visivel_agendamento);
            setHorarioAbertura(response.data[0].horario_abertura);
            setHorarioFechamento(response.data[0].horario_fechamento);
            setFechamentoAlmoco(response.data[0].fechamento_almoco);
            setEnderecoComplemento(response.data[0].endereco_complemento);
            setHorarioFechamentoAlmoco(response.data[0].horario_fechamento_almoco);
            setHorarioVoltaAlmoco(response.data[0].horario_volta_almoco);
            console.log(response.data);
         }
      )
   }

   useEffect(() => {
      api.get(`/estabelecimento/nome=${filtro}`, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let data = [];
            for (let i = 0; i < Response.data.length; i++) {
               data.push({
                  nome_estabelecimento: Response.data[i].nome_estabelecimento,
                  situacao: Response.data[i].situacao,
                  ativo: [Response.data[i].ativo, Response.data[i].id],
                  editar: [Response.data[i].ativo, Response.data[i].id]
               });
            }
            setEstabelecimentos(data);
         }
      );
   }, [filtro, isModalOpen]);

   return (
      <div className='container-usuarios'>
         {contextHolder}
         <Modal title={<Title level={3}>Cadastro de Usuários</Title>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
            <div className='main-card-buttons'>
               <button onClick={alteracaoTab} className={`esquerda ${tab === 0 ? 'selecionado' : ''}`}>Informações</button>
               <button onClick={alteracaoTab} className={`direita ${tab === 1 ? 'selecionado' : ''}`}>Endereço</button>
            </div>
            {tab === 0 ?
               <form onSubmit={alteracaoTab}>
                  <Row justify="start">
                     <label>Nome do Estabelecimento</label>
                     <Input disabled={estabelecimentoId == null ? false : true} className='input-cadastro' onChange={e => setNomeEstabelecimento(e.target.value)} value={nomeEstabelecimento} type="text" required />
                  </Row>

                  <Row justify="start">
                     <label>Disponível para agendamento de todos usuários ?</label>
                  </Row>
                  <Row justify="start">
                     <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeDispAgendamento} checked={visivelAgendamento} /></p>
                  </Row>

                  <Row justify="start">
                     <label>Horário de abertura e fechamento do estabelecimento</label>
                  </Row>
                  <Row justify="start">
                     <Col span={12}><input onChange={e => setHorarioAbertura(e.target.value)} value={horarioAbertura} className='input-time' type="time" required /><span> as </span>
                        <input onChange={e => setHorarioFechamento(e.target.value)} value={horarioFechamento} className='input-time' type="time" required /></Col>
                  </Row>

                  <Row justify="start">
                     <label>Fecha para horario de almoço ?</label>
                  </Row>
                  <Row justify="start">
                     <p><Switch colorPrimary='#A9335D' className='switch' defaultChecked onChange={onChangeFecAlmoco} checked={fechamentoAlmoco} /></p>
                  </Row>

                  {fechamentoAlmoco
                     ? <><Row justify="start">
                        <label>Horário do começo do almoço e retorno</label>
                     </Row>
                        <Row justify="start">
                           <Col span={12}><input onChange={e => setHorarioFechamentoAlmoco(e.target.value)} value={horarioFechamentoAlmoco} className='input-time' type="time" /><span> as </span><input onChange={e => setHorarioVoltaAlmoco(e.target.value)} value={horarioVoltaAlmoco} className='input-time' type="time" /></Col>
                        </Row>
                     </>
                     : null}

                  <div className='card-footer-empresa'>
                     <button>Próximo</button>
                  </div>
               </form>
               :
               <form onSubmit={salvar}>
                  <Row justify="start">
                     <Col span={4}><label className='label-cadastro'>Logradouro</label></Col>
                     <Col span={8} push={4}><label className='label-cadastro'>Nome Logradouro</label></Col>
                  </Row>
                  <Row justify="start">
                     <Col span={4}><Input className='input-cadastro' onChange={e => setEnderecoLogradouro(e.target.value)} value={enderecoLogradouro} /></Col>
                     <Col span={16} push={4}><Input onChange={e => setEnderecoNomeLogradouro(e.target.value)} value={enderecoNomeLogradouro} className='input-cadastro' /></Col>
                  </Row>
                  <Row justify="start">
                     <Col span={4}><label className='label-cadastro'>Bairro</label></Col>
                     <Col span={4} push={16}><label className='label-cadastro'>Numero</label></Col>
                  </Row>
                  <Row justify="start">
                     <Col span={16}><Input className='input-cadastro' onChange={e => setEnderecoBairro(e.target.value)} value={enderecoBairro} /></Col>
                     <Col span={4} push={4}><Input className='input-cadastro' onChange={e => setEnderecoNumero(e.target.value)} value={enderecoNumero} /></Col>
                  </Row>
                  <Row justify="start">
                     <label className='label-cadastro'>Cidade</label>
                  </Row>
                  <Row justify="start">
                     <Input className='input-cadastro' onChange={e => setEnderecoCidade(e.target.value)} value={enderecoCidade} />
                  </Row>
                  <Row justify="start">
                     <label className='label-cadastro'>Cep</label>
                  </Row>
                  <Row justify="start">
                     <Input className='input-cadastro' onChange={e => setEnderecoCep(cepMask(e.target.value))} value={enderecoCep} />
                  </Row>
                  <Row justify="start">
                     <label className='label-cadastro'>Estado</label>
                  </Row>
                  <Row justify="start">
                     <Input className='input-cadastro' onChange={e => setEnderecoEstado(e.target.value)} value={enderecoEstado} />
                  </Row>
                  <Row justify="start">
                     <label className='label-cadastro'>Complemento</label>
                  </Row>
                  <Row justify="start">
                     <TextArea className='input-cadastro' onChange={e => setEnderecoComplemento(e.target.value)} value={enderecoComplemento} />
                  </Row>
                  <Row justify="end" className='botao-salvar'>
                     <button className='botao-salvar' >Salvar</button>
                  </Row>
               </form>}
         </Modal>

         <Title level={3}>Estabelecimentos</Title>
         <Divider />
         <Row justify="end" className='opcoes-usuarios'>
            <Col span={5}><Button icon={<PlusCircleOutlined />} className='botao' onClick={showModal}>Novo Estabelecimento</Button></Col>
            <Col span={3}><Button icon={<SearchOutlined />} className='botao'>Filtrar</Button></Col>
            <Col span={8}><Input onChange={e => setFiltro(e.target.value)} value={filtro} className='input-filtro' placeholder="Digite o nome do Estabelecimento" /></Col>
         </Row>
         <Divider />
         <Table dataSource={estabelecimentos} columns={colunas} pagination={false} />
      </div>
   );
};

export default Estabelecimentos;