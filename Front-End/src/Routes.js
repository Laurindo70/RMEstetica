import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';

function Rotas() {
   return (
      <Router basename="/rmestetica">
         <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register-user' element={<RegisterUser />} />
         </Routes>
      </Router>

   )
}

export default Rotas;