import { useState, useEffect } from "react";
import { api } from "../api";

const vazio = { aluno_id: "", disciplina_id: "", nota: "" };

function Matriculas() {
  const [lista, setLista] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setLista(await api.listar("matriculas"));//tem que buscar as 3  pra restringir a escolha de registros válidos.
      setAlunos(await api.listar("alunos")); //precisa dos dados dos alunos e das disciplinas para preencher as caixas de seleção
      setDisciplinas(await api.listar("disciplinas"));
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
    const dados = {
      aluno_id: Number(form.aluno_id),
      disciplina_id: Number(form.disciplina_id),
      nota: form.nota === "" ? null : Number(form.nota),
    };
    try {
      if (editandoId) await api.atualizar("matriculas", editandoId, dados);
      else await api.criar("matriculas", dados);
      cancelar();
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function editar(m) {
    setEditandoId(m.id);
    setForm({
      aluno_id: m.aluno_id,
      disciplina_id: m.disciplina_id,
      nota: m.nota === null ? "" : m.nota,
    });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(vazio);
  }

  async function excluir(id) {
    if (!window.confirm("Cancelar esta matricula?")) return;
    try {
      await api.excluir("matriculas", id);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <section>
      <h2>{editandoId ? "Editar matricula" : "Nova matricula"}</h2>
      {erro && <p className="erro">{erro}</p>}

      <form onSubmit={salvar}>
        <select name="aluno_id" value={form.aluno_id} onChange={alterarCampo} required>
          <option value="">Selecione o aluno</option>
          {alunos.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
        <select name="disciplina_id" value={form.disciplina_id} onChange={alterarCampo} required>
          <option value="">Selecione a disciplina</option> {/*O usuario lê o nome, mas o React guarda o ID no form. É esse ID que viaja para o backend para a Chave Estrangeira*/}
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>{d.codigo} - {d.nome}</option>
          ))}
        </select>
        <input
          name="nota"
          type="number"
          step="0.01"
          min="0"
          max="10"
          placeholder="Nota (opcional)"
          value={form.nota}
          onChange={alterarCampo}
        />
        <button type="submit">{editandoId ? "Atualizar" : "Matricular"}</button>
        {editandoId && (
          <button type="button" className="secundario" onClick={cancelar}>Cancelar</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Aluno</th>
            <th>Disciplina</th>
            <th>Data</th>
            <th>Nota</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.aluno ? m.aluno.nome : m.aluno_id}</td> {/* se objeto m.aluno chegou da API exibe o nome, se devolver apenas o ID numérico, ele não quebra a tela e exibe o ID*/}
              <td>{m.disciplina ? m.disciplina.nome : m.disciplina_id}</td>
              <td>{m.data_matricula}</td>
              <td>{m.nota === null ? "-" : m.nota}</td>
              <td>
                <button onClick={() => editar(m)}>Editar</button>
                <button className="perigo" onClick={() => excluir(m.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {lista.length === 0 && (
            <tr>
              <td colSpan="6">Nenhuma matricula registrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Matriculas;

