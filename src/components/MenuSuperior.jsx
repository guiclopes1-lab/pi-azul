import './MenuSuperior.css';
function MenuSuperior() {
    return (
        <header>
            <div className='auth-buttons'>
                <a href="/login">Entrar</a>
                <a href="/cadastro">Cadastrar</a>
                <a href="/perfil" className="profile-icon" title="Meu Perfil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>
                </a>
            </div>

            <div>
                <h1> <a href="./">Geek Loot</a></h1>
                <strong>Seu lance, Seu tesouro geek</strong>
            </div>

            <br />


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