import { useState, useEffect } from "react";
import { api } from "../api";

const vazio = { nome: "", codigo: "", carga_horaria: 60 };

function Disciplinas() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setLista(await api.listar("disciplinas"));
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function alterarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    const dados = { ...form, carga_horaria: Number(form.carga_horaria) };
    try {
      if (editandoId) await api.atualizar("disciplinas", editandoId, dados);
      else await api.criar("disciplinas", dados);
      cancelar();
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function editar(d) {
    setEditandoId(d.id);
    setForm({ nome: d.nome, codigo: d.codigo, carga_horaria: d.carga_horaria });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(vazio);
  }

  async function excluir(id) {
    if (!window.confirm("Excluir esta disciplina? As matriculas nela tambem serao removidas.")) return;
    try {
      await api.excluir("disciplinas", id);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <section>
      <h2>{editandoId ? "Editar disciplina" : "Nova disciplina"}</h2>
      {erro && <p className="erro">{erro}</p>}

      <form onSubmit={salvar}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={alterarCampo} required />
        <input
          name="codigo"
          placeholder="Codigo (ex: MAT101)"
          value={form.codigo}
          onChange={alterarCampo}
          required
        />
        <input
          name="carga_horaria"
          type="number"
          min="1"
          placeholder="Carga horaria"
          value={form.carga_horaria}
          onChange={alterarCampo}
          required
        />
        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
        {editandoId && (
          <button type="button" className="secundario" onClick={cancelar}>Cancelar </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Codigo</th>
            <th>Carga horaria</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.nome}</td>
              <td>{d.codigo}</td>
              <td>{d.carga_horaria}h</td>
              <td>
                <button onClick={() => editar(d)}>Editar</button>
                <button className="perigo" onClick={() => excluir(d.id)}> Excluir </button>
              </td>
            </tr>
          ))}
          {lista.length === 0 && (
            <tr>
              <td colSpan="5">Nenhuma disciplina cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Disciplinas;
