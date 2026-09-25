import React, { useEffect, useState } from "react";
import "./Produto.css";
import { supabase } from './supabase'

function Produto() {
  
     const [Produtos, setProdutos] = useState([])
        async function CarregaProduto() {
            const { data, error } = await supabase
                .from('produtos')
                .select();
    
            if (error) {
                console.error('Erro ao carregar o produto:', error);
                return;
            }
    
            setProdutos(data);
        }
        useEffect(() => {
            CarregaProduto();
        }, []);

  // Lance atual
  const [lanceAtual, setLanceAtual] = useState(50);

  // Controla a abertura do modal
  const [modalAberto, setModalAberto] = useState(false);

  // Valor digitado pelo usuário
  const [novoLance, setNovoLance] = useState("");

  // Mensagem de erro
  const [erro, setErro] = useState("");

  // =========================
  // VALOR MÍNIMO DO PRÓXIMO LANCE
  // =========================

  const lanceMinimo = lanceAtual + 50;

  // =========================
  // ABRIR MODAL
  // =========================

  const abrirModal = () => {
    setModalAberto(true);
    setNovoLance("");
    setErro("");
  };

  // =========================
  // FECHAR MODAL
  // =========================

  const fecharModal = () => {
    setModalAberto(false);
    setNovoLance("");
    setErro("");
  };

  // =========================
  // CONFIRMAR LANCE
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

    // Fecha o modal
    fecharModal();
  };

  // =========================
  // FORMATAR VALOR
  // =========================

  const formatarValor = (valor) => {
    return valor.toFixed(2).replace(".", ",");
  };

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

    </div>
  );
}

export default Produto;
