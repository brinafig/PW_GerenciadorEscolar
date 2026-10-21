import { useState, useEffect } from "react";
import { api } from "../api";

//responsável por fazer o CRUD da entidade Aluno. 
//desenha a tela, le o que o usuario escreve e envia para a API 

const vazio = { nome: "", email: "", data_nascimento: "" };

function Alunos() { ////usestate é hook. sempre que o valor da variáveil muda, o React redesenha a parte da tela que foi afetada
  const [lista, setLista] = useState([]); //começa como um vetor vazio. Vai guardar a lista de alunos que vem do banco de dados
  const [form, setForm] = useState(vazio);//começa com o objeto vazio. Guarda cada letra digitada nos inputs 
  const [editandoId, setEditandoId] = useState(null); //começa como null. sinaliza. Se for null, o React sabe que esta criaando um novo aluno. Se tiver um número o React sabe que está a atualizando o aluno tal
  const [erro, setErro] = useState("");// guarda mensagens de erro

  async function carregar() { //faz um pedido GET pra API e guarda o resultado na variável lista
    try {
      setLista(await api.listar("alunos"));
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {  //como tem um vetor vazio no final, o React executa a função carregar() apenas uma vez, assim que esta página acabar de carregar
    carregar();
  }, []);

  function alterarCampo(e) { //em vez de uma função para o Nome, E-mail e outra pra Data, tem apenas uma. 
    setForm({ ...form, [e.target.name]: e.target.value }); //O name é qual campo foi o input, e o value pega o que digitou
  }

 //o formulário não envia os dados no padrão antigo do HTML, quem envia é o JavaScript
 // o onSubmit={salvar} delega a tarefa para a função salvar, que utiliza o e.preventDefault() para barrar o HTML,
 // e depois usa a classe api.js para enviar o JSON de forma assíncrona para o backend.
  async function salvar(e) { //acionada quando clica no botão do formulário
    e.preventDefault(); //impede de recarregar a pagina
    setErro("");
    const dados = { ...form, data_nascimento: form.data_nascimento || null }; //converte um campo de data vazio para nulo, para que o PostgreSQL não de erro tentando salvar uma string vazia
    try {
      if (editandoId) await api.atualizar("alunos", editandoId, dados); //decide se manda um comando PUT(se tiver numero) ou POST(se tiver null). Se der certo, limpa o formulário e atualiza a tabela
      else await api.criar("alunos", dados);
      cancelar(); //limpa
      carregar(); //atauliza tabela
    } catch (e) {
      setErro(e.message);
    }
  }

  function editar(aluno) { //acionada quando clica em Editar de uma linha da tabela
    setEditandoId(aluno.id); //salva o ID do aluno na variável editandoId. essa variável faz o título da página mudar de Novo aluno para Editar aluno e o botão mudar para Atualizar
    setForm({ //pega os dados daquele aluno e bota na variável form. os <input> do HTML estão conectados a essa variável form 
      nome: aluno.nome,
      email: aluno.email,
      data_nascimento: aluno.data_nascimento || "",
    });
  }

  function cancelar() { //limpa o ID limpa as caixas de texto e devolve a tela pro estado original
    setEditandoId(null);
    setForm(vazio);
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este aluno? As matriculas dele tambem serao removidas.")) return; //janela de confirmacao
    try {
      await api.excluir("alunos", id);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }
// se existe um ID sendo editado escreve editar aluno, se não escreve novo aluno
  return (
    <section>
      <h2>{editandoId ? "Editar aluno" : "Novo aluno"}</h2>  
      
      {erro && <p className="erro">{erro}</p>}

      <form onSubmit={salvar}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={alterarCampo} required />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={alterarCampo} //quando digita uma letra, o onChange avisa a função alterarCampo, que atualiza a variável 
          required //nao é opcional
        />
        <input
          name="data_nascimento"
          type="date"
          value={form.data_nascimento}
          onChange={alterarCampo}
        />
        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
        {editandoId && (
          <button type="button" className="secundario" onClick={cancelar}> Cancelar </button> //nao precisa receber parametro
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Nascimento</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((a) => ( //faz um loop pra devolver as linhas da tabela o key é exigencia do React pra renderizacao de listas
            <tr key={a.id}> 
              <td>{a.id}</td>
              <td>{a.nome}</td>
              <td>{a.email}</td>
              <td>{a.data_nascimento || "-"}</td> {/* se tiver vazia devolve um tracinho */}
              <td>
                <button onClick={() => editar(a)}>Editar</button>
                <button className="perigo" onClick={() => excluir(a.id)}>Excluir</button> {/*tem que receber um ID especifico, sem a seta exclui de tudo*/}
              </td>
            </tr>
          ))}
          {lista.length === 0 && ( //verifica se há registros retornados do PostgreSQL
            <tr>
              <td colSpan="5">Nenhum aluno cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Alunos;
