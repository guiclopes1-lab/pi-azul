import './Rodape.css'
function Rodape() {
    return (
        <footer>
            <div className="footer-container">

                <div>
                    <h3>Informações</h3>

                    <ul>
                        <li><a href="./ComoFunciona">Quem somos?</a></li>
                        <li><a href="./ComoFunciona">Como funciona?</a></li>
                    </ul>
                </div>

                <div>
                    <h3>Contatos</h3>

                    <div>
                        <p>
                            <strong>E-mail:</strong> suportegeekloot@gmail.com
                        </p>

                        <p>
                            <strong>Telefone:</strong> (11) 94040-4242
                        </p>

                        <p>
                            <strong>Endereço:</strong> Rua Alameda dos Naboo, nº 1367, Neo Tokyo, São Paulo-SP
                        </p>
                    </div>
                </div>

                <div>
                    <h3>Redes Sociais</h3>

                    <ul>
                        <li><a href="https://www.instagram.com/">Instagram</a></li>
                        <li><a href="https://www.facebook.com/">Facebook</a></li>
                        <li><a href="https://x.com/?lang=pt">Twitter</a></li>
                    </ul>
                </div>

                <div>
                    <h3>Saiba quando um item entrar em leilão</h3>

                    <p>
                        Deixe seu email para receber notificações:
                    </p>

                    <form>
                        <input
                            type="email"
                            placeholder="Seu email..."
                            required
                        />

                        <button type="submit">
                            Receber Notificações
                        </button>
                    </form>
                </div>

            </div>
        </footer>
    );
}

export default Rodape;