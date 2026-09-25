import { useEffect, useState } from "react";
import "./QueroLeiloar.css";
import { supabase } from '../supabase'


function CadastroProduto() {

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



  const [imagens, setImagens] = useState([]);

  function selecionarImagens(event) {
    const arquivos = Array.from(event.target.files);

    const novasImagens = arquivos.map((arquivo) => ({
      arquivo,
      url: URL.createObjectURL(arquivo),
    }));

    setImagens((prev) => [...prev, ...novasImagens].slice(0, 3));
  }

  function cadastrarProduto(event) {
    event.preventDefault();

    alert("Produto cadastrado com sucesso!");
  }

  return (
    <div className="pagina-produto">
      <div className="card-produto">

        <h1>Cadastrar produto</h1>

        <form onSubmit={cadastrarProduto}>

          {/* IMAGENS */}
          <div className="campo-imagens">
            <label>Imagens do produto</label>

            <label className="area-upload">
              <input
                type="file"
                accept="image/png, image/jpeg"
                multiple
                onChange={selecionarImagens}
              />

              {imagens.length === 0 ? (
                <>
                  <div className="icone-imagem">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>

                  <span className="texto-upload">
                    Arraste as imagens aqui ou clique para enviar
                  </span>

                  <span className="formatos">
                    PNG ou JPG
                  </span>
                </>
              ) : (
                <>
                  <span className="texto-upload">
                    Clique para adicionar mais imagens
                  </span>
                </>
              )}

              <div className="preview-imagens">

                {imagens.map((imagem, index) => (
                  <img
                    key={index}
                    src={imagem.url}
                    alt={`Produto ${index + 1}`}
                  />
                ))}

                {imagens.length < 3 && (
                  <span className="botao-adicionar">
                    +
                  </span>
                )}

              </div>
            </label>
          </div>

          {/* NOME */}
          <div className="campo">
            <label htmlFor="nome">Nome do produto</label>

            <input
              id="nome"
              type="text"
              placeholder="Relógio de bolso antigo"
              required
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="campo">
            <label htmlFor="descricao">
              Descrição do produto
            </label>

            <textarea
              id="descricao"
              placeholder="Descreva o estado, a origem e outros detalhes do produto..."
              required
            ></textarea>
          </div>

          {/* VALOR */}
          <div className="campo">
            <label htmlFor="valor">
              Valor inicial do lance
            </label>

            <div className="campo-valor">
              <span>R$</span>

              <input
                id="valor"
                type="number"
                step="0.01"
                placeholder="50,00"
                required
              />
            </div>
          </div>

          {/* INCREMENTO */}
          <div className="campo">
            <label htmlFor="incremento">
              Incremento mínimo por lance
            </label>

            <div className="campo-valor">
              <span>R$</span>

              <input
                id="incremento"
                type="number"
                step="0.01"
                placeholder="50,00"
                required
              />
            </div>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="botao-cadastrar"
          >
            Cadastrar produto
          </button>

        </form>

      </div>

      <div className="botao-baixo">
        ↓
      </div>

    </div>
  );
}

export default CadastroProduto;