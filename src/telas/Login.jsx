import React, { useState } from "react";
import "./login.css";
import { supabase } from "../supabase";

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailLimpo,
      password: senhaLimpa,
    });

    if (error) {
      console.error("Erro ao fazer login:", error);
      alert("E-mail ou senha incorretos.");
      return;
    }

    console.log("Login realizado:", data);

    window.location.href = "/";
  };

  return (
    <div className="login-page">

      <div className="glow-bg"></div>

      <nav className="navbar">
        <div className="nav-title">
          LEILÃO
        </div>
      </nav>

      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="center-text">

            <h2>
              Acessar Conta
            </h2>

            <p className="subtitle">
              Bem-vindo de volta. Insira seus dados.
            </p>

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="identificador">
              E-mail
            </label>

            <div className="input-wrapper">

              <input
                type="email"
                id="identificador"
                name="identificador"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
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
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
              />

            </div>

          </div>

          {/* BOTÃO */}

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
