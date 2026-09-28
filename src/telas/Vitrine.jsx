import React from 'react';
import '../index.css';
import './Vitrine.css'
import { supabase } from '../supabase'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


function Vitrine() {
    const [produtos, setProdutos] = useState([])
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


        </div>
    )
}
export default Vitrine;