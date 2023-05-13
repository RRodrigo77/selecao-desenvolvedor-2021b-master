import React, { useState, useEffect } from "react";

function Questao3() {
  // Cria um estado para armazenar o valor do campo de entrada. O useState recebe uma função que lê o valor
  // armazenado no localStorage. Se não houver nenhum valor armazenado, o valor inicial será uma string vazia ("").
  const [valor, setValor] = useState(() => localStorage.getItem("valorCampo") || "");

  // Adiciona um listener para o evento beforeunload do window, que é disparado quando a página está prestes a ser
  // descarregada (por exemplo, quando o usuário fecha ou atualiza a página). No listener, salva o valor atual do
  // campo de entrada no localStorage usando a chave "valorCampo".
  useEffect(() => {
    function handleBeforeUnload() {
      localStorage.setItem("valorCampo", valor);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove o listener ao descarregar o componente.
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [valor]);

  // Renderiza o componente, que consiste em um título, um campo de entrada e um botão de envio.
  // O valor do campo de entrada é definido pelo estado "valor". O onChange do campo de entrada chama a função
  // "setValor" para atualizar o estado com o novo valor digitado pelo usuário.
  return (
    <div>
      <h1>Questão 3</h1>
      <input
        value={valor}
        onChange={(event) => {
          setValor(event.target.value);
        }}
      />
    </div>
  );
}

export default Questao3;

