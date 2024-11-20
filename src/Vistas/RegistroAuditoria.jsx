import React, { useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import '/src/CSS/RegistroAuditoria.css';

const RegistroAuditoria = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Datos de ejemplo (pueden ser reemplazados con datos reales desde una API o base de datos)
    const auditoriaData = [
        { id: 1, nombre: 'Juan Pérez', fecha: '2024-11-19', hora: '14:30', accion: 'Realizó un pago' },
        { id: 2, nombre: 'María Gómez', fecha: '2024-11-19', hora: '15:45', accion: 'Editó su correo' },
        { id: 3, nombre: 'Carlos Sánchez', fecha: '2024-11-19', hora: '16:10', accion: 'Inició sesión en la página' },
        { id: 4, nombre: 'Ana Torres', fecha: '2024-11-18', hora: '09:00', accion: 'Eliminó un archivo' },
        { id: 5, nombre: 'Pedro Martínez', fecha: '2024-11-18', hora: '11:15', accion: 'Modificó su contraseña' },
    ];

    // Filtrar registros por término de búsqueda (nombre o ID)
    const filteredData = auditoriaData.filter((registro) =>
        registro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.id.toString().includes(searchTerm)
    );

    return (
        <div className="registro-auditoria-container">
            <h2>Registro de Auditoría</h2>
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="table-wrapper">
                <table className="registro-auditoria-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Acción</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((registro) => (
                                <tr key={registro.id}>
                                    <td>{registro.id}</td>
                                    <td>{registro.nombre}</td>
                                    <td>{registro.fecha}</td>
                                    <td>{registro.hora}</td>
                                    <td>{registro.accion}</td>
                                    <td>
                                        <button className="view-button">
                                            <FaEye /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No se encontraron resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegistroAuditoria;
