import { useState } from "react";
import "./QueroLeiloar.css";
import { supabase } from "../supabase";

function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [incremento, setIncremento] = useState("");

  const [categoria, setCategoria] = useState("");
  const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");

  const [carregando, setCarregando] = useState(false);

  const opcoesCategoria = ["card", "figure"];

  function escolherCategoria(valor) {
    setCategoria(valor);
    setMenuCategoriaAberto(false);
  }

  function selecionarImagem(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) {
      return;
    }

    // Aceita somente JPG e PNG
    if (
      arquivo.type !== "image/jpeg" &&
      arquivo.type !== "image/png"
    ) {
      alert("Selecione uma imagem JPG ou PNG.");
      return;
    }

    // Limite de 2 MB
    if (arquivo.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setImagem(arquivo);

    const url = URL.createObjectURL(arquivo);
    setPreview(url);
  }

  function imagemParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(arquivo);
    });
  }

  async function cadastrarProduto(event) {
    event.preventDefault();

    const formulario = event.target;

    if (carregando) {
      return;
    }

    // Validações
    if (!nome.trim()) {
      alert("Digite o nome do produto.");
      return;
    }

    if (!descricao.trim()) {
      alert("Digite a descrição do produto.");
      return;
    }

    if (!preco || Number(preco) <= 0) {
      alert("Digite um valor inicial válido.");
      return;
    }

    if (!incremento || Number(incremento) <= 0) {
      alert("Digite um incremento válido.");
      return;
    }

    if (!imagem) {
      alert("Selecione uma imagem do produto.");
      return;
    }

    try {
      setCarregando(true);

      // Converte a imagem para texto
      const imagemBase64 = await imagemParaBase64(imagem);

      /*
       * Cadastro na tabela produtos
       */
      const { data, error } = await supabase
        .from("produtos")
        .insert([
          {
            nome: nome.trim(),

            preco: Number(preco),

            imagem: imagemBase64,

            descricao: descricao.trim(),

            disponibilidade: true,

            categoria: categoria || null,

            id_usuario: null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("ERRO SUPABASE:", error);

        alert(
          "Erro ao cadastrar produto:\n\n" +
          error.message
        );

        return;
      }

      console.log("Produto cadastrado:", data);

      alert("Produto cadastrado com sucesso!");

      // Limpa os campos
      setNome("");
      setDescricao("");
      setPreco("");
      setIncremento("");
      setCategoria("");
      setMenuCategoriaAberto(false);
      setImagem(null);
      setPreview("");

      // Limpa o input de arquivo
      formulario.reset();

    } catch (error) {
      console.error("ERRO:", error);

      alert(
        "Ocorreu um erro ao cadastrar o produto."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-produto">

      <div className="card-produto">

        <h1>Cadastrar produto</h1>

        <form onSubmit={cadastrarProduto}>

          {/* IMAGEM */}

          <div className="campo-imagens">

            <label>
              Imagem do produto
            </label>

            <label className="area-upload">

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={selecionarImagem}
                disabled={carregando}
              />

              {!preview ? (
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

                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                      />

                      <circle
                        cx="8.5"
                        cy="8.5"
                        r="1.5"
                      />

                      <path d="M21 15l-5-5L5 21" />

                    </svg>

                  </div>

                  <span className="texto-upload">
                    Clique para selecionar uma imagem
                  </span>

                  <span className="formatos">
                    PNG ou JPG - máximo 2 MB
                  </span>
                </>
              ) : (
                <div className="preview-imagens">

                  <img
                    src={preview}
                    alt="Preview do produto"
                  />

                </div>
              )}

            </label>

          </div>

          {/* NOME */}

          <div className="campo">

            <label htmlFor="nome">
              Nome do produto
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Relógio de bolso antigo"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              disabled={carregando}
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
              value={descricao}
              onChange={(event) =>
                setDescricao(event.target.value)
              }
              disabled={carregando}
              required
            />

          </div>

          {/* PREÇO */}

          <div className="campo">

            <label htmlFor="valor">
              Valor inicial do lance
            </label>

            <div className="campo-valor">

              <span>R$</span>

              <input
                id="valor"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="50.00"
                value={preco}
                onChange={(event) =>
                  setPreco(event.target.value)
                }
                disabled={carregando}
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
                min="0.01"
                step="0.01"
                placeholder="5.00"
                value={incremento}
                onChange={(event) =>
                  setIncremento(event.target.value)
                }
                disabled={carregando}
                required
              />

            </div>

          </div>

          {/* CATEGORIAS */}

          <div className="campo">

            <label>
              Categorias
            </label>

            <div className="categoria-wrapper">

              <button
                type="button"
                className="botao-categorias"
                onClick={() =>
                  setMenuCategoriaAberto(!menuCategoriaAberto)
                }
                disabled={carregando}
              >

                <span>
                  {categoria || "Categorias"}
                </span>

                <span className="seta-categoria">
                  {menuCategoriaAberto ? "▲" : "▼"}
                </span>

              </button>

              {menuCategoriaAberto && (
                <div className="menu-categorias">

                  {opcoesCategoria.map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      className={
                        "opcao-categoria" +
                        (categoria === opcao ? " ativa" : "")
                      }
                      onClick={() => escolherCategoria(opcao)}
                    >
                      {opcao}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>

          {/* BOTÃO */}

          <button
            type="submit"
            className="botao-cadastrar"
            disabled={carregando}
          >

            {carregando
              ? "Cadastrando..."
              : "Cadastrar produto"}

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