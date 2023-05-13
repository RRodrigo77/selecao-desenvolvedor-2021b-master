// Função chamarPromise transformada em uma função assíncrona
async function chamarPromise (x){
  return new Promise(function(myResolve, myReject) {
    if (x > 7) {
      myResolve('Deu certo')
    } else {
      myReject('Deu errado')
    }
  })
}

function acaoBotao(){
  chamarPromise(8).then(res => alert(res)).catch(err => alert(err))
}

// Função acaoBotao2 atualizada para utilizar a nova sintaxe de async/await
async function acaoBotao2(){
  try {
    const response = await chamarPromise(8);
    alert(response);
  } catch (err) {
    alert(err);
  }
}

function Questao4() {
  return (
    <div>
      <h1>Questão 4</h1>
      <button onClick={acaoBotao}>Ativar</button>
      <button onClick={acaoBotao2}>Ativar2</button>
    </div>
  );
}

export default Questao4;
