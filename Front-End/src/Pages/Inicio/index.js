import React from 'react';
import './style.css';
import imagemInicio from '../../Images/Rectangle 14.svg';

function Inicio() {
   return (
      <div className='container-inicio'>
         <img src={imagemInicio}></img>
      </div>
   );
};

export default Inicio;