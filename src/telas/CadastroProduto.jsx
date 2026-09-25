import React, { useEffect, useState } from "react";
import "./CadastroProduto";
import { supabase } from '../supabase'

function Produto() {

     const [Produtos, setProdutos] = useState([])
        async function CarregaProduto() {
            const { data, error } = await supabase
                .from('produtos')
                .select();

            if (error) {
                console.error('Erro ao carregar produtos:', error);
                return;
            }

            setProdutos(data);
        }
        useEffect(() => {
            CarregaProduto();
        }, []);

  // Lance atual
  const [lanceAtual, setLanceAtual] = useState(50);

  // Controla a abertura do modal de lance
  const [modalAberto, setModalAberto] = useState(false);

  // Controla a abertura do modal de pagamento Pix
  const [pixAberto, setPixAberto] = useState(false);

  // Valor que será cobrado no Pix (o lance confirmado)
  const [valorPix, setValorPix] = useState(0);

  // Valor digitado pelo usuário
  const [novoLance, setNovoLance] = useState("");

  // Mensagem de erro
  const [erro, setErro] = useState("");

  // =========================
  // VALOR MÍNIMO DO PRÓXIMO LANCE
  // =========================

  const lanceMinimo = lanceAtual + 50;

  // =========================
  // ABRIR MODAL DE LANCE
  // =========================

  const abrirModal = () => {
    setModalAberto(true);
    setNovoLance("");
    setErro("");
  };

  // =========================
  // FECHAR MODAL DE LANCE
  // =========================

  const fecharModal = () => {
    setModalAberto(false);
    setNovoLance("");
    setErro("");
  };

  // =========================
  // FECHAR MODAL DE PIX
  // =========================

  const fecharPix = () => {
    setPixAberto(false);
  };

  // =========================
  // CONFIRMAR LANCE -> ABRE O PIX
  // =========================

  const confirmarLance = () => {
    const valor = Number(novoLance);

    // Campo vazio
    if (!novoLance) {
      setErro("Digite um valor para o novo lance.");
      return;
    }

    // Valor menor que o permitido
    if (valor < lanceMinimo) {
      setErro(
        `O novo lance deve ser de no mínimo R$ ${lanceMinimo
          .toFixed(2)
          .replace(".", ",")}.`
      );
      return;
    }

    // Atualiza o lance atual
    setLanceAtual(valor);

    // Guarda o valor que vai para o Pix
    setValorPix(valor);

    // Fecha o modal de lance e abre o Pix
    setModalAberto(false);
    setPixAberto(true);
  };

  // =========================
  // FORMATAR VALOR
  // =========================

  const formatarValor = (valor) => {
    return valor.toFixed(2).replace(".", ",");
  };

  // Código Pix fictício usado para gerar o QR Code.
  // Troque por um payload Pix real (copia e cola) gerado pelo seu backend.
  const pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136chave-pix-exemplo5204000053039865406${valorPix.toFixed(
    2
  )}5802BR5913Nome do Leilao6009SAO PAULO62070503***6304ABCD`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    pixCopiaCola
  )}`;

  return (
    <div className="body">

      {/* =========================
          CONTEÚDO PRINCIPAL
      ========================= */}

      <main className="content">

        <div className="product-layout">

          {/* =========================
              ESQUERDA - CARROSSEL
          ========================= */}

          <div className="carousel-section">

            <div className="carousel">

              <div className="slides">

                <div className="slide slide-1">
                  Imagem 1
                </div>

                <div className="slide slide-2">
                  Imagem 2
                </div>

                <div className="slide slide-3">
                  Imagem 3
                </div>

              </div>

              {/* BOTÕES DO CARROSSEL */}

              <div className="carousel-controls">

                <button
                  className="btn-arrow"
                  type="button"
                >
                  ←
                </button>

                <button
                  className="btn-arrow"
                  type="button"
                >
                  →
                </button>

              </div>

            </div>

          </div>


          {/* =========================
              CENTRO - INFORMAÇÕES
          ========================= */}

          <div className="info-section">

            <h2 className="product-title">
              Nome do item
            </h2>

            <p className="product-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Etiam eget ligula eu lectus lobortis condimentum.
              Aliquam nonummy auctor massa. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis
              egestas. Nulla at risus. Quisque purus magna, auctor et,
              sagittis ac, posuere eu, lectus. Nam mattis, felis ut
              adipiscing.
            </p>

          </div>


          {/* =========================
              DIREITA - ÁREA DE LANCES
          ========================= */}

          <div className="bid-section">

            {/* LANCE ATUAL */}

            <div className="current-bid-display">

              <span>
                Lance atual
              </span>

              <strong>
                R$ {formatarValor(lanceAtual)}
              </strong>

            </div>


            {/* BOTÃO DAR LANCE */}

            <button
              className="btn-bid"
              type="button"
              onClick={abrirModal}
            >
              dar lance
            </button>


            {/* PRÓXIMO LANCE */}

            <button
              className="btn-bid-custom"
              type="button"
              onClick={abrirModal}
            >
              próximo lance mínimo de R$ {formatarValor(lanceMinimo)}
            </button>


            {/* TIMER */}

            <div className="timer-section">

              <h3>
                TEMPO RESTANTE
              </h3>

              <div className="timer">

                <span className="time-box">
                  02
                </span>

                <span>
                  :
                </span>

                <span className="time-box">
                  15
                </span>

                <span>
                  :
                </span>

                <span className="time-box">
                  30
                </span>

              </div>

            </div>

          </div>

        </div>

      </main>


      {/* =========================
          MODAL DE LANCE
      ========================= */}

      {modalAberto && (

        <div
          className="modal-overlay"
          onClick={fecharModal}
        >

          <div
            className="bid-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* BOTÃO FECHAR */}

            <button
              className="modal-close"
              type="button"
              onClick={fecharModal}
            >
              ×
            </button>


            {/* TÍTULO */}

            <h2 className="modal-title">
              Dar lance
            </h2>


            {/* LANCE ATUAL */}

            <div className="modal-current-bid">

              <span>
                Lance atual
              </span>

              <strong>
                R$ {formatarValor(lanceAtual)}
              </strong>

            </div>


            {/* REGRA */}

            <div className="bid-rule">

              <h3>
                Regra do lance
              </h3>

              <p>
                O novo lance deve ser pelo menos
                <strong> R$ 50,00 maior </strong>
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


            {/* NOVO LANCE */}

            <label
              className="modal-label"
              htmlFor="novoLance"
            >
              Digite seu novo lance
            </label>


            <div className="bid-input">

              <span>
                R$
              </span>

              <input
                id="novoLance"
                type="number"
                min={lanceMinimo}
                step="50"
                placeholder={formatarValor(lanceMinimo)}
                value={novoLance}
                onChange={(event) => {
                  setNovoLance(event.target.value);
                  setErro("");
                }}
              />

            </div>


            {/* ERRO */}

            {erro && (

              <div className="bid-error">
                {erro}
              </div>

            )}


            {/* BOTÕES DO MODAL */}

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
              >
                Confirmar lance
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          MODAL DE PAGAMENTO PIX
      ========================= */}

      {pixAberto && (

        <div
          className="modal-overlay"
          onClick={fecharPix}
        >

          <div
            className="pix-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* BOTÃO FECHAR */}

            <button
              className="pix-close"
              type="button"
              onClick={fecharPix}
            >
              ×
            </button>

            {/* CABEÇALHO */}

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

            {/* VALOR */}

            <p className="pix-value-label">Valor do lance:</p>
            <p className="pix-value">R$ {formatarValor(valorPix)}</p>

            {/* QR CODE */}

            <div className="pix-qrcode">
              <img src={qrCodeUrl} alt="QR Code Pix" width="200" height="200" />
            </div>

            {/* CÓDIGO COPIA E COLA */}

            <div className="pix-copia-cola">
              <input
                readOnly
                value={pixCopiaCola}
                onFocus={(event) => event.target.select()}
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