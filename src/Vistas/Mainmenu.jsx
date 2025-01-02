import React, { useState } from 'react';
import {
    FaUserCircle, FaMoneyBill, FaClipboard, FaBalanceScale, FaUsers, FaFileAlt, FaSignOutAlt, FaUser
} from 'react-icons/fa'; // Ejemplo de iconos
import '../CSS/MainMenu.css';
import IngresosEgresos from './IngresosEgresos.jsx';
import Cuotas from '/src/Vistas/Cuotas.jsx';
import Actas from '/src/Vistas/Actas.jsx';
import Organizacion from '/src/Vistas/Organizacion.jsx';
import RegistroAuditoria from '/src/Vistas/RegistroAuditoria.jsx';
import Usuarios from '/src/Vistas/Usuarios.jsx';
import Resumen from '/src/Vistas/resumen.jsx';

const MainMenu = () => {
    const [selectedMenu, setSelectedMenu] = useState('Cuota');
    const [showLogout, setShowLogout] = useState(false);

    // Recuperar datos del usuario desde localStorage
    const userName = localStorage.getItem('userName') || 'Nombre Usuario';
    const userRole = localStorage.getItem('userRole') || 'Rol Usuario';

    const menuItems = [
        { label: 'Acta', icon: <FaClipboard />, roles: ['Administrador', 'Presidente', 'Secretario', 'Usuario'] },
        { label: 'Cuota', icon: <FaMoneyBill />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Usuario'] },
        { label: 'Ingresos/Egresos', icon: <FaBalanceScale />, roles: ['Administrador', 'Presidente', 'Tesorero'] },
        { label: 'Organización (Composición Comité)', icon: <FaUsers />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Usuario'] },
        { label: 'Registro Auditoría', icon: <FaFileAlt />, roles: ['Administrador', 'Presidente', ] },
        { label: 'Usuarios', icon: <FaUser />, roles: ['Administrador', 'Presidente', ] },
        { label: 'Resumen', icon: <FaUser />, roles: ['Administrador', 'Presidente', 'Secretario', 'Tesorero', 'Usuario'] }
    ];

    // Filtrar elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Cuota':
                return <Cuotas />;
            case 'Acta':
                return <Actas />;
            case 'Ingresos/Egresos':
                return <IngresosEgresos />;
            case 'Organización (Composición Comité)':
                return <Organizacion />;
            case 'Registro Auditoría':
                return <RegistroAuditoria />;
            case 'Usuarios':
                return <Usuarios />;
            case 'Resumen':
                return <Resumen />;
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
