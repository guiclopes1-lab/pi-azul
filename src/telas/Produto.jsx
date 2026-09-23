import React from "react";
import "./Produto.css";

function Produto() {
  return (
    <div className="body">

      {/* CONTEÚDO PRINCIPAL */}
      <main className="content">

        <div className="product-layout">

          {/* ESQUERDA - CARROSSEL */}
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

          {/* CENTRO - INFORMAÇÕES DO PRODUTO */}
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

          {/* DIREITA - ÁREA DE LANCES */}
          <div className="bid-section">

            <button
              className="btn-bid-initial"
              type="button"
            >
              lance inicial
            </button>

            <button
              className="btn-bid"
              type="button"
            >
              dar lance
            </button>

            <button
              className="btn-bid-custom"
              type="button"
            >
              colocar outro valor acima de R$ 50,00
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

                <span>:</span>

                <span className="time-box">
                  15
                </span>

                <span>:</span>

                <span className="time-box">
                  30
                </span>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Produto;