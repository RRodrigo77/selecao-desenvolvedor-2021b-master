import React, { useState } from 'react';
import Comp1 from './comp1'
import Comp2 from './comp2'
import MyContext from './MyContext';

function Questao2() {
  const [textoAtual, setTextoAtual] = useState('Texto');
    return (
      <div>
        <h1>Questão 2</h1>
        <MyContext.Provider value={textoAtual}>
        <Comp1 />
        <Comp2 setTextoAtual={setTextoAtual} />
        </MyContext.Provider>
      </div>
    );
  }
  
export default Questao2;
