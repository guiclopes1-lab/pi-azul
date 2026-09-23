import MenuSuperior from "./components/MenuSuperior";
import Rodape from "./components/Rodape";

import Produto from "./telas/Produto";
import Login from "./telas/Login";
import Cadastro from "./telas/Cadastro";
import ComoFunciona from "./telas/ComoFunciona";
import Perfil from "./telas/Perfil";

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MenuSuperior />
      <Routes>
        <Route
          path="/" element={<Navigate to="/login" replace />} />
        <Route path="/produto" element={<Produto />} />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/cadastro"
          element={<Cadastro />}
        />
        <Route
          path="/comofunciona"
          element={<ComoFunciona />}
        />
        <Route
          path="/perfil"
          element={<Perfil />}
        />
      </Routes>
      <Rodape />
    </BrowserRouter>
  );
}

export default App;