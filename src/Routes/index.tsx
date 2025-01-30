import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import PrivateRoute from "../context/routes";

import Login from "../pages/Login";
import Home from "../pages/Home";
import InserirDados from "../pages/InserirDados";
import Cadastros from "../pages/Cadastros";
import Plantio from "../pages/Plantio";

const Rotas = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rota privada */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/inserir" element={<InserirDados />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/plantio" element={<Plantio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default Rotas;
