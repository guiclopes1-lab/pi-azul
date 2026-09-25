import './MenuSuperior.css';
function MenuSuperior() {
    return (
        <header>
            <div className='auth-buttons'>
                <a href="/login">Entrar</a>
                <a href="/cadastro">Cadastrar</a>
            </div>

            <div>
                <h1>Nome do Site</h1>
                <strong>Slogan do site em negrito</strong>
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