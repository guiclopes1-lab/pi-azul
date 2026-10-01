import React, { useState } from "react";
import { supabase } from "../supabase";
import "./QueroLeiloar.css";

function PublicarProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [incremento, setIncremento] = useState("50");
  const [imagem, setImagem] = useState("");

  const [duracao, setDuracao] = useState("24");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const publicarProduto = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    // =========================
    // VALIDAÇÕES
    // =========================

    if (!nome.trim()) {
      setErro("Digite o nome do produto.");
      return;
    }

    if (!categoria) {
      setErro("Selecione uma categoria.");
      return;
    }

    if (!preco || Number(preco) <= 0) {
      setErro("Digite um preço inicial válido.");
      return;
    }

    if (!duracao || Number(duracao) <= 0) {
      setErro("Escolha a duração do leilão.");
      return;
    }

    setSalvando(true);

    try {
      // =========================
      // 1. PEGAR USUÁRIO LOGADO
      // =========================

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erro ao obter usuário:", authError);
        setErro("Não foi possível identificar sua conta.");
        return;
      }

      if (!user) {
        setErro("Você precisa estar logado para publicar um produto.");
        return;
      }

      console.log("USUÁRIO AUTH:", user.id);

      // =========================
      // 2. BUSCAR USUÁRIO NA TABELA
      // =========================

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (usuarioError) {
        console.error("Erro ao buscar usuário:", usuarioError);

        setErro(
          "Seu cadastro não foi encontrado na tabela de usuários."
        );

        return;
      }

      if (!usuario) {
        setErro(
          "Seu cadastro não foi encontrado na tabela de usuários."
        );

        return;
      }

      console.log("ID DO USUÁRIO NA TABELA usuarios:", usuario.id);

      // =========================
      // 3. CALCULAR DATA DE FIM
      // =========================

      const dataFim = new Date(
        Date.now() + Number(duracao) * 60 * 60 * 1000
      );

      // =========================
      // 4. CRIAR PRODUTO
      // =========================

      const { data, error } = await supabase
        .from("produtos")
        .insert({
          // ID DA TABELA usuarios
          id_usuario: usuario.id,

          nome: nome.trim(),
          descricao: descricao.trim(),
          categoria: categoria,
          preco: Number(preco),
          lance_atual: Number(preco),
          incremento: Number(incremento) || 50,
          imagem: imagem.trim(),
          disponibilidade: true,
          data_fim: dataFim.toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao publicar produto:", error);

        setErro(
          "Não foi possível publicar o produto: " + error.message
        );

        return;
      }

      console.log("PRODUTO PUBLICADO:", data);
      console.log("PRODUTO PERTENCE AO USUÁRIO:", usuario.id);

      // =========================
      // 5. SUCESSO
      // =========================

      setSucesso(
        `Produto publicado! O leilão terminará em ${dataFim.toLocaleString(
          "pt-BR"
        )}.`
      );

      // =========================
      // 6. LIMPAR FORMULÁRIO
      // =========================

      setNome("");
      setDescricao("");
      setCategoria("");
      setPreco("");
      setIncremento("50");
      setImagem("");
      setDuracao("24");

    } catch (error) {
      console.error("Erro inesperado:", error);
      setErro("Ocorreu um erro inesperado. Tente novamente.");

    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="publicar-page">
      <main className="publicar-container">

        <h1>Publicar produto</h1>

        <p className="publicar-subtitulo">
          Cadastre o produto e escolha quanto tempo o leilão ficará aberto.
        </p>

        <form onSubmit={publicarProduto} className="produto-form">

          <div className="form-group">
            <label htmlFor="nome">
              Nome do produto
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Ex: iPhone 15 Pro"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">
              Categoria
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">
                Selecione uma categoria
              </option>

              <option value="card">
                CARD
              </option>

              <option value="figure">
                FIGURE
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">
              Descrição
            </label>

            <textarea
              id="descricao"
              placeholder="Descreva o produto..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows="5"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="preco">
                Preço inicial
              </label>

              <div className="money-input">
                <span>R$</span>

                <input
                  id="preco"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="incremento">
                Incremento do lance
              </label>

              <div className="money-input">
                <span>R$</span>

                <input
                  id="incremento"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={incremento}
                  onChange={(e) => setIncremento(e.target.value)}
                />
              </div>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="imagem">
              Imagem
            </label>

            <input
              id="imagem"
              type="text"
              placeholder="URL da imagem"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
            />

            <small>
              Você pode colocar a URL da imagem.
            </small>
          </div>

          <div className="leilao-box">

            <div className="leilao-header">
              <h2>Duração do leilão</h2>

              <p>
                Escolha por quanto tempo o produto ficará disponível
                para receber lances.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="duracao">
                Tempo do leilão
              </label>

              <select
                id="duracao"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              >
                <option value="1">
                  1 hora
                </option>

                <option value="6">
                  6 horas
                </option>

                <option value="12">
                  12 horas
                </option>

                <option value="24">
                  1 dia
                </option>

                <option value="48">
                  2 dias
                </option>

                <option value="72">
                  3 dias
                </option>

                <option value="168">
                  7 dias
                </option>
              </select>
            </div>

            <div className="duracao-info">
              <strong>
                O leilão começará imediatamente
              </strong>

              <span>
                e terminará após o período escolhido.
              </span>
            </div>

          </div>

          {erro && (
            <div className="mensagem erro">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="mensagem sucesso">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            className="btn-publicar"
            disabled={salvando}
          >
            {salvando
              ? "Publicando..."
              : "Publicar produto"}
          </button>

        </form>
      </main>
    </div>
  );
}

export default PublicarProduto;
