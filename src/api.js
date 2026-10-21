const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; //lê as variáveis de ambiente do sistema. 
//Se o projeto estiver rodando localmente no vs essa variável não existe, então ele usa o plano B "http://localhost:3001". 
// se estiver na nuvem configura essa variável com o link público do Render, e o sistema faz a troca automaticamente

//serviço de mensagem do frontend. Ele centraliza todas as comunicações de rede entre o React e o backend
//Em vez de escrever as configurações complexas de conexão em todos os componentes, tem aqui apenas uma vez

async function requisicao(caminho, opcoes = {}) { //empacota o fetch nativo do navegador para não repetir código.
  const resposta = await fetch(`${API_URL}${caminho}`, {  //função nativa dos navegadores modernos para fazer requisições HTTP
    headers: { "Content-Type": "application/json" }, //Avisa ao backend que o pacote está no formato JSON
    ...opcoes, //Parâmetro Padrão. se tu chamar a função apenas com o caminho, sem dados, o JavaScript assume automaticamente que opcoes é um objeto vazio.
  }); //opcoes permite ter um cabeçalho padrão para todas as requisições, mas manter a flexibilidade de botar métodos diferentes

  if (resposta.status === 204) return null; //sem conteudo

  const dados = await resposta.json().catch(() => ({})); //tenta transformar a resposta do servidor em um objeto JavaScript
  if (!resposta.ok) throw new Error(dados.erro || "Erro na requisicao."); //busca o erro descrito no backend
  return dados;
}

// recurso = alunos, disciplinas e matriculas
export const api = { //pega na função base requisicao e cria versões específicas para os 4  CRUD
  listar: (recurso) => requisicao(`/${recurso}`), 
  criar: (recurso, dados) =>
    requisicao(`/${recurso}`, { method: "POST", body: JSON.stringify(dados) }), //JSON.stringify(dados): Utilizado no POST e PUT, O HTTP só transporta texto puro. Este comando pega no objeto JavaScript e transforma numa string de texto no formato JSON
  atualizar: (recurso, id, dados) =>
    requisicao(`/${recurso}/${id}`, { method: "PUT", body: JSON.stringify(dados) }), //esses dois precisam enviar dados preenchdios no formulario
  excluir: (recurso, id) => requisicao(`/${recurso}/${id}`, { method: "DELETE" }),
};
