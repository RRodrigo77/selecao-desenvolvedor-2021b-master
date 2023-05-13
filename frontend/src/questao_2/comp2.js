import { useState } from "react";
import MyContext from './MyContext';

function Comp2({ setTextoAtual }) {
  const textoAtual = useContext(MyContext);

  function handleChange(event) {
    const novoTexto = event.target.value;
    setTextoAtual(novoTexto);
  }

  return (
    <div>
      <input value={textoAtual} onChange={handleChange} />
    </div>
  );
}

export default Comp2;
