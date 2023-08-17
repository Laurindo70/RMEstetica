import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import RegisterEstabelecimento from './Pages/RegisterEstabelecimento';
import Home from './Pages/Home';
import Usuarios from './Pages/Usuarios';
import Estabelecimentos from './Pages/Estabelecimentos';
import Inicio from './Pages/Inicio';

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
               </Route>
            </Routes>
         </Router>
      </ConfigProvider>
   )
}

export default Rotas;