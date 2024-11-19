import React, { useState } from 'react';
import { FaUserCircle, FaMoneyBill, FaClipboard, FaBalanceScale, FaUsers, FaFileAlt, FaSignOutAlt } from 'react-icons/fa'; // Importamos el icono de cierre de sesión
import '/src/CSS/MainMenu.css';

const MainMenu = () => {
    const [selectedMenu, setSelectedMenu] = useState('Cuota');
    const [showLogout, setShowLogout] = useState(false);
    const userName = "Nombre Usuario";
    const userRole = "Rol Usuario";

    const menuItems = [
        { label: 'Cuota', icon: <FaMoneyBill /> },
        { label: 'Acta', icon: <FaClipboard /> },
        { label: 'Ingresos/Egresos', icon: <FaBalanceScale /> },
        { label: 'Organización (Composición Comité)', icon: <FaUsers /> },
        { label: 'Registro Auditoría', icon: <FaFileAlt /> }
    ];

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Cuota':
                return <div>Contenido de Cuota</div>;
            case 'Acta':
                return <div>Contenido de Acta</div>;
            case 'IngresosEgresos':
                return <div>Contenido de Ingresos/Egresos</div>;
            case 'Organizacion':
                return <div>Contenido de Organización (Composición Comité)</div>;
            case 'RegistroAuditoria':
                return <div>Contenido de Registro Auditoría</div>;
            default:
                return <div>Seleccione una opción del menú</div>;
        }
    };

    return (
        <div className="main-menu-container">
            <div className="menu-sidebar">
                <ul>
                    {menuItems.map((item, index) => (
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
