import MenuSuperior from "./components/MenuSuperior";
import Rodape from "./components/Rodape";
import {BrowserRouter, Route, Routes} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <MenuSuperior />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
      <Rodape />
    </BrowserRouter>
  )
}

export default App
