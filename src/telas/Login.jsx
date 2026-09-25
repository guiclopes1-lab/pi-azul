import React, { useEffect, useState } from "react";
import "./login.css";
import { supabase } from '../supabase'

function Login() {

  const [Usuarios, setusuarios] = useState([])
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
  async function criarlogin() {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          id: id,
          nome: nome_usuario
        }
      ])
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Aqui você pode adicionar a lógica de login
    console.log("Login enviado!");
  };
  useEffect(() => {
    Carregausuarios();
  }, []);

  return (
    <div className="login-page">

      {/* FUNDO ABSTRATO */}
      <div className="glow-bg"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-title">
          LEILÃO
        </div>
      </nav>

      {/* CONTAINER DO LOGIN */}
      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* CABEÇALHO */}
          <div className="center-text">

            <h2>
              Acessar Conta
            </h2>

            <p className="subtitle">
              Bem-vindo de volta. Insira seus dados.
            </p>

          </div>

          {/* E-MAIL OU USUÁRIO */}
          <div className="form-group">

            <label htmlFor="identificador">
              E-mail ou nome de usuário
            </label>

            <div className="input-wrapper">

              <input
                type="text"
                id="identificador"
                name="identificador"
                required
                placeholder="seu@email.com ou usuário"
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <div className="input-wrapper">

              <input
                type="password"
                id="senha"
                name="senha"
                required
                placeholder="••••••••"
              />

            </div>

          </div>

          {/* BOTÃO ENTRAR */}
          <button
            type="submit"
            className="btn-entrar"
          >
            Entrar
          </button>

          {/* CADASTRO */}
          <div className="register-link">
            Não tem uma conta?{" "}

            <a href="/cadastro">
              Cadastre-se
            </a>
          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;
