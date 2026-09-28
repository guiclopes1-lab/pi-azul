
import { useState, useEffect } from "react";
import "./cadastro.css";
import { supabase } from '../supabase'

function Cadastro() {
  const [Usuarios, setusuarios] = useState([])
  const [form, setForm] = useState({
    nome_usuario: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    cep: "",
    rua: "",
    estado: "",
    cidade: "",
    n_casa: "",
  });

  async function Carregausuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select();

    if (error) {
      console.error('Erro ao carregar usuarios:', error);
      return;
    }

    setusuarios(data || []);
  }
  async function criarlogin() {

    // Limpa os dados antes de enviar
    const nomeUsuario = form.nome_usuario.trim();
    const email = form.email.trim().toLowerCase();
    const rua = form.rua.trim();
    const cidade = form.cidade.trim();
    const estado = form.estado.trim();

    const cpf = form.cpf.replace(/\D/g, "");
    const telefone = form.telefone.replace(/\D/g, "");
    const cep = form.cep.replace(/\D/g, "");

    // 1. Cria a conta no Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: email,
        password: form.senha,
      });

    if (authError) {
      console.error("Erro ao criar conta:", authError);
      alert(authError.message);
      return;
    }

    // 2. Pega o ID do usuário
    const userId = authData.user?.id;

    if (!userId) {
      alert("Não foi possível obter o usuário criado.");
      return;
    }

    // 3. Salva os dados limpos na tabela usuarios
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          id: userId,
          nome_usuario: nomeUsuario,
          cpf: cpf,
          telefone: telefone,
          email: email,
          cep: cep,
          rua: rua,
          estado: estado,
          cidade: cidade,
          n_casa: form.n_casa.trim(),
        },
      ])
      .select();

    if (error) {
      console.error("Erro ao salvar usuário:", error);
      alert(error.message);
      return;
    }

    console.log("Usuário criado:", data);
    alert("Cadastro realizado com sucesso!");
  }
  function formatarCPF(value) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatarTelefone(value) {
    const numeros = value.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function formatarCEP(value) {
    return value
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
  function handleChange(event) {
    const { name, value } = event.target;

    let valorFormatado = value;

    if (name === "cpf") {
      valorFormatado = formatarCPF(value);
    }

    if (name === "telefone") {
      valorFormatado = formatarTelefone(value);
    }

    if (name === "cep") {
      valorFormatado = formatarCEP(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: valorFormatado,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();
    await criarlogin();
  }

  useEffect(() => {
    Carregausuarios();
  }, []);
  return (
    <div className="cadastro-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-title">
          LEILÃO
        </div>
      </nav>

      {/* CONTAINER DO CADASTRO */}
      <div className="cadastro-container">

        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >



          {/* TÍTULO */}
          <div className="center-text">
            <h2>Criar Conta</h2>

            <p className="subtitle">
              Campos com * são obrigatórios
            </p>
          </div>


          {/* USUÁRIO E CPF */}
          <div className="form-group-row">

            <div className="form-group">
              <label htmlFor="usuario">
                Nome de usuário
              </label>

              <input
                type="text"
                name="nome_usuario"
                value={form.nome_usuario}
                onChange={handleChange}
                placeholder="Escolha um usuário"
              />

            </div>

            <div className="form-group">
              <label htmlFor="cpf">
                CPF
              </label>

              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                title="O CPF deve estar no formato 000.000.000-00"
              />

            </div>

          </div>

          {/* TELEFONE E EMAIL */}
          <div className="form-group-row">

            <div className="form-group">
              <label htmlFor="telefone">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                pattern="\(\d{2}\)\s?\d{4,5}-\d{4}"
                title="O telefone deve estar no formato (00) 00000-0000 ou (00) 0000-0000"
              />

            </div>

            <div className="form-group">
              <label htmlFor="email">
                E-mail *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="form-group">

            <label htmlFor="senha">
              Senha *
            </label>

            <input
              type="password"
              id="senha"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              placeholder="Crie uma senha forte"
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{10,}"
              title="A senha deve ter pelo menos 10 caracteres, incluir letra maiúscula, letra minúscula, número e caractere especial."
            />


          </div>

          {/* ENDEREÇO */}
          <fieldset>

            <legend>
              Endereço completo *
            </legend>

            {/* RUA E CEP */}
            <div className="form-group-row">

              <div className="form-group flex-2">

                <label htmlFor="rua">
                  Rua
                </label>

                <input
                  type="text"
                  name="rua"
                  value={form.rua}
                  onChange={handleChange}
                  pattern="[\p{L}0-9\s,.'\-]{3,}"
                  title="A rua deve conter pelo menos 3 caracteres."
                />
              </div>
              <div className="form-group flex-2 ">
                <label htmlFor="numero">
                  Número
                </label>
                <input
                  type="text"
                  name="n_casa"
                  value={form.n_casa}
                  onChange={handleChange}
                />

              </div>
              <div className="form-group flex-1">

                <label htmlFor="cep">
                  CEP
                </label>

                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* CIDADE E ESTADO */}
            <div className="form-group-row">

              <div className="form-group">

                <label htmlFor="cidade">
                  Cidade
                </label>

                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">

                <label htmlFor="estado">
                  Estado
                </label>

                <input
                  type="text"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  pattern="[A-Za-zÀ-ÿ\s]{2,}"
                  title="O estado deve conter pelo menos 2 letras."
                />

              </div>

            </div>

          </fieldset>

          {/* TERMOS */}
          <div className="form-checkbox">

            <input
              type="checkbox"
              id="termos"
              name="termos"
              required
            />

            <label htmlFor="termos">
              Concordo com os termos e condições do site
            </label>

          </div>

          {/* BOTÃO */}
          <button type="submit" className="btn-finalizar">
            Finalizar Cadastro
          </button>



        </form>

      </div>

    </div>
  );
}

export default Cadastro;
