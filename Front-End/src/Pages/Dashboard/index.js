import React, { useEffect, useState, useLayoutEffect } from 'react';
import { MdOutlineAttachMoney, MdMoneyOff } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";
import { Card, Col, Row, Typography, DatePicker } from 'antd';
import { Chart } from "react-google-charts";
import api from '../../Utils/api';
import './style.css';

const { Title, Text } = Typography;



export const optionsPizza = {
   title: "Total Agendamentos",
   colors: ["#A9335D", "#FE9CCC"],
   pieHole: 0.4,
   is3D: false,
};
export const optionsColunas =
{
   title: "Valores dos procedimentos",
   chartArea: { width: "70%" },
   colors: ["#A9335D", "#FE9CCC"],
   hAxis: {
      title: "Valores",
      minValue: 0,
   },
   vAxis: {
      title: "Procedimento",
   },
};

export const options = {
   chart: {
      title: "Balanço anual",
   },
   colors: ["#A9335D", "#FE9CCC"],
   width: '100%',
   height: 500,
   series: {
      0: { axis: "valor" },
   },
   axes: {
      y: {
         Temps: { label: "Valor" },
      },
   },
};

function Dashboard() {
   const token = localStorage.getItem('TokenRm');
   const dataAtual = new Date();
   const [ano, setAno] = useState(dataAtual.getFullYear());
   const [gasto, setGasto] = useState(null);
   const [arrecadado, setArrecadado] = useState(null);
   const [pendente, setPendente] = useState(null);
   const [dataLinha, setDataLinha] = useState([]);
   const [dataPizza, setDataPizza] = useState([]);
   const [dataColuna, setDataColuna] = useState([]);

   useLayoutEffect(() => {
      const estab = localStorage.getItem('EstabelecimentoRm');
      api.post(`/dashboard/${estab}`, {
         ano: ano
      }, {
         headers: {
            Authorization: token
         }
      }).then(
         (Response) => {
            let dados = Response.data;
            let dadosColuna = [["Procedimento", "Valor Pago", "Valor Pendente"]]
            dados.procedimentos.map((procedimento) => {
               return dadosColuna.push([procedimento.nome_procedimento, procedimento.pago, procedimento.pendente])
            });
            setArrecadado(dados.arrecadado);
            setGasto(dados.gasto);
            setPendente(dados.pendente);
            setDataColuna(dadosColuna);
            setDataPizza(
               [
                  ["Tipos", "Qtd. Agendamentos"],
                  ["Finalizados", ((dados.agendamentos.total / 100) * dados.agendamentos.finalizado)],
                  ["Cancelados", ((dados.agendamentos.total / 100) * dados.agendamentos.cancelado)],
                  ["Pendentes", ((dados.agendamentos.total / 100) * dados.agendamentos.pendente)]
               ]
            )
            setDataLinha([
               [
                  { type: "date", label: "Meses" },
                  "Total arrecadado",
                  "Total Gasto",
               ],
               [new Date(ano, 0), (dados.dadosRecebimento.jan != null ? dados.dadosRecebimento.jan : 0), (dados.dadosDespesas.jan != null ? dados.dadosDespesas.jan : 0)],
               [new Date(ano, 1), (dados.dadosRecebimento.fev != null ? dados.dadosRecebimento.fev : 0), (dados.dadosDespesas.fev != null ? dados.dadosDespesas.fev : 0)],
               [new Date(ano, 2), (dados.dadosRecebimento.mar != null ? dados.dadosRecebimento.mar : 0), (dados.dadosDespesas.mar != null ? dados.dadosDespesas.mar : 0)],
               [new Date(ano, 3), (dados.dadosRecebimento.abr != null ? dados.dadosRecebimento.abr : 0), (dados.dadosDespesas.abr != null ? dados.dadosDespesas.abr : 0)],
               [new Date(ano, 4), (dados.dadosRecebimento.mai != null ? dados.dadosRecebimento.mai : 0), (dados.dadosDespesas.mai != null ? dados.dadosDespesas.mai : 0)],
               [new Date(ano, 5), (dados.dadosRecebimento.jun != null ? dados.dadosRecebimento.jun : 0), (dados.dadosDespesas.jun != null ? dados.dadosDespesas.jun : 0)],
               [new Date(ano, 6), (dados.dadosRecebimento.jul != null ? dados.dadosRecebimento.jul : 0), (dados.dadosDespesas.jul != null ? dados.dadosDespesas.jul : 0)],
               [new Date(ano, 7), (dados.dadosRecebimento.ago != null ? dados.dadosRecebimento.ago : 0), (dados.dadosDespesas.ago != null ? dados.dadosDespesas.ago : 0)],
               [new Date(ano, 8), (dados.dadosRecebimento.set != null ? dados.dadosRecebimento.set : 0), (dados.dadosDespesas.set != null ? dados.dadosDespesas.set : 0)],
               [new Date(ano, 9), (dados.dadosRecebimento.out != null ? dados.dadosRecebimento.out : 0), (dados.dadosDespesas.out != null ? dados.dadosDespesas.out : 0)],
               [new Date(ano, 10), (dados.dadosRecebimento.nov != null ? dados.dadosRecebimento.nov : 0), (dados.dadosDespesas.nov != null ? dados.dadosDespesas.nov : 0)],
               [new Date(ano, 11), (dados.dadosRecebimento.dez != null ? dados.dadosRecebimento.dez : 0), (dados.dadosDespesas.dez != null ? dados.dadosDespesas.dez : 0)],
            ]);
         }
      )
   }, [ano]);

   const onChangeDate = (date, dateString) => {
      setAno(dateString);
   };

   return (
      <div className='container-dash'>
         <Row align={'middle'}>
            <Text>Selecione o ano dos dados:</Text>
         </Row>
         <Row style={{ marginBottom: '2%' }}>
            <DatePicker picker="year" placeholder={`${ano}`} onChange={onChangeDate} />
         </Row>
         <Row gutter={16}>
            <Col span={6}>
               <Card title={<Title level={3} style={{ color: '#fff' }} ><MdOutlineAttachMoney /> Arrecadado no Ano</Title>} bordered={true} style={{ background: '#FE9CCC', color: '#fff' }}>
                  {arrecadado != null ? <Title level={4} style={{ color: '#fff' }} > {arrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title> : <Title level={4} style={{ color: '#fff' }} >R$ 000,00</Title>}
               </Card>
            </Col>
            <Col span={6}>
               <Card title={<Title level={3} style={{ color: '#fff' }} ><MdMoneyOff /> Gasto no Ano</Title>} bordered={true} style={{ background: '#FE9CCC', color: '#fff' }}>
                  {gasto != null ? <Title level={4} style={{ color: '#fff' }} > {gasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title> : <Title level={4} style={{ color: '#fff' }} >R$ 000,00</Title>}
               </Card>
            </Col>
            <Col span={6}>
               <Card title={<Title level={3} style={{ color: '#fff' }} ><FaMoneyBillTransfer /> Recebimento Pendente</Title>} bordered={true} style={{ background: '#FE9CCC', color: '#fff' }}>
                  {pendente != null ? <Title level={4} style={{ color: '#fff' }} > {(pendente).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title> : <Title level={4} style={{ color: '#fff' }} >R$ 000,00</Title>}
               </Card>
            </Col>
            <Col span={6}>
               <Card title={<Title level={3} style={{ color: '#fff' }} ><TbPigMoney /> Saldo no Ano</Title>} bordered={true} style={{ background: '#FE9CCC', color: '#fff' }}>
                  {arrecadado != null && gasto != null ? <Title level={4} style={{ color: '#fff' }} > {(arrecadado - gasto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Title> : <Title level={4} style={{ color: '#fff' }} >R$ 000,00</Title>}
               </Card>
            </Col>
         </Row>
         <Row gutter={16}>
            <Col span={10}>
               <div className='graficos'
                  style={{ boxShadow: '5px', marginTop: '50px', border: 'solid 1px #A9335D', width: '100%', borderRadius: '10px' }}>
                  <Chart
                     chartType="PieChart"
                     width={"100%"}
                     height={"400px"}
                     data={dataPizza}
                     options={optionsPizza}
                  />
               </div>
            </Col>
            <Col span={14}>
               <div className='graficos'
                  style={{ boxShadow: '5px', padding: '2%', marginTop: '50px', border: 'solid 1px #A9335D', borderRadius: '10px' }}>
                  <Chart
                     chartType="Line"
                     width="100%"
                     height="400px"
                     style={{ marginBottom: '100px' }}
                     data={dataLinha}
                     options={options}
                  />
               </div>
            </Col>
         </Row>
         <Row gutter={16}>
            <Col span={16} >
               <div className='graficos'
                  style={{ boxShadow: '5px', padding: '2%', marginTop: '50px', border: 'solid 1px #A9335D', borderRadius: '10px' }}>
                  <Chart chartType="BarChart" width="100%" height="400px" data={dataColuna} options={optionsColunas} />
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default Dashboard;