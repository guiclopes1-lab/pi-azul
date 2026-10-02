import React, { useEffect, useState } from 'react';
import '../index.css';
import './Vitrine.css';
import { supabase } from '../supabase';
import { Link } from "react-router-dom";

function Vitrine() {
    const [produtos, setProdutos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalProdutos, setTotalProdutos] = useState(0);

    const produtosPorPagina = 20;

    async function CarregaProduto() {
        const inicio = (pagina - 1) * produtosPorPagina;
        const fim = inicio + produtosPorPagina - 1;

        const { data, error, count } = await supabase
            .from('produtos')
            .select('*', { count: 'exact' })
            .range(inicio, fim);

        if (error) {
            console.error('Erro ao carregar produtos:', error);
            return;
        }

        setProdutos(data || []);
        setTotalProdutos(count || 0);
    }

    useEffect(() => {
        CarregaProduto();
    }, [pagina]);

    const totalPaginas = Math.ceil(totalProdutos / produtosPorPagina);

    return (
        <div>
            <div className="card-grid">
                {produtos.map((produto) => (
                    <div className="card" key={produto.id}>

                        <div className="img-container">
                            <img
                                src={produto.imagem}
                                alt={produto.nome}
                                className="card-img"
                            />
                        </div>

                        <div className="card-info">

                            <p className="category">
                                {produto.categoria}
                            </p>

                            <h2 className="product-name">
                                {produto.nome}
                            </h2>

                            <p className="starting-bid">
                                Lance inicial:{" "}
                                {produto.preco != null
                                    ? Number(produto.preco).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })
                                    : "R$ 0,00"}
                            </p>

                            <Link
                                to={`/produto/${produto.id}`}
                                className="btn-more"
                            >
                                Veja mais
                            </Link>

                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINAÇÃO */}
            <div className="pagination">

                <button
                    onClick={() => setPagina(pagina - 1)}
                    disabled={pagina === 1}
                >
                    Anterior
                </button>

                <span>
                    Página {pagina} de {totalPaginas}
                </span>

                <button
                    onClick={() => setPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                >
                    Próxima
                </button>

            </div>
        </div>
    );
}

export default Vitrine;
