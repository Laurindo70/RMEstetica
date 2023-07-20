import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import RegisterEstabelecimento from './Pages/RegisterEstabelecimento';
import Home from './Pages/Home';

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
               <Route path='/register-user' element={<RegisterUser />} />
               <Route path='/register-estabelecimento' element={<RegisterEstabelecimento />} />
               <Route path='/home' element={<Home />} />
            </Routes>
         </Router>
      </ConfigProvider>
   )
}

export default Rotas;