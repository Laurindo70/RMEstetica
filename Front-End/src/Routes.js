import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login';

function Rotas() {
   return (
      <Router basename="/rmestetica">
         <Routes>
            <Route path='/' element={<Login />} />
         </Routes>
      </Router>

   )
}

export default Rotas;