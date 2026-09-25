import React, { useEffect, useState } from "react";
import "./perfil.css";
import { supabase } from '../supabase';

function Perfil() {
  const [usuarios, setUsuarios] = useState([]);
  const [produtos, setProdutos] = useState([]);

  async function carregaDados() {
    // Busca informações dos usuários
    const { data: dataUsuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select();

    if (errorUsuarios) {
      console.error('Erro ao carregar usuários:', errorUsuarios);
    } else {
      setUsuarios(dataUsuarios);
    }

    // Busca produtos cadastrados
    const { data: dataProdutos, error: errorProdutos } = await supabase
      .from('produtos')
      .select();

    if (errorProdutos) {
      console.error('Erro ao carregar produtos:', errorProdutos);
    } else {
      setProdutos(dataProdutos);
    }
  }

  useEffect(() => {
    carregaDados();
  }, []);

  return (
    <main className="profile-container">
      {/* SEÇÃO SUPERIOR: FOTO À ESQUERDA + INFORMAÇÕES À DIREITA */}
      <section className="profile-header">
        
        {/* FOTO DE PERFIL */}
        <div className="avatar-container">
          <img
            src="https://picsum.photos/200"
            alt="Foto de perfil de Ana Maria Silva"
            className="profile-img"
          />

          {/* BOTÃO DE ALTERAR FOTO */}
          <a
            href="#"
            className="btn-change-photo"
            title="Alterar foto de perfil"
            aria-label="Alterar foto"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </a>
        </div>

        {/* DADOS PESSOAIS */}
        <div className="profile-details">
          <h1 className="user-name">Ana Maria Silva</h1>

          <div className="info-box">
            {/* EMAIL */}
            <div className="info-group">
              <span className="info-label">
                <svg
                  className="info-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                E-mail
              </span>
              <p className="info-value">ana.silva@email.com</p>
            </div>

            <hr className="divider" />

            {/* ENDEREÇO */}
            <div className="info-group">
              <span className="info-label">
                <svg
                  className="info-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Endereço Cadastrado
              </span>
              <p className="info-value">
                Rua das Flores, 123 — Apto 201<br />
                Bairro Jardim — São Paulo / SP<br />
                CEP: 01234-567
              </p>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="actions">
            <a href="#" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar Perfil
            </a>

            <a href="#" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO INFERIOR: PRODUTOS CADASTRADOS */}
      <section className="products-section">
        <h2 className="section-title">Produtos Cadastrados</h2>

        {produtos.length === 0 ? (
          <p className="empty-message">Nenhum produto cadastrado até o momento.</p>
        ) : (
          <div className="products-grid">
            {produtos.map((produto) => (
              <div key={produto.id} className="product-card">
                <img
                  src={produto.imagem_url || "https://picsum.photos/150"}
                  alt={produto.nome}
                  className="product-img"
                />
                <div className="product-info">
                  <h3 className="product-title">{produto.nome}</h3>
                  <p className="product-price">
                    {produto.preco ? `R$ ${Number(produto.preco).toFixed(2)}` : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Perfil;