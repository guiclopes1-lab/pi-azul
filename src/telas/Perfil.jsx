import React, { useEffect, useState } from "react";
import "./perfil.css";
import { supabase } from "../supabase";

function Perfil() {
  const [produtos, setProdutos] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  // Estados para o Modal de Edição
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Busca dados do usuário logado e seus produtos
  async function carregaDados() {
    try {
      // 1. Obter usuário autenticado
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        // Caso não use Auth nativo do Supabase, você pode fallback para a tabela 'usuarios'
        const { data: dataUsuarios } = await supabase.from("usuarios").select().limit(1);
        if (dataUsuarios && dataUsuarios.length > 0) {
          const u = dataUsuarios[0];
          setUsuarioAtual(u);
          carregarProdutosDoUsuario(u.id);
        }
        return;
      }

      // 2. Busca dados completos do usuário no banco
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (userError) {
        console.error("Erro ao carregar perfil do usuário:", userError);
        return;
      }

      setUsuarioAtual(userData);
      setNome(userData.nome_usuario || "");
      setEmail(userData.email || "");

      // 3. Busca produtos vinculados a ESTE usuário (chave estrangeira id_usuario)
      carregarProdutosDoUsuario(userData.id);

    } catch (err) {
      console.error("Erro inesperado:", err);
    }
  }

  // Função auxiliar para buscar os produtos filtrados por id_usuario
  async function carregarProdutosDoUsuario(userId) {
    const { data: dataProdutos, error: errorProdutos } = await supabase
      .from("produtos")
      .select("*")
      .eq("id_usuario", userId); // Relaciona com o id_usuario do banco

    if (errorProdutos) {
      console.error("Erro ao carregar produtos:", errorProdutos);
    } else {
      setProdutos(dataProdutos || []);
    }
  }

  useEffect(() => {
    carregaDados();
  }, []);

  const handleAbrirModal = () => {
    if (usuarioAtual) {
      setNome(usuarioAtual.nome_usuario || "");
      setEmail(usuarioAtual.email || "");
      setSenha(""); // Por segurança, limpa o campo de senha no modal
    }
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    if (!usuarioAtual) return;

    setCarregando(true);

    const payload = {
      nome_usuario: nome,
      email: email,
    };

    // Só inclui a senha no update se o usuário preencheu o campo
    if (senha) {
      payload.senha = senha;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(payload)
      .eq("id", usuarioAtual.id)
      .select();

    setCarregando(false);

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar o perfil. Tente novamente.");
    } else {
      alert("Perfil atualizado com sucesso!");
      if (data && data.length > 0) {
        setUsuarioAtual(data[0]);
      }
      setModalAberto(false);
    }
  };

  const enderecoFormatado = usuarioAtual ? (
    <>
      {usuarioAtual.rua ? `${usuarioAtual.rua}, ` : "Rua não informada, "}
      {usuarioAtual.n_casa || "S/N"}
      <br />
      {usuarioAtual.cidade || "Cidade não informada"}
      {usuarioAtual.estado ? ` / ${usuarioAtual.estado}` : ""}
      <br />
      CEP: {usuarioAtual.cep || "00000-000"}
    </>
  ) : (
    "Endereço não cadastrado"
  );

  return (
    <main className="profile-container">
      {/* SEÇÃO SUPERIOR: FOTO & DADOS */}
      <section className="profile-header">
        <div className="avatar-container">
          <img
            src={usuarioAtual?.avatar_url || "https://picsum.photos/200"}
            alt={`Foto de perfil de ${usuarioAtual?.nome_usuario || "Usuário"}`}
            className="profile-img"
          />

          <button
            type="button"
            className="btn-change-photo"
            title="Alterar foto de perfil"
            aria-label="Alterar foto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>

        <div className="profile-details">
          <h1 className="user-name">
            {usuarioAtual?.nome_usuario || "Carregando..."}
          </h1>

          <div className="info-box">
            <div className="info-group">
              <span className="info-label">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                E-mail
              </span>
              <p className="info-value">
                {usuarioAtual?.email || "email@exemplo.com"}
              </p>
            </div>

            <hr className="divider" />

            <div className="info-group">
              <span className="info-label">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Endereço Cadastrado
              </span>
              <p className="info-value">{enderecoFormatado}</p>
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAbrirModal}
            >
              Editar Perfil
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO INFERIOR: PRODUTOS DO USUÁRIO */}
      <section className="products-section">
        <h2 className="section-title">Seus Produtos Cadastrados</h2>

        {produtos.length === 0 ? (
          <p className="empty-message">
            Você ainda não cadastrou nenhum produto.
          </p>
        ) : (
          <div className="products-grid">
            {produtos.map((produto) => (
              <div key={produto.id} className="product-card">
                {/* Mapeado para a coluna 'imagem' definida na SQL */}
                <img
                  src={produto.imagem || "https://picsum.photos/150"}
                  alt={produto.nome}
                  className="product-img"
                />
                <div className="product-info">
                  <h3 className="product-title">{produto.nome}</h3>
                  <p className="product-price">
                    {produto.lance_atual
                      ? `Lance Atual: R$ ${Number(produto.lance_atual).toFixed(2)}`
                      : `R$ ${Number(produto.preco).toFixed(2)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE EDIÇÃO DE PERFIL */}
      {modalAberto && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button type="button" className="modal-close" onClick={handleFecharModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvarPerfil} className="modal-form">
              <div className="form-group">
                <label htmlFor="nome_usuario">Nome de Usuário</label>
                <input
                  type="text"
                  id="nome_usuario"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Nova Senha (opcional)</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Deixe em branco para manter a atual"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleFecharModal}
                  disabled={carregando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={carregando}
                >
                  {carregando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Perfil;