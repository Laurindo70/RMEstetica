import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import RegisterEstabelecimento from './Pages/RegisterEstabelecimento';

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
            </Routes>
         </Router>
      </ConfigProvider>
   )
}

export default Rotas;