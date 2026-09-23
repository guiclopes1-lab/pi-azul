import MenuSuperior from "./components/MenuSuperior";
import Rodape from "./components/Rodape";
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <MenuSuperior />
      <Routes>
        <Route path="/" element={< login />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/noticias" element={<Comofuncina />} />
        <Route path="/perfil" element={< Perfil />} />
      </Routes>
      <Rodape />
    </BrowserRouter>
  )
}

export default App
