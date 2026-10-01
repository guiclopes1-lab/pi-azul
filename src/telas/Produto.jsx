import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Produto.css";
import { supabase } from "../supabase";

// Identifica quem está dando o lance
async function obterIdLicitante() {
  try {
    const { data } = await supabase.auth.getUser();

    if (data?.user?.id) {
      return data.user.id;
    }
  } catch (e) {
    // Sem login, segue para o ID local
  }

  let idLocal = localStorage.getItem("licitante_id");

  if (!idLocal) {
    idLocal = crypto.randomUUID();
    localStorage.setItem("licitante_id", idLocal);
  }

  return idLocal;
}

function Produto() {
  const { id } = useParams();

  // Produto vindo do banco
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  // Quem sou eu
  const [meuId, setMeuId] = useState(null);

  // Verifica se sou o dono do produto
  const [souDono, setSouDono] = useState(false);

  // Carrossel
  const [slideAtual, setSlideAtual] = useState(0);

  // Lance
  const [lanceAtual, setLanceAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [pixAberto, setPixAberto] = useState(false);
  const [novoLance, setNovoLance] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Timer
  const [encerrado, setEncerrado] = useState(false);

  const [tempoRestante, setTempoRestante] = useState({
    horas: "--",
    minutos: "--",
    segundos: "--",
  });

  // =========================
  // IDENTIFICAR USUÁRIO
  // =========================

  useEffect(() => {
    obterIdLicitante().then(setMeuId);
  }, []);

  // =========================
  // CARREGAR PRODUTO
  // =========================

  useEffect(() => {
    async function carregarProduto() {
      setCarregando(true);
      setErroCarregar("");

      let query = supabase.from("produtos").select("*");

      if (id) {
        query = query.eq("id", id);
      } else {
        query = query
          .eq("disponibilidade", true)
          .order("id")
          .limit(1);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Erro ao carregar produto:", error);
        setErroCarregar("Não foi possível carregar o produto.");
      } else if (!data) {
        setErroCarregar("Produto não encontrado.");
      } else {
        setProduto(data);
        setLanceAtual(Number(data.lance_atual ?? data.preco));
        setSlideAtual(0);
      }

      setCarregando(false);
    }

    carregarProduto();
  }, [id]);

  // =========================
  // VERIFICAR SE SOU O DONO
  // =========================

  useEffect(() => {
    async function verificarDono() {
      if (!produto?.id_usuario) {
        setSouDono(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
          setSouDono(false);
          return;
        }

        // Busca o usuário logado na tabela usuarios
        const { data: usuario, error } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (error) {
          console.error("Erro ao verificar dono:", error);
          setSouDono(false);
          return;
        }

        if (!usuario) {
          setSouDono(false);
          return;
        }

        // Compara o dono do produto com o usuário logado
        const dono =
          String(usuario.id) === String(produto.id_usuario);

        setSouDono(dono);
      } catch (error) {
        console.error("Erro ao verificar proprietário:", error);
        setSouDono(false);
      }
    }

    verificarDono();
  }, [produto]);

  // =========================
  // TIMER
  // =========================

  const dataFim = produto?.data_fim;

  useEffect(() => {
    if (!dataFim) {
      setEncerrado(false);

      setTempoRestante({
        horas: "--",
        minutos: "--",
        segundos: "--",
      });

      return;
    }

    const alvo = new Date(dataFim).getTime();

    function atualizar() {
      const diferenca = alvo - Date.now();

      if (diferenca <= 0) {
        setTempoRestante({
          horas: "00",
          minutos: "00",
          segundos: "00",
        });

        setEncerrado(true);

        return true;
      }

      const h = Math.floor(
        diferenca / (1000 * 60 * 60)
      );

      const m = Math.floor(
        (diferenca % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const s = Math.floor(
        (diferenca % (1000 * 60)) / 1000
      );

      setTempoRestante({
        horas: String(h).padStart(2, "0"),
        minutos: String(m).padStart(2, "0"),
        segundos: String(s).padStart(2, "0"),
      });

      setEncerrado(false);

      return false;
    }

    if (atualizar()) return;

    const interval = setInterval(() => {
      if (atualizar()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dataFim]);

  // =========================
  // RECARREGAR AO TERMINAR
  // =========================

  useEffect(() => {
    if (!encerrado || !produto?.id) return;

    async function recarregar() {
      const { data } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", produto.id)
        .maybeSingle();

      if (data) {
        setProduto(data);
        setLanceAtual(
          Number(data.lance_atual ?? data.preco)
        );
      }
    }

    recarregar();
  }, [encerrado]);

  // =========================
  // VENCEDOR
  // =========================

  const euVenci =
    encerrado &&
    !!meuId &&
    !!produto?.id_licitante &&
    produto.id_licitante === meuId;

  const estouVencendo =
    !encerrado &&
    !!meuId &&
    !!produto?.id_licitante &&
    produto.id_licitante === meuId;

  useEffect(() => {
    if (euVenci) {
      setPixAberto(true);
    }
  }, [euVenci]);

  // =========================
  // IMAGENS
  // =========================

  const imagens = produto?.imagem
    ? produto.imagem.startsWith("data:")
      ? [produto.imagem]
      : produto.imagem
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
    : [];

  const anterior = () => {
    setSlideAtual((s) =>
      s === 0 ? imagens.length - 1 : s - 1
    );
  };

  const proximo = () => {
    setSlideAtual((s) =>
      s === imagens.length - 1 ? 0 : s + 1
    );
  };

  // =========================
  // REGRAS DO LANCE
  // =========================

  const incremento = Number(
    produto?.incremento ?? 50
  );

  const lanceMinimo = lanceAtual + incremento;

  const formatarValor = (valor) =>
    Number(valor)
      .toFixed(2)
      .replace(".", ",");

  // AGORA O DONO TAMBÉM É CONSIDERADO INDISPONÍVEL
  const indisponivel =
    produto?.disponibilidade === false ||
    encerrado ||
    souDono;

  // =========================
  // ABRIR MODAL
  // =========================

  const abrirModal = () => {
    // Impede o próprio dono de dar lance
    if (souDono) {
      return;
    }

    if (indisponivel) {
      return;
    }

    setModalAberto(true);
    setNovoLance("");
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNovoLance("");
    setErro("");
  };

  const fecharPix = () => {
    setPixAberto(false);
  };

  // =========================
  // CONFIRMAR LANCE
  // =========================

  const confirmarLance = async () => {
    // SEGURANÇA EXTRA:
    // mesmo que alguém consiga abrir o modal,
    // o dono não poderá salvar o lance.
    if (souDono) {
      setErro(
        "Você não pode dar lance no seu próprio produto."
      );
      return;
    }

    const valor = Number(novoLance);

    if (!meuId) {
      setErro(
        "Aguarde um instante e tente novamente."
      );
      return;
    }

    if (!novoLance) {
      setErro(
        "Digite um valor para o novo lance."
      );
      return;
    }

    if (valor < lanceMinimo) {
      setErro(
        `O novo lance deve ser de no mínimo R$ ${formatarValor(
          lanceMinimo
        )}.`
      );
      return;
    }

    setSalvando(true);

    let query = supabase
      .from("produtos")
      .update({
        lance_atual: valor,
        id_licitante: meuId,
      })
      .eq("id", produto.id)
      .or(
        `lance_atual.is.null,lance_atual.lt.${valor}`
      );

    if (produto.data_fim) {
      query = query.gt(
        "data_fim",
        new Date().toISOString()
      );
    }

    const { data, error } = await query
      .select()
      .maybeSingle();

    if (error) {
      setSalvando(false);

      console.error(
        "Erro ao salvar lance:",
        error
      );

      setErro(
        "Erro ao salvar o lance: " +
          error.message
      );

      return;
    }

    if (!data) {
      const { data: atual } = await supabase
        .from("produtos")
        .select("lance_atual, data_fim")
        .eq("id", produto.id)
        .maybeSingle();

      setSalvando(false);

      if (
        atual?.data_fim &&
        new Date(atual.data_fim).getTime() <=
          Date.now()
      ) {
        setErro("O leilão já terminou.");
      } else if (
        atual &&
        atual.lance_atual !== null &&
        Number(atual.lance_atual) >= valor
      ) {
        setLanceAtual(
          Number(atual.lance_atual)
        );

        setErro(
          "Outro lance maior foi registrado. Tente um valor maior."
        );
      } else {
        setErro(
          "Não foi possível salvar o lance. Verifique a policy de UPDATE da tabela produtos no Supabase."
        );
      }

      return;
    }

    setSalvando(false);
    setProduto(data);
    setLanceAtual(valor);
    setModalAberto(false);
  };

  // =========================
  // PIX
  // =========================

  const pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136chave-pix-exemplo5204000053039865406${lanceAtual.toFixed(
    2
  )}5802BR5913Nome do Leilao6009SAO PAULO62070503***6304ABCD`;

  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      pixCopiaCola
    )}`;

  // =========================
  // CARREGANDO
  // =========================

  if (carregando) {
    return (
      <div className="body">
        <main className="content">
          <p>Carregando produto...</p>
        </main>
      </div>
    );
  }

  if (erroCarregar || !produto) {
    return (
      <div className="body">
        <main className="content">
          <p>
            {erroCarregar ||
              "Produto não encontrado."}
          </p>
        </main>
      </div>
    );
  }

  const estiloAviso = {
    padding: "10px 12px",
    borderRadius: "8px",
    margin: "12px 0",
    fontWeight: 600,
    textAlign: "center",
  };

  return (
    <div className="body">
      <main className="content">

        <div className="product-layout">

          {/* =========================
              ESQUERDA - CARROSSEL
          ========================= */}

          <div className="carousel-section">
            <div className="carousel">

              <div className="slides">
                {imagens.length > 0 ? (
                  <img
                    src={imagens[slideAtual]}
                    alt={produto.nome}
                  />
                ) : (
                  <div className="slide slide-1">
                    Sem imagem
                  </div>
                )}
              </div>

              {imagens.length > 1 && (
                <div className="carousel-controls">

                  <button
                    className="btn-arrow"
                    type="button"
                    onClick={anterior}
                  >
                    ←
                  </button>

                  <button
                    className="btn-arrow"
                    type="button"
                    onClick={proximo}
                  >
                    →
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* =========================
              CENTRO - INFORMAÇÕES
          ========================= */}

          <div className="info-section">

            <h2 className="product-title">
              {produto.nome}
            </h2>

            {produto.categoria && (
              <p className="product-category">
                {produto.categoria}
              </p>
            )}

            <p className="product-desc">
              {produto.descricao ||
                "Sem descrição disponível."}
            </p>

          </div>

          {/* =========================
              DIREITA - LANCES
          ========================= */}

          <div className="bid-section">

            <div className="current-bid-display">
              <span>
                {encerrado
                  ? "Lance vencedor"
                  : "Lance atual"}
              </span>

              <strong>
                R$ {formatarValor(lanceAtual)}
              </strong>
            </div>

            {/* AVISO PARA O DONO */}
            {souDono && !encerrado && (
              <div className="seller-warning">
                Você publicou este produto.
                <br />
                Não é possível dar lance no seu próprio produto.
              </div>
            )}

            {estouVencendo && (
              <div
                style={{
                  ...estiloAviso,
                  background: "#e6f7ee",
                  color: "#1a7f4b",
                }}
              >
                Você está com o maior lance!
              </div>
            )}

            {encerrado &&
              !produto.id_licitante && (
                <div
                  style={{
                    ...estiloAviso,
                    background: "#f0f0f0",
                    color: "#555",
                  }}
                >
                  Leilão encerrado sem lances.
                </div>
              )}

            {encerrado &&
              produto.id_licitante &&
              !euVenci && (
                <div
                  style={{
                    ...estiloAviso,
                    background: "#f0f0f0",
                    color: "#555",
                  }}
                >
                  Leilão encerrado.
                  Outro participante venceu.
                </div>
              )}

            {/* BOTÃO PAGAR PARA O VENCEDOR */}
            {euVenci && (
              <button
                className="btn-bid"
                type="button"
                onClick={() =>
                  setPixAberto(true)
                }
              >
                pagar agora
              </button>
            )}

            {/* BOTÃO DE DAR LANCE */}
            {!euVenci && !souDono && (
              <button
                className="btn-bid"
                type="button"
                onClick={abrirModal}
                disabled={indisponivel}
              >
                {encerrado
                  ? "leilão encerrado"
                  : "dar lance"}
              </button>
            )}

            {/* MENSAGEM CASO SEJA O DONO */}
            {souDono && !encerrado && (
              <button
                className="btn-bid seller-disabled"
                type="button"
                disabled
              >
                você é o vendedor
              </button>
            )}

            {/* PRÓXIMO LANCE */}
            {!indisponivel && !souDono && (
              <button
                className="btn-bid-custom"
                type="button"
                onClick={abrirModal}
              >
                próximo lance mínimo de R${" "}
                {formatarValor(lanceMinimo)}
              </button>
            )}

            {/* TIMER */}
            <div className="timer-section">

              <h3>
                TEMPO RESTANTE
              </h3>

              <div className="timer">

                <span className="time-box">
                  {tempoRestante.horas}
                </span>

                <span>:</span>

                <span className="time-box">
                  {tempoRestante.minutos}
                </span>

                <span>:</span>

                <span className="time-box">
                  {tempoRestante.segundos}
                </span>

              </div>

            </div>

          </div>
        </div>
      </main>

      {/* =========================
          MODAL DE LANCE
      ========================= */}

      {modalAberto && !souDono && (
        <div
          className="modal-overlay"
          onClick={fecharModal}
        >
          <div
            className="bid-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              type="button"
              onClick={fecharModal}
            >
              ×
            </button>

            <h2 className="modal-title">
              Dar lance
            </h2>

            <div className="modal-current-bid">

              <span>
                Lance atual
              </span>

              <strong>
                R$ {formatarValor(lanceAtual)}
              </strong>

            </div>

            <div className="bid-rule">

              <h3>
                Regra do lance
              </h3>

              <p>
                O novo lance deve ser pelo menos{" "}
                <strong>
                  R$ {formatarValor(incremento)} maior
                </strong>{" "}
                que o lance atual.
              </p>

              <div className="minimum-value">

                <span>
                  Lance mínimo:
                </span>

                <strong>
                  R$ {formatarValor(lanceMinimo)}
                </strong>

              </div>

            </div>

            <label
              className="modal-label"
              htmlFor="novoLance"
            >
              Digite seu novo lance
            </label>

            <div className="bid-input">

              <span>R$</span>

              <input
                id="novoLance"
                type="number"
                min={lanceMinimo}
                step="0.01"
                placeholder={formatarValor(
                  lanceMinimo
                )}
                value={novoLance}
                onChange={(e) => {
                  setNovoLance(
                    e.target.value
                  );
                  setErro("");
                }}
              />

            </div>

            {erro && (
              <div className="bid-error">
                {erro}
              </div>
            )}

            <div className="modal-buttons">

              <button
                className="modal-cancel"
                type="button"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                className="modal-confirm"
                type="button"
                onClick={confirmarLance}
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : "Confirmar lance"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          MODAL PIX
      ========================= */}

      {pixAberto && euVenci && (
        <div
          className="modal-overlay"
          onClick={fecharPix}
        >

          <div
            className="pix-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="pix-close"
              type="button"
              onClick={fecharPix}
            >
              ×
            </button>

            <h2
              style={{
                textAlign: "center",
                marginBottom: "4px",
              }}
            >
              🎉 Parabéns! Você ganhou o leilão!
            </h2>

            <p
              style={{
                textAlign: "center",
                marginTop: 0,
              }}
            >
              Produto:{" "}
              <strong>
                {produto.nome}
              </strong>
            </p>

            <div className="pix-header">

              <svg
                className="pix-icon"
                viewBox="0 0 24 24"
                width="42"
                height="42"
              >
                <path
                  fill="#32BCAD"
                  d="M11.9 2.3c.9 0 1.8.4 2.5 1l3.3 3.3c.4.4 1 .4 1.4 0l.4-.4c.7-.7 1.9-.7 2.6 0 .7.7.7 1.9 0 2.6l-.4.4c-.4.4-.4 1 0 1.4l3.3 3.3c.6.6 1 1.5 1 2.4 0 .9-.4 1.8-1 2.4l-3.3 3.3c-.4.4-.4 1 0 1.4l.4.4c.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0l-.4-.4c-.4-.4-1-.4-1.4 0l-3.3 3.3c-.6.6-1.5 1-2.5 1s-1.8-.4-2.5-1l-3.3-3.3c-.4-.4-1-.4-1.4 0l-.4.4c-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6l.4-.4c.4-.4.4-1 0-1.4L.8 16.6c-.6-.6-1-1.5-1-2.4 0-.9.4-1.8 1-2.4l3.3-3.3c.4-.4.4-1 0-1.4l-.4-.4c-.7-.7-.7-1.9 0-2.6.7-.7 1.9-.7 2.6 0l.4.4c.4.4 1 .4 1.4 0l3.3-3.3c.7-.6 1.6-1 2.5-1z"
                />
              </svg>

              <span className="pix-brand">
                Pix
              </span>

              <span className="pix-powered">
                powered by Banco Central
              </span>

            </div>

            <p className="pix-value-label">
              Valor a pagar:
            </p>

            <p className="pix-value">
              R$ {formatarValor(lanceAtual)}
            </p>

            <div className="pix-qrcode">
              <img
                src={qrCodeUrl}
                alt="QR Code Pix"
                width="200"
                height="200"
              />
            </div>

            <div className="pix-copia-cola">

              <input
                readOnly
                value={pixCopiaCola}
                onFocus={(e) =>
                  e.target.select()
                }
              />

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    pixCopiaCola
                  )
                }
              >
                Copiar
              </button>

            </div>

            <p className="pix-instructions">
              Pagar com o Pix é fácil, rápido e seguro!
            </p>

            <ol className="pix-steps">

              <li>
                Abra o aplicativo do seu banco no celular.
              </li>

              <li>
                Escolha pagar via Pix com QR Code.
              </li>

              <li>
                Aponte a câmera para o código acima ou use o "copia e cola".
              </li>

              <li>
                Confirme as informações e finalize o pagamento.
              </li>

            </ol>

          </div>
        </div>
      )}

    </div>
  );
}

export default Produto;