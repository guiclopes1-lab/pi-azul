import MenuSuperior from "./components/MenuSuperior";
import Rodape from "./components/Rodape";
import Produto from "./telas/Produto";
import Login from "./telas/Login";
import Cadastro from "./telas/Cadastro";
import ComoFunciona from "./telas/ComoFunciona";
import Perfil from "./telas/Perfil";
import Vitrine from "./telas/Vitrine";
import { supabase } from './supabase'

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";

// Componente auxiliar para verificar a rota atual
function AppContent() {
  const location = useLocation();

  // Rotas onde o Menu e o Rodapé NÃO devem aparecer
  const rotasSemMenu = ["/login", "/cadastro"];
  const esconderMenuERodape = rotasSemMenu.includes(location.pathname);

  return (
    <>
      {!esconderMenuERodape && <MenuSuperior />}

      <Routes>
        <Route path="/" element={<Vitrine />} />
        <Route path="/" element={<Login />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/comofunciona" element={<ComoFunciona />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>

      {!esconderMenuERodape && <Rodape />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;