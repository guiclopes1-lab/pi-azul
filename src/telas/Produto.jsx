import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Produto.css";
import { supabase } from "../supabase";

function Produto() {
  const { id } = useParams();

  // Produto vindo do banco
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  // Carrossel
  const [slideAtual, setSlideAtual] = useState(0);

  // Lance
  const [lanceAtual, setLanceAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [pixAberto, setPixAberto] = useState(false);
  const [valorPix, setValorPix] = useState(0);
  const [novoLance, setNovoLance] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Timer
  const [tempoRestante, setTempoRestante] = useState({
    horas: "02",
    minutos: "15",
    segundos: "30",
  });

  // =========================
  // CARREGAR PRODUTO DO SUPABASE
  // =========================

  useEffect(() => {
    async function carregarProduto() {
      setCarregando(true);
      setErroCarregar("");

      let query = supabase.from("produtos").select("*");

      if (id) {
        query = query.eq("id", id);
      } else {
        query = query.eq("disponibilidade", true).order("id").limit(1);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Erro ao carregar produto:", error);
        setErroCarregar("Não foi possível carregar o produto.");
      } else if (!data) {
        setErroCarregar("Produto não encontrado.");
      } else {
        setProduto(data);
        // Se ainda não houve lance, começa pelo preço inicial
        setLanceAtual(Number(data.lance_atual ?? data.preco));
        setSlideAtual(0);
      }

      setCarregando(false);
    }

    carregarProduto();
  }, [id]);

  // =========================
  // LÓGICA DO TIMER
  // =========================

  useEffect(() => {
    // Caso a tabela 'produtos' no Supabase possua a coluna 'data_fim', utiliza ela.
    // Caso contrário, cria um tempo inicial padrão (2h 15m 30s a partir de agora).
    const dataAlvo = produto?.data_fim
      ? new Date(produto.data_fim).getTime()
      : new Date().getTime() + (2 * 3600 + 15 * 60 + 30) * 1000;

    const interval = setInterval(() => {
      const agora = new Date().getTime();
      const diferenca = dataAlvo - agora;

      if (diferenca <= 0) {
        clearInterval(interval);
        setTempoRestante({ horas: "00", minutos: "00", segundos: "00" });
      } else {
        const h = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diferenca % (1000 * 60)) / 1000);

        setTempoRestante({
          horas: String(h).padStart(2, "0"),
          minutos: String(m).padStart(2, "0"),
          segundos: String(s).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [produto]);

  // Imagens: a coluna "imagem" pode ter uma URL ou várias separadas por vírgula
  const imagens = produto?.imagem
    ? produto.imagem.split(",").map((url) => url.trim()).filter(Boolean)
    : [];

  const anterior = () =>
    setSlideAtual((s) => (s === 0 ? imagens.length - 1 : s - 1));

  const proximo = () =>
    setSlideAtual((s) => (s === imagens.length - 1 ? 0 : s + 1));

  // =========================
  // REGRAS DO LANCE
  // =========================

  const lanceMinimo = lanceAtual + 50;

  const formatarValor = (valor) => Number(valor).toFixed(2).replace(".", ",");

  const abrirModal = () => {
    if (produto && produto.disponibilidade === false) return;
    setModalAberto(true);
    setNovoLance("");
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNovoLance("");
    setErro("");
  };

  const fecharPix = () => setPixAberto(false);

  // =========================
  // CONFIRMAR LANCE -> SALVA NO BANCO -> ABRE O PIX
  // =========================

  const confirmarLance = async () => {
    const valor = Number(novoLance);

    if (!novoLance) {
      setErro("Digite um valor para o novo lance.");
      return;
    }

    if (valor < lanceMinimo) {
      setErro(`O novo lance deve ser de no mínimo R$ ${formatarValor(lanceMinimo)}.`);
      return;
    }

    setSalvando(true);

    // Garante que ninguém deu um lance maior nesse meio tempo
    const { data, error } = await supabase
      .from("produtos")
      .update({ lance_atual: valor })
      .eq("id", produto.id)
      .or(`lance_atual.is.null,lance_atual.lt.${valor}`)
      .select()
      .maybeSingle();

    setSalvando(false);

    if (error) {
      console.error("Erro ao salvar lance:", error);
      setErro("Erro ao salvar o lance. Tente novamente.");
      return;
    }

    if (!data) {
      setErro("Outro lance maior foi registrado. Atualize a página.");
      return;
    }

    setLanceAtual(valor);
    setValorPix(valor);
    setModalAberto(false);
    setPixAberto(true);
  };

  // =========================
  // PIX (payload fictício - troque por um gerado pelo seu backend)
  // =========================

  const pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136chave-pix-exemplo5204000053039865406${valorPix.toFixed(
    2
  )}5802BR5913Nome do Leilao6009SAO PAULO62070503***6304ABCD`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    pixCopiaCola
  )}`;

  // =========================
  // ESTADOS DE CARREGAMENTO / ERRO
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
          <p>{erroCarregar || "Produto não encontrado."}</p>
        </main>
      </div>
    );
  }

  const indisponivel = produto.disponibilidade === false;

  return (
    <div className="body">
      <main className="content">
        <div className="product-layout">

          {/* ESQUERDA - CARROSSEL */}
          <div className="carousel-section">
            <div className="carousel">
              <div className="slides">
                {imagens.length > 0 ? (
                  <img
                    src={imagens[slideAtual]}
                    alt={produto.nome}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="slide slide-1">Sem imagem</div>
                )}
              </div>

              {imagens.length > 1 && (
                <div className="carousel-controls">
                  <button className="btn-arrow" type="button" onClick={anterior}>
                    ←
                  </button>
                  <button className="btn-arrow" type="button" onClick={proximo}>
                    →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CENTRO - INFORMAÇÕES */}
          <div className="info-section">
            <h2 className="product-title">{produto.nome}</h2>

            {produto.categoria && (
              <p className="product-category">{produto.categoria}</p>
            )}

            <p className="product-desc">
              {produto.descricao || "Sem descrição disponível."}
            </p>
          </div>

          {/* DIREITA - ÁREA DE LANCES */}
          <div className="bid-section">
            <div className="current-bid-display">
              <span>Lance atual</span>
              <strong>R$ {formatarValor(lanceAtual)}</strong>
            </div>

            <button
              className="btn-bid"
              type="button"
              onClick={abrirModal}
              disabled={indisponivel}
            >
              {indisponivel ? "indisponível" : "dar lance"}
            </button>

            <button
              className="btn-bid-custom"
              type="button"
              onClick={abrirModal}
              disabled={indisponivel}
            >
              próximo lance mínimo de R$ {formatarValor(lanceMinimo)}
            </button>

            <div className="timer-section">
              <h3>TEMPO RESTANTE</h3>
              <div className="timer">
                <span className="time-box">{tempoRestante.horas}</span>
                <span>:</span>
                <span className="time-box">{tempoRestante.minutos}</span>
                <span>:</span>
                <span className="time-box">{tempoRestante.segundos}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MODAL DE LANCE */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={fecharModal}>
              ×
            </button>

            <h2 className="modal-title">Dar lance</h2>

            <div className="modal-current-bid">
              <span>Lance atual</span>
              <strong>R$ {formatarValor(lanceAtual)}</strong>
            </div>

            <div className="bid-rule">
              <h3>Regra do lance</h3>
              <p>
                O novo lance deve ser pelo menos
                <strong> R$ 50,00 maior </strong>
                que o lance atual.
              </p>
              <div className="minimum-value">
                <span>Lance mínimo:</span>
                <strong>R$ {formatarValor(lanceMinimo)}</strong>
              </div>
            </div>

            <label className="modal-label" htmlFor="novoLance">
              Digite seu novo lance
            </label>

            <div className="bid-input">
              <span>R$</span>
              <input
                id="novoLance"
                type="number"
                min={lanceMinimo}
                step="50"
                placeholder={formatarValor(lanceMinimo)}
                value={novoLance}
                onChange={(e) => {
                  setNovoLance(e.target.value);
                  setErro("");
                }}
              />
            </div>

            {erro && <div className="bid-error">{erro}</div>}

            <div className="modal-buttons">
              <button className="modal-cancel" type="button" onClick={fecharModal}>
                Cancelar
              </button>
              <button
                className="modal-confirm"
                type="button"
                onClick={confirmarLance}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Confirmar lance"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGAMENTO PIX */}
      {pixAberto && (
        <div className="modal-overlay" onClick={fecharPix}>
          <div className="pix-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pix-close" type="button" onClick={fecharPix}>
              ×
            </button>

            <div className="pix-header">
              <svg className="pix-icon" viewBox="0 0 24 24" width="42" height="42">
                <path
                  fill="#32BCAD"
                  d="M11.9 2.3c.9 0 1.8.4 2.5 1l3.3 3.3c.4.4 1 .4 1.4 0l.4-.4c.7-.7 1.9-.7 2.6 0 .7.7.7 1.9 0 2.6l-.4.4c-.4.4-.4 1 0 1.4l3.3 3.3c.6.6 1 1.5 1 2.4 0 .9-.4 1.8-1 2.4l-3.3 3.3c-.4.4-.4 1 0 1.4l.4.4c.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0l-.4-.4c-.4-.4-1-.4-1.4 0l-3.3 3.3c-.6.6-1.5 1-2.5 1s-1.8-.4-2.5-1l-3.3-3.3c-.4-.4-1-.4-1.4 0l-.4.4c-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6l.4-.4c.4-.4.4-1 0-1.4L.8 16.6c-.6-.6-1-1.5-1-2.4 0-.9.4-1.8 1-2.4l3.3-3.3c.4-.4.4-1 0-1.4l-.4-.4c-.7-.7-.7-1.9 0-2.6.7-.7 1.9-.7 2.6 0l.4.4c.4.4 1 .4 1.4 0l3.3-3.3c.7-.6 1.6-1 2.5-1z"
                />
              </svg>
              <span className="pix-brand">Pix</span>
              <span className="pix-powered">powered by Banco Central</span>
            </div>

            <p className="pix-value-label">Valor do lance:</p>
            <p className="pix-value">R$ {formatarValor(valorPix)}</p>

            <div className="pix-qrcode">
              <img src={qrCodeUrl} alt="QR Code Pix" width="200" height="200" />
            </div>

            <div className="pix-copia-cola">
              <input
                readOnly
                value={pixCopiaCola}
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(pixCopiaCola)}
              >
                Copiar
              </button>
            </div>

            <p className="pix-instructions">
              Pagar com o Pix é fácil, rápido e seguro!
            </p>

            <ol className="pix-steps">
              <li>Abra o aplicativo do seu banco no celular.</li>
              <li>Escolha pagar via Pix com QR Code.</li>
              <li>Aponte a câmera para o código acima ou use o "copia e cola".</li>
              <li>Confirme as informações e finalize o pagamento.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produto;