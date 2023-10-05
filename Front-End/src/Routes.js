import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import RegisterEstabelecimento from './Pages/RegisterEstabelecimento';
import Home from './Pages/Home';
import Usuarios from './Pages/Usuarios';
import Estabelecimentos from './Pages/Estabelecimentos';
import Inicio from './Pages/Inicio';
import Despesas from './Pages/Despesas';
import Estoque from './Pages/Estoque';
import Agendamentos from './Pages/Agendamentos';
import Procedimentos from './Pages/Procedimentos';
import Profissionais from './Pages/Profissionais';

function Rotas() {
   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: '#A9335D',
            },
         }}
      >
         <Router basename="/rmestetica">
            <Routes>
               <Route path='/' element={<Login />} />
               <Route path='/register-user/:estabelecimentoId?' element={<RegisterUser />} />
               <Route path='/register-estabelecimento' element={<RegisterEstabelecimento />} />
               <Route path='/home' element={<Home />}>
                  <Route path='' element={<Inicio />} />
                  <Route path='usuarios' element={<Usuarios />} />
                  <Route path='estabelecimentos' element={<Estabelecimentos />} />
                  <Route path='despesas' element={<Despesas />} />
                  <Route path='estoque' element={<Estoque />} />
                  <Route path='agendamento' element={<Agendamentos />} />
                  <Route path='procedimento' element={<Procedimentos />} />
                  <Route path='profissionais' element={<Profissionais />} />
               </Route>
            </Routes>
         </Router>
      </ConfigProvider>
   )
}

export default Rotas;