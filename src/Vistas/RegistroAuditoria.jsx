import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import axios from 'axios';
import '../CSS/RegistroAuditoria.css';

const RegistroAuditoria = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [auditoriaData, setAuditoriaData] = useState([]);

    const baseUrl = 'http://localhost:3000/api/auditoria';

    // Obtener encabezados de autenticación
    const getAuthHeader = () => {
        const token = localStorage.getItem('token'); // Suponiendo que el token está en localStorage
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchAuditoria();
    }, []);

    const fetchAuditoria = async () => {
        try {
            const response = await axios.get(baseUrl, { headers: getAuthHeader() });
            setAuditoriaData(response.data.data);
        } catch (error) {
            console.error('Error al obtener los registros de auditoría:', error);
        }
    };

    // Filtrar registros por término de búsqueda (nombre o ID)
    const filteredData = auditoriaData.filter((registro) => {
        const usuarioNombre = registro.UsuarioNombre || 'No disponible';
        return (
            usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registro.Id.toString().includes(searchTerm)
        );
    });

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
                                <tr key={registro.Id}>
                                    <td>{registro.Id}</td>
                                    <td>{registro.UsuarioNombre || 'No disponible'}</td>
                                    <td>{registro.Fecha}</td>
                                    <td>{registro.Hora}</td>
                                    <td>{registro.Accion}</td>
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
