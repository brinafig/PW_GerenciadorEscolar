import React from "react";
import ReactDOM from "react-dom/client"; //biblioteca específica para manipular a tela React
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

//ponto de partida de toda a aplicação frontend. 
// É a ponte onde o código React se conecta com o documento HTML tradicional do navegador.

const root = ReactDOM.createRoot(document.getElementById("root")); //O navegador lê um único arquivo chamado public/index.html que contém apenas uma tag vazia. Este comando captura essa div.
root.render(<App />); //O React cria a base de operações(root) dentro dessa div capturada e bota todo o componente <App/> lá dentro

serviceWorkerRegistration.register(); //diferencia um site comum de um PWA
