import React, { useState } from "react";
import "./login.css";
import { supabase } from "../supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function traduzirErroLogin(message) {
    if (message.includes("Invalid login credentials")) {
      return "E-mail ou senha incorretos.";
    }

    if (message.includes("Email not confirmed")) {
      return "Por favor, confirme seu e-mail antes de fazer login.";
    }

    return `Erro ao fazer login: ${message}`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const emailLimpo = email.trim().toLowerCase();
      const senhaLimpa = senha;

      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senhaLimpa,
      });

      if (error) {
        console.error("ERRO LOGIN:", error);
        console.error("MENSAGEM:", error.message);
        console.error("STATUS:", error.status);

        alert(traduzirErroLogin(error.message));
        return;
      }

      console.log("LOGIN REALIZADO:", data);
      console.log("ID DO USUÁRIO:", data.user.id);

      // CONSULTA NO BANCO
      const { data: usuario, error: dbError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .single();

      if (dbError) {
        console.error("ERRO BANCO:", dbError);
        alert(`Erro ao buscar usuário: ${dbError.message}`);
        return;
      }

      console.log("USUARIO:", usuario);

      // LOGIN + CONSULTA OK
      window.location.href = "/";
    } catch (err) {
      console.error("ERRO INESPERADO:", err);
      alert("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
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

          <button
            type="submit"
            className="btn-entrar"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

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
