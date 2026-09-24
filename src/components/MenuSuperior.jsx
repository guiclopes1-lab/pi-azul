import './MenuSuperior.css';
function MenuSuperior() {
    return (
        <header>
            <div>
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
                        <a href="#">Categorias</a>
                    </li>

                    <li>
                        <a href="/ComoFunciona">Como funciona</a>
                    </li>

                    <li>
                        <a href="#">Quero leiloar</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MenuSuperior;