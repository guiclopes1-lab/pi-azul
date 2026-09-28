import './MenuSuperior.css';
function MenuSuperior() {
    return (
        <header>
            <div className='auth-buttons'>
                <a href="/login">Entrar</a>
                <a href="/cadastro">Cadastrar</a>
            </div>

            <div>
                <h1>Geek Loot</h1>
                <strong>Seu lance, Seu tesouro geek</strong>
            </div>

            <nav>
                <ul>


                    <li>
                        <a href="/ComoFunciona">Como funciona</a>
                    </li>

                    <li>
                        <a href="/QueroLeiloar">Quero leiloar</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MenuSuperior;