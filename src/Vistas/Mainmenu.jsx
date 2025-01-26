import React, { useState } from 'react';
import {
    FaUserCircle, FaMoneyBill, FaClipboard, FaBalanceScale, FaUsers, FaFileAlt, FaSignOutAlt, FaUser
} from 'react-icons/fa'; // Ejemplo de iconos
import '../CSS/MainMenu.css';
import Resumen from '/src/Vistas/resumen.jsx';
import Actas from '/src/Vistas/Actas.jsx';
import Cuotas from '/src/Vistas/Cuotas.jsx';
import IngresosEgresos from './IngresosEgresos.jsx';
import Organizacion from '/src/Vistas/Organizacion.jsx';
import RegistroAuditoria from '/src/Vistas/RegistroAuditoria.jsx';
import Usuarios from '/src/Vistas/Usuarios.jsx';

const MainMenu = () => {
    const [selectedMenu, setSelectedMenu] = useState('Inicio');
    const [showLogout, setShowLogout] = useState(false);

    // Recuperar datos del usuario desde localStorage
    const userName = localStorage.getItem('userName') || 'Nombre Usuario';
    const userRole = localStorage.getItem('userRole') || 'Rol Usuario';

    const menuItems = [
        { label: 'Inicio', icon: <FaUser />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Socio'] },
        { label: 'Acta', icon: <FaClipboard />, roles: ['Administrador', 'Presidente', 'Secretario', 'Socio'] },
        { label: 'Cuota', icon: <FaMoneyBill />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Socio'] },
        { label: 'Ingresos/Egresos', icon: <FaBalanceScale />, roles: ['Administrador', 'Presidente', 'Tesorero'] },
        { label: 'Organización (Composición Comité)', icon: <FaUsers />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Socio'] },
        { label: 'Registro Auditoría', icon: <FaFileAlt />, roles: ['Administrador', 'Presidente', ] },
        { label: 'Usuarios', icon: <FaUser />, roles: ['Administrador', 'Presidente', ] },
    ];

    // Filtrar elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Inicio':
                return <Resumen />;
            case 'Acta':
                return <Actas />;
            case 'Cuota':
                return <Cuotas />;
            case 'Ingresos/Egresos':
                return <IngresosEgresos />;
            case 'Organización (Composición Comité)':
                return <Organizacion />;
            case 'Registro Auditoría':
                return <RegistroAuditoria />;
            case 'Usuarios':
                return <Usuarios />;
            default:
                return <div>Seleccione una opción del menú</div>;
        }
    };

    return (
        <div className="main-menu-container">
            <div className="menu-sidebar">
                <ul>
                    {filteredMenuItems.map((item, index) => (
                        <li
                            key={index}
                            className={selectedMenu === item.label ? 'active' : ''}
                            onClick={() => setSelectedMenu(item.label)}
                        >
                            <span className="menu-item-icon">{item.icon}</span> {item.label}
                        </li>
                    ))}
                </ul>
                <div
                    id="user-container"
                    onMouseEnter={() => setShowLogout(true)}
                    onMouseLeave={() => setShowLogout(false)}
                >
                    <FaUserCircle id="user-icon" />
                    <div id="user-info">
                        <p id="user-name">{userName}</p>
                        <p id="user-role">{userRole}</p>
                    </div>
                    {showLogout && (
                        <FaSignOutAlt
                            id="logout-icon"
                            onClick={() => {
                                localStorage.clear();
                                alert('Cerrando sesión...');
                                window.location.href = '/login';
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="menu-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default MainMenu;
