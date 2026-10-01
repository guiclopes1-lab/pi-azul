import React, { useEffect, useState, useRef } from "react";
import "./perfil.css";
import { supabase } from "../supabase";

// Avatar SVG estático em data URI como fallback permanente
const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

function Perfil() {
  const [produtos, setProdutos] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  // Ref para o input de arquivo oculto
  const fileInputRef = useRef(null);

  // Estados para o Modal de Edição
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Busca dados do usuário logado e seus produtos
  async function carregaDados() {
    try {
      // 1. Tentar obter usuário autenticado via Supabase Auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (!authError && authUser) {
        // Tenta buscar na tabela 'usuarios' pelo e-mail do usuário autenticado
        const { data: userDataByEmail } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", authUser.email)
          .maybeSingle();

        if (userDataByEmail) {
          setUsuarioAtual(userDataByEmail);
          setNome(userDataByEmail.nome_usuario || "");
          setEmail(userDataByEmail.email || "");
          carregarProdutosDoUsuario(userDataByEmail.id);
          return;
        }

        // Tenta buscar pelo ID caso seja compatível
        const { data: userDataById } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (userDataById) {
          setUsuarioAtual(userDataById);
          setNome(userDataById.nome_usuario || "");
          setEmail(userDataById.email || "");
          carregarProdutosDoUsuario(userDataById.id);
          return;
        }
      }

      // Fallback: Busca o primeiro usuário cadastrado na tabela 'usuarios'
      const { data: dataUsuarios, error: errorUsuarios } = await supabase
        .from("usuarios")
        .select("*")
        .limit(1);

      if (errorUsuarios) {
        console.error("Erro ao carregar usuários da tabela 'usuarios':", errorUsuarios);
        return;
      }

      if (dataUsuarios && dataUsuarios.length > 0) {
        const u = dataUsuarios[0];
        setUsuarioAtual(u);
        setNome(u.nome_usuario || "");
        setEmail(u.email || "");
        carregarProdutosDoUsuario(u.id);
      }
    } catch (err) {
      console.error("Erro inesperado ao carregar dados do perfil:", err);
    }
  }

  // Função auxiliar para buscar os produtos filtrados por id_usuario
  async function carregarProdutosDoUsuario(userId) {
    if (!userId) return;
    const { data: dataProdutos, error: errorProdutos } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId);

    const { data: prods, error: errProds } = await supabase
      .from("produtos")
      .select("*")
      .eq("id_usuario", userId);

    if (errProds) {
      console.error("Erro ao carregar produtos do usuário:", errProds);
    } else {
      setProdutos(prods || []);
    }
  }

  useEffect(() => {
    carregaDados();
  }, []);

  // Upload da foto de perfil para o Supabase Storage
  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !usuarioAtual?.id) {
        console.error("Nenhum arquivo selecionado ou usuário não identificado.");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${usuarioAtual.id}-${Date.now()}.${fileExt}`;

      // 1. Upload para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Erro no upload da foto de perfil para o bucket 'avatars':", uploadError);
        alert(`Erro ao fazer upload da foto: ${uploadError.message}`);
        return;
      }

      // 2. URL pública gerada
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Atualizar coluna avatar_url na tabela 'usuarios'
      const { data, error: updateError } = await supabase
        .from("usuarios")
        .update({ avatar_url: publicUrl })
        .eq("id", usuarioAtual.id)
        .select();

      if (updateError) {
        console.error("Erro ao atualizar avatar_url na tabela 'usuarios':", updateError);
        alert(`Erro ao salvar URL da foto: ${updateError.message}`);
        return;
      }

      // 4. Atualiza o estado imediatamente
      if (data && data.length > 0) {
        setUsuarioAtual(data[0]);
      } else {
        setUsuarioAtual((prev) => (prev ? { ...prev, avatar_url: publicUrl } : null));
      }
    } catch (err) {
      console.error("Erro inesperado no upload de avatar:", err);
    }
  };

  const handleAbrirModal = () => {
    if (usuarioAtual) {
      setNome(usuarioAtual.nome_usuario || "");
      setEmail(usuarioAtual.email || "");
      setSenha(""); // Limpa o campo de senha por segurança
    }
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();

    if (!usuarioAtual || !usuarioAtual.id) {
      console.error("Tentativa de salvar perfil sem usuarioAtual.id definido:", usuarioAtual);
      alert("Erro: ID do usuário não foi identificado.");
      return;
    }

    setCarregando(true);

    // Monta o objeto com os campos correspondentes à tabela 'usuarios'
    const payload = {
      nome_usuario: nome.trim(),
      email: email.trim().toLowerCase(),
    };

    // Apenas atualiza a senha caso o campo tenha sido preenchido
    if (senha && senha.trim() !== "") {
      payload.senha = senha.trim();
    }

    try {
      console.log("Executando update na tabela 'usuarios' para o id:", usuarioAtual.id, "Payload:", payload);

      // Executa a atualização no Supabase filtrando pela chave primária 'id'
      const { data, error } = await supabase
        .from("usuarios")
        .update(payload)
        .eq("id", usuarioAtual.id)
        .select();

      if (error) {
        console.error("Erro ao atualizar perfil na tabela 'usuarios':", error);
        alert(`Erro ao atualizar perfil no banco de dados: ${error.message}`);
        setCarregando(false);
        return;
      }

      if (!data || data.length === 0) {
        console.error(
          "Nenhum registro foi atualizado na tabela 'usuarios'. Verifique se a RLS permite UPDATE na tabela 'usuarios' e se o id coincide com o banco de dados:",
          { id: usuarioAtual.id, payload }
        );
        alert("A alteração não foi gravada. Verifique se as permissões (RLS) da tabela 'usuarios' no Supabase permitem atualização.");
        setCarregando(false);
        return;
      }

      const usuarioAtualizado = data[0];
      console.log("Perfil atualizado com sucesso no Supabase:", usuarioAtualizado);

      // Atualiza o estado da tela imediatamente com os dados retornados do Supabase
      setUsuarioAtual(usuarioAtualizado);
      setNome(usuarioAtualizado.nome_usuario || "");
      setEmail(usuarioAtualizado.email || "");
      setSenha("");
      setModalAberto(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro inesperado ao salvar perfil:", err);
      alert("Erro inesperado ao salvar perfil.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSair = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redireciona para a página inicial após sair (ajuste a rota se necessário)
      window.location.href = "/"; 
    } catch (err) {
      console.error("Erro ao sair:", err);
      alert("Erro ao encerrar sessão.");
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
            src={usuarioAtual?.avatar_url || DEFAULT_AVATAR}
            alt={`Foto de perfil de ${usuarioAtual?.nome_usuario || "Usuário"}`}
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
            title="Alterar foto de perfil"
            aria-label="Alterar foto"
            onClick={() => fileInputRef.current?.click()}
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
              onClick={handleSair}
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
                <img
                  src={produto.imagem || "https://picsum.photos/150"}
                  alt={produto.nome}
                  className="product-img"
                  style={{ width: "100%", maxWidth: "280px", height: "280px", objectFit: "contain" }}
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