function Rodape() {
    return (
        <footer>
            <div className="footer-container">

                <div>
                    <h3>Informações</h3>

                    <ul>
                        <li><a href="#">Quem somos?</a></li>
                        <li><a href="#">Como funciona?</a></li>
                        <li><a href="#">Contato</a></li>
                        <li><a href="#">Termos de uso</a></li>
                        <li><a href="#">Política de privacidade</a></li>
                    </ul>
                </div>

                <div>
                    <h3>Contatos</h3>

                    <div>
                        <p>
                            <strong>E-mail:</strong> emailaleatorioaqui@gmail.com
                        </p>

                        <p>
                            <strong>Telefone:</strong> (11) 99999-9999
                        </p>

                        <p>
                            <strong>Endereço:</strong> Rua xxxxxxxx, nº xxxx, São Carlos-SP
                        </p>
                    </div>
                </div>

                <div>
                    <h3>Redes Sociais</h3>

                    <ul>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
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