
import { useState, useEffect } from "react";
import "./cadastro.css";
import { supabase } from '../supabase'

function Cadastro() {
  const [Usuarios, setusuarios] = useState([])
  const [criarusuario, setcriarusuario] = useState()
  async function Carregausuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select();

    if (error) {
      console.error('Erro ao carregar usuarios:', error);
      return;
    }

    setusuarios(data);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

  };

  async function criarlogin() {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          id: id,
          nome_usuario: nome_usuario,
          cpf: cpf,
          telefone: telefone,
          email: email,
          senha: senha,
          cep: cep,
          rua: rua,
          estado: estado,
          cidade: cidade,
          n_casa: n_casa
        }
      ])
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

          {/* NOME COMPLETO */}
          <div className="form-group">
            <label htmlFor="nome">
              Nome completo *
            </label>

            <input
              type="text"
              id="nome"
              name="nome"
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          {/* USUÁRIO E CPF */}
          <div className="form-group-row">

            <div className="form-group">
              <label htmlFor="usuario">
                Nome de usuário
              </label>

              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Escolha um usuário"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">
                CPF
              </label>

              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
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
                id="telefone"
                name="telefone"
                required
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                E-mail *
              </label>

              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="seu@email.com"
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
              required
              placeholder="Crie uma senha forte"
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
                  id="rua"
                  name="rua"
                  required
                  placeholder="Ex: Av. Paulista"
                />

              </div>
              <div className="form-group flex-2 ">
                <label htmlFor="numero">
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  required
                  placeholder="Ex: 1230"
                />
              </div>
              <div className="form-group flex-1">

                <label htmlFor="cep">
                  CEP
                </label>

                <input
                  type="text"
                  id="cep"
                  name="cep"
                  required
                  placeholder="00000-000"
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
                  id="cidade"
                  name="cidade"
                  required
                  placeholder="Sua cidade"
                />

              </div>

              <div className="form-group">

                <label htmlFor="estado">
                  Estado
                </label>

                <input
                  type="text"
                  id="estado"
                  name="estado"
                  required
                  placeholder="Seu estado"
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
          <button
            type="submit"
            className="btn-finalizar"
          >
            Finalizar Cadastro
          </button>

        </form>

      </div>

    </div>
  );
}

export default Cadastro;
