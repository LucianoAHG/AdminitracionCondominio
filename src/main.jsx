import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '/src/Vistas/Login.jsx'; 
import MainMenu from '/src/Vistas/Mainmenu.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/Menu_Principal" element={<MainMenu />} />
                {/* Puedes agregar más rutas aquí según tus necesidades */}
            </Routes>
        </Router>
    </StrictMode>
);
