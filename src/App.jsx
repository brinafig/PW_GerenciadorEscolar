import { useState } from "react";
import Alunos from "./components/Alunos";
import Disciplinas from "./components/Disciplinas";
import Matriculas from "./components/Matriculas";

//maestro do frontend. tem função de gerir a navegação entre as três telas menores

function App() {
  const [aba, setAba] = useState("alunos"); //memória central da navegação. variável aba valendo "alunos". Sempre que usa o setAba("disciplinas"), o React percebe a mudança e redesenha a tela instantaneamente.

  return (
    <div className="container">
      <header>
        <h1>Gerenciador Escolar</h1>
        <nav>
          <button className={aba === "alunos" ? "ativo" : ""} onClick={() => setAba("alunos")}>Alunos</button> //altera a palavra guardad no estado
          <button className={aba === "disciplinas" ? "ativo" : ""} onClick={() => setAba("disciplinas")}>Disciplinas</button>
          <button className={aba === "matriculas" ? "ativo" : ""} onClick={() => setAba("matriculas")}>Matriculas</button>
        </nav>
      </header>

      <main>
        {aba === "alunos" && <Alunos />} //Se aba for exatamente igual a 'alunos', então desenhe o componente alunos na tela. senão, não desenhe nada
        {aba === "disciplinas" && <Disciplinas />}
        {aba === "matriculas" && <Matriculas />}
      </main>
    </div>
  );
}

export default App;
