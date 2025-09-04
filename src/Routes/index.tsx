import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import PrivateRoute from "../context/routes";

import Login from "../pages/Login";
import Home from "../pages/Home";
import RegistrarPlantioScreen from "../pages/RegistrarPlantiosScreen";
import Clientes from "../pages/Clientes";
import Comunidades from "../pages/Comunidades";
import Proprietarios from "../pages/Proprietarios";
import SAFs from "../pages/SAFs";
import Plantios from "../pages/Plantios";
import Mapa from "../pages/Mapa";

const Rotas = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mapa />} />

        {/* Rota privada */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/registrarPlantio" element={<RegistrarPlantioScreen />} />
          <Route path="/ClientesScreen" element={<Clientes />} />
          <Route path="/ComunidadesScreen" element={<Comunidades />} />
          <Route path="/ProprietariosScreen" element={<Proprietarios />} />
          <Route path="/SAFsScreen" element={<SAFs />} />
          <Route path="/PlantiosScreen" element={<Plantios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default Rotas;
