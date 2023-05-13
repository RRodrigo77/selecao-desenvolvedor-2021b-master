import { useState } from "react";
import MyContext from "./MyContext";

function Comp1() {
  const textoAtual = useContext(MyContext);
  return <div>{textoAtual}</div>;
}

export default Comp1;
