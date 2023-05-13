
/*
function NotaField({ maxNota, value, onChange }) {
    function onChangeValue (event) {
        const nota = event.target.value

        if (nota <= maxNota) {
            onChange(nota)
        }
    }

    return (
      <div>
        <input
            type={'number'}
            value={value}
            onChange={onChangeValue}
        />
      </div>
    );
  }
  
export default NotaField;
*/

import { useState } from "react";

	const NotaField = ({ maxNota, value, onChange }) => {
	  const [nota, setNota] = useState(value);

	  const handleClick = (novaNota) => {
		if (novaNota <= maxNota) {
		  setNota(novaNota);
		  onChange(novaNota);
		}
	  };

	  const estrelhinhas = [];

	  for (let i = 1; i <= maxNota; i++) {
		const corEstrela = i <= nota ? "#FFD700" : "#DDD";
		estrelhinhas.push(
		  <span
			key={i}
			style={{ color: corEstrela, cursor: "pointer" }}
			onClick={() => handleClick(i)}
		  >
			★
		  </span>
		);
	  }

	  return <div>{estrelhinhas}</div>;
	};