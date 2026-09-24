import React from 'react';
import '../css/index.css';
import { supabase } from './supabase'

function index() {
    return (
        <div>
            <div className="card-grid">
                {/* Produto 1 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 1" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 1</h2>
                        <p className="starting-bid">Lance inicial: R$ 100,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>

                {/* Produto 2 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 2" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 2</h2>
                        <p className="starting-bid">Lance inicial: R$ 250,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>

                {/* Produto 3 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 3" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 3</h2>
                        <p className="starting-bid">Lance inicial: R$ 50,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>

                {/* Produto 4 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 4" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 4</h2>
                        <p className="starting-bid">Lance inicial: R$ 300,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>

                {/* Produto 5 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 5" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 5</h2>
                        <p className="starting-bid">Lance inicial: R$ 450,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>

                {/* Produto 6 */}
                <div className="card">
                    <div className="img-container">
                        <img src="../image-placeholder.png" alt="Imagem do Produto 6" className="card-img" />
                    </div>
                    <div className="card-info">
                        <p className="category">Categoria do produto</p>
                        <h2 className="product-name">Nome do produto 6</h2>
                        <p className="starting-bid">Lance inicial: R$ 120,00</p>
                        <a href="#" className="btn-more">Veja mais</a>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Index;