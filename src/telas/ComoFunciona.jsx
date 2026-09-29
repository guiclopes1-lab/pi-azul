import React from "react";
import "./ComoFunciona.css";


function ComoFunciona() {
  return (
    <div className="pagina-como-funciona">

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo-principal">

        {/* TÍTULO */}
        <section className="secao-titulo">

          <h1>
            Como Funciona e Regras do Leilão
          </h1>

          <p>
            Saiba como funciona a plataforma de leilões para
            compradores e vendedores de itens colecionáveis.
          </p>

        </section>

        {/* COMPRADOR */}
        <section className="secao-bloco">

          <h2>
            Como Funciona para o Comprador
          </h2>

          <p>
            Navegue pelos leilões ativos, acompanhe os lances em tempo real e garanta itens colecionáveis exclusivos com total segurança.
          </p>

          <div className="cards-grid">

            <article className="card-item">
              <h3>1. Escolha o Colecionável</h3>
              <p>
                Explore o catálogo de itens raros e colecionáveis. Verifique a descrição detalhada, fotos de alta resolução e o estado de conservação do lote.
              </p>
            </article>

            <article className="card-item">
              <h3>2. Dê o seu Lance</h3>
              <p>
                Insira o valor desejado respeitando o incremento mínimo. Acompanhe o cronômetro em tempo real e seja notificado caso seu lance seja superado.
              </p>
            </article>

            <article className="card-item">
              <h3>3. Finalize a Compra</h3>
              <p>
                Se o seu lance for o vencedor ao término do tempo, conclua o pagamento de forma segura na plataforma e aguarde o envio do seu item.
              </p>
            </article>

          </div>

        </section>

        {/* VENDEDOR */}
        <section className="secao-bloco">

          <h2>
            Como Funciona para o Vendedor
          </h2>

          <p>
            Anuncie seus colecionáveis para milhares de compradores, defina o valor inicial e venda com garantia de recebimento.
          </p>

          <div className="cards-grid">

            <article className="card-item">
              <h3>1. Cadastre seu Item</h3>
              <p>
                Adicione fotos nítidas do produto, especifique a categoria, a autenticidade e escreva uma descrição detalhada sobre o estado do item.
              </p>
            </article>

            <article className="card-item">
              <h3>2. Defina o Leilão</h3>
              <p>
                Escolha o valor do lance inicial, a duração do leilão e, se desejar, defina um valor mínimo de reserva para garantir o preço de venda ideal.
              </p>
            </article>

            <article className="card-item">
              <h3>3. Envie o Produto</h3>
              <p>
                Assim que o pagamento do comprador for confirmado pela plataforma, embale o item com proteção adequada e realize o envio dentro do prazo.
              </p>
            </article>

          </div>

        </section>

        {/* CURADORIA */}
        <section className="curadoria">

          <h2>
            Como Enviar para Curadoria
          </h2>

          <p>
            Para leiloar o seu item, envie um e-mail para
            umemailaleatorioaqui@gmail.com com fotos e vídeos do item
            para a Curadoria, junto com a sugestão de lance inicial.
            Retornaremos em até 5 dias úteis pelo e-mail de contato.
          </p>

        </section>

        {/* REGRAS */}
        <section className="secao-bloco">

          <h2>
            Regras do Leilão
          </h2>

          <ul className="lista-regras">

            <li>
              <strong>Regra de Incremento Mínimo:</strong>{" "}
              Para ser efetuado um lance é necessário que ele esteja{" "}
              <strong>50 reais acima do valor atual</strong>.
            </li>

            <li>
              <strong>Irrevogabilidade dos Lances:</strong>{" "}
              Todo lance confirmado é definitivo e não pode ser
              cancelado pelo usuário.
            </li>

            <li>
              <strong>Prazo de Pagamento:</strong>{" "}
              O comprador que arrematar o lote tem até 24 horas
              para efetuar o pagamento.
            </li>

            <li>
              <strong>Prorrogação de Tempo:</strong>{" "}
              Lances nos últimos minutos estendem a duração do lote
              para dar chance a outros participantes.
            </li>

            <li>
              <strong>Pagamento do Produto:</strong>{" "}
              O pagamento só será efetuado após o término do tempo
              do leilão feito entre site, vendedor e leilão.
            </li>

          </ul>

        </section>

        {/* SOBRE O SITE */}
        <section className="secao-sobre">

          <h2>
            Sobre o Nosso Site
          </h2>

          <p>
            O Geek Loot nasceu da paixão pela cultura pop e pelo universo dos colecionáveis. 
            Somos uma plataforma de leilões especializada em conectar colecionadores e entusiastas 
            aos itens mais cobiçados do mercado — desde Pokémon Cards raros e graduados, 
            até Action Figures altamente detalhadas e Funko Pops exclusivos ou fora de linha (vaulted). 
            Oferecemos um ambiente 100% seguro, com verificação de procedência e transparência em cada lance, 
            para que você possa expandir a sua coleção com total confiança.
          </p>

        </section>

      </main>

    </div>
  );
}

export default ComoFunciona;