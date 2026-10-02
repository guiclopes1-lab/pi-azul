import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";
import { supabase } from "../supabase";

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

function Perfil() {
  const [leiloesAtivos, setLeiloesAtivos] = useState([]);
  const [leiloesParticipando, setLeiloesParticipando] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const fileInputRef = useRef(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Novos estados para o endereço
  const [rua, setRua] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [nCasa, setNCasa] = useState("");

  const [carregando, setCarregando] = useState(false);

  // =========================
  // CARREGAR DADOS
  // =========================

  async function carregaDados() {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && authUser) {
        const { data: userDataByEmail } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", authUser.email)
          .maybeSingle();

        if (userDataByEmail) {
          preencherDadosUsuario(userDataByEmail);
          carregarLeiloesAtivos(userDataByEmail.id);
          carregarLeiloesParticipando(authUser.id);
          return;
        }

        const { data: userDataById } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (userDataById) {
          preencherDadosUsuario(userDataById);
          carregarLeiloesAtivos(userDataById.id);
          carregarLeiloesParticipando(authUser.id);
          return;
        }
      } else {
        setUsuarioAtual(null);
        setLeiloesAtivos([]);
        setLeiloesParticipando([]);
        return;
      }

      const { data: dataUsuarios, error: errorUsuarios } = await supabase
        .from("usuarios")
        .select("*")
        .limit(1);

      if (errorUsuarios) {
        console.error("Erro ao carregar usuários:", errorUsuarios);
        return;
      }

      if (dataUsuarios && dataUsuarios.length > 0) {
        const usuario = dataUsuarios[0];
        preencherDadosUsuario(usuario);
        carregarLeiloesAtivos(usuario.id);
        
        let licitanteId = localStorage.getItem("licitante_id");
        carregarLeiloesParticipando(licitanteId || usuario.id);
      }
    } catch (err) {
      console.error("Erro inesperado ao carregar perfil:", err);
    }
  }

  function preencherDadosUsuario(usuario) {
    setUsuarioAtual(usuario);
    setNome(usuario.nome_usuario || "");
    setEmail(usuario.email || "");
    setRua(usuario.rua || "");
    setCep(usuario.cep || "");
    setCidade(usuario.cidade || "");
    setEstado(usuario.estado || "");
    setNCasa(usuario.n_casa || "");
  }

  // =========================
  // CARREGAR PRODUTOS E LEILÕES
  // =========================

  async function carregarLeiloesParticipando(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id_licitante", userId.toString())
      .eq("disponibilidade", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao carregar leilões que participa:", error);
      setLeiloesParticipando([]);
      return;
    }

    setLeiloesParticipando(data || []);
  }

  async function carregarLeiloesAtivos(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id_usuario", userId)
      .eq("disponibilidade", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao carregar leilões ativos:", error);
      setLeiloesAtivos([]);
      return;
    }

    setLeiloesAtivos(data || []);
  }

  useEffect(() => {
    carregaDados();
  }, []);

  // =========================
  // UPLOAD DA FOTO
  // =========================

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files?.[0];

      if (!file || !usuarioAtual?.id) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${usuarioAtual.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        alert(`Erro ao fazer upload da foto: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { data, error: updateError } = await supabase
        .from("usuarios")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", usuarioAtual.id)
        .select();

      if (updateError) {
        console.error("Erro ao atualizar foto:", updateError);
        alert(`Erro ao salvar foto: ${updateError.message}`);
        return;
      }

      if (data && data.length > 0) {
        setUsuarioAtual(data[0]);
      } else {
        setUsuarioAtual((prev) =>
          prev ? { ...prev, avatar_url: publicUrl } : null
        );
      }
    } catch (err) {
      console.error("Erro inesperado no upload:", err);
    }
  };

  // =========================
  // MODAL
  // =========================

  const handleAbrirModal = () => {
    if (usuarioAtual) {
      preencherDadosUsuario(usuarioAtual);
      setSenha("");
    }
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  // =========================
  // SALVAR PERFIL
  // =========================

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();

    if (!usuarioAtual?.id) {
      alert("Erro: usuário não identificado.");
      return;
    }

    setCarregando(true);

    try {
      // 1. Se o usuário informou uma nova senha, atualiza via Supabase Auth
      if (senha.trim() !== "") {
        const { error: authError } = await supabase.auth.updateUser({
          password: senha.trim(),
        });

        if (authError) {
          console.error("Erro ao atualizar senha no Supabase Auth:", authError);
          alert(`Erro ao atualizar senha: ${authError.message}`);
          setCarregando(false);
          return;
        }
      }

      // 2. Monta o payload sem a propriedade 'senha' para a tabela 'usuarios'
      const payload = {
        nome_usuario: nome.trim(),
        email: email.trim().toLowerCase(),
        rua: rua.trim(),
        cep: cep.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        n_casa: nCasa.trim(),
      };

      const { data, error } = await supabase
        .from("usuarios")
        .update(payload)
        .eq("id", usuarioAtual.id)
        .select();

      if (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert(`Erro ao atualizar perfil: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        alert(
          "Nenhum dado foi atualizado. Verifique as permissões do Supabase."
        );
        return;
      }

      const usuarioAtualizado = data[0];

      preencherDadosUsuario(usuarioAtualizado);
      setSenha("");

      setModalAberto(false);

      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado ao salvar perfil.");
    } finally {
      setCarregando(false);
    }
  };

  // =========================
  // SAIR
  // =========================

  const handleSair = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUsuarioAtual(null);
      setLeiloesAtivos([]);
      setLeiloesParticipando([]);
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao sair:", err);
      alert("Erro ao encerrar sessão.");
    }
  };

  // =========================
  // ENDEREÇO
  // =========================

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

  // =========================
  // TELA
  // =========================

  return (
    <main className="profile-container">
      {/* PERFIL */}
      <section className="profile-header">
        <div className="avatar-container">
          <img
            src={usuarioAtual?.avatar_url || DEFAULT_AVATAR}
            alt="Foto de perfil"
            className="profile-img"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="btn-change-photo"
            title="Alterar foto"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
                <svg
                  className="info-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
                <svg
                  className="info-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
              onClick={handleSair}
            >
              Sair
            </button>
          </div>
        </div>
      </section>

      {/* LEILÕES PARTICIPANDO */}
      <section className="products-section participating-auctions-section" style={{ marginBottom: "24px" }}>
        <div className="products-header">
          <h2 className="section-title">Leilões que Participo</h2>
          <span className="products-count">
            {leiloesParticipando.length} leil{leiloesParticipando.length !== 1 ? "ões" : "ão"}
          </span>
        </div>

        {leiloesParticipando.length === 0 ? (
          <div className="empty-products">
            <div className="empty-icon"></div>
            <h3>Nenhuma participação ativa</h3>
            <p>Você não está participando de nenhum leilão no momento.</p>
          </div>
        ) : (
          <div className="products-grid">
            {leiloesParticipando.map((leilao) => (
              <Link
                to={`/produto/${leilao.id}`}
                key={leilao.id}
                className="product-card active-auction-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-image-container">
                  <img
                    src={leilao.imagem || "https://picsum.photos/400/300"}
                    alt={leilao.nome || "Produto"}
                    className="product-img"
                  />
                  <div className="status-badge" style={{ backgroundColor: "#3b82f6" }}>Maior Lance!</div>
                </div>

                <div className="product-info">
                  <h3 className="product-title">{leilao.nome}</h3>

                  <p className="product-price">
                    {leilao.lance_atual
                      ? `R$ ${Number(leilao.lance_atual).toFixed(2)}`
                      : `R$ ${Number(leilao.preco || 0).toFixed(2)}`}
                  </p>

                  <span className="product-tag active-tag" style={{ color: "#3b82f6", borderColor: "#3b82f6" }}>
                    <span></span>
                    Na disputa
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* LEILÕES ATIVOS */}
      <section className="products-section active-auctions-section">
        <div className="products-header">
          <h2 className="section-title">Meus Leilões Ativos</h2>
          <span className="products-count">
            {leiloesAtivos.length} leil{leiloesAtivos.length !== 1 ? "ões" : "ão"}
          </span>
        </div>

        {leiloesAtivos.length === 0 ? (
          <div className="empty-products">
            <div className="empty-icon"></div>
            <h3>Nenhum leilão ativo</h3>
            <p>Nenhum leilão ativo no momento.</p>
          </div>
        ) : (
          <div className="products-grid">
            {leiloesAtivos.map((leilao) => (
              <Link
                to={`/produto/${leilao.id}`}
                key={leilao.id}
                className="product-card active-auction-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-image-container">
                  <img
                    src={leilao.imagem || "https://picsum.photos/400/300"}
                    alt={leilao.nome || "Produto"}
                    className="product-img"
                  />
                  <div className="status-badge">Em Andamento</div>
                </div>

                <div className="product-info">
                  <h3 className="product-title">{leilao.nome}</h3>

                  <p className="product-price">
                    {leilao.lance_atual
                      ? `R$ ${Number(leilao.lance_atual).toFixed(2)}`
                      : `R$ ${Number(leilao.preco || 0).toFixed(2)}`}
                  </p>

                  <span className="product-tag active-tag">
                    <span></span>
                    Ativo
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* MODAL EDITAR PERFIL */}
      {modalAberto && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button
                type="button"
                className="modal-close"
                onClick={handleFecharModal}
              >
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

              {/* ENDEREÇO */}
              <div className="form-row" style={{ display: "flex", gap: "10px" }}>
                <div className="form-group" style={{ flex: 3 }}>
                  <label htmlFor="rua">Rua</label>
                  <input
                    type="text"
                    id="rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    placeholder="Nome da rua/avenida"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="nCasa">Número</label>
                  <input
                    type="text"
                    id="nCasa"
                    value={nCasa}
                    onChange={(e) => setNCasa(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="form-row" style={{ display: "flex", gap: "10px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="cep">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                  />
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="estado">Estado (UF)</label>
                  <input
                    type="text"
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
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