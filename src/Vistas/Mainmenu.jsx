import React, { useState } from 'react';
import { FaUserCircle, FaMoneyBill, FaClipboard, FaBalanceScale, FaUsers, FaFileAlt, FaSignOutAlt } from 'react-icons/fa'; // Ejemplo de iconos
import '/src/CSS/MainMenu.css';
import IngresosEgresos from './IngresosEgresos.jsx';
import Cuotas from '/src/Vistas/Cuotas.jsx';
import Actas from '/src/Vistas/Actas.jsx';
import Organizacion from '/src/Vistas/Organizacion.jsx';
import RegistroAuditoria from '/src/Vistas/RegistroAuditoria.jsx';


const MainMenu = () => {
    const [selectedMenu, setSelectedMenu] = useState('Cuota');
    const [showLogout, setShowLogout] = useState(false);
    const userName = "Nombre Usuario";
    const userRole = "Rol Usuario";

    const menuItems = [
        { label: 'Acta', icon: <FaClipboard /> },
        { label: 'Cuota', icon: <FaMoneyBill /> },
        { label: 'Ingresos/Egresos', icon: <FaBalanceScale /> },
        { label: 'Organización (Composición Comité)', icon: <FaUsers /> },
        { label: 'Registro Auditoría', icon: <FaFileAlt /> }
    ];

    // Ordenar el menú alfabéticamente
    const sortedMenuItems = [...menuItems].sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Cuota':
                return <Cuotas />;
            case 'Acta':
                return <Actas />;
            case 'Ingresos/Egresos':
                return <IngresosEgresos />;
            case 'Organización (Composición Comité)':
                return <Organizacion/>;
            case 'Registro Auditoría':
                return <RegistroAuditoria />;
            default:
                return <div>Seleccione una opción del menú</div>;
        }
    };

    return (
        <div className="main-menu-container">
            <div className="menu-sidebar">
                <ul>
                    {sortedMenuItems.map((item, index) => (
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
                            onClick={() => alert('Cerrar sesión')}
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
