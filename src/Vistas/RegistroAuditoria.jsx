import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import '../CSS/RegistroAuditoria.css';

const RegistroAuditoria = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [auditoriaData, setAuditoriaData] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 15;

    const baseUrlAuditoria = 'https://elias.go.miorganizacion.cl/api/auditoria.php';
    const baseUrlUsuarios = 'https://elias.go.miorganizacion.cl/api/usuarios.php';

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchAuditoria();
        fetchUsuarios();
    }, []);

    const fetchAuditoria = async () => {
        try {
            const response = await axios.get(baseUrlAuditoria, { headers: getAuthHeader() });
            if (response.data.status === 'success') {
                setAuditoriaData(response.data.data);
            } else {
                console.error('Error al obtener los registros de auditoría:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener los registros de auditoría:', error.message);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrlUsuarios}?action=fetch`, { headers: getAuthHeader() });
            if (response.data.status === 'success') {
                setUsuarios(response.data.data || []);
            } else {
                console.error('Error al obtener socios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener socios:', error.message);
        }
    };

    // Obtener el nombre del usuario por su ID
    const getUsuarioNombre = (idUsuario) => {
        const usuario = usuarios.find((user) => parseInt(user.Id) === parseInt(idUsuario));
        return usuario ? usuario.Nombre : 'No disponible';
    };

    const auditoriaConUsuarios = auditoriaData.map((registro) => ({
        ...registro,
        UsuarioNombre: getUsuarioNombre(registro.IdUsuario),
    }));

    // Ordenar registros por fecha y hora en orden descendente (últimos registros primero)
    const sortedData = auditoriaConUsuarios.sort((a, b) => {
        const dateA = new Date(`${a.Fecha}T${a.Hora}`);
        const dateB = new Date(`${b.Fecha}T${b.Hora}`);
        return dateB - dateA; // Orden descendente
    });

    // Filtrar registros por término de búsqueda
    const filteredData = sortedData.filter((registro) => {
        const usuarioNombre = registro.UsuarioNombre.toLowerCase();
        return (
            usuarioNombre.includes(searchTerm.toLowerCase()) ||
            registro.Id.toString().includes(searchTerm) ||
            registro.Accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registro.Detalle.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Paginación de datos
    const offset = currentPage * itemsPerPage;
    const paginatedData = filteredData.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div id="auditoria-container">
            <h2 id="auditoria-title">Registro de Auditoría</h2>

            <div id="auditoria-search-bar">
                <FaSearch id="auditoria-search-icon" />
                <input
                    type="text"
                    id="auditoria-search-input"
                    placeholder="Buscar por nombre, ID, acción o detalle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div id="auditoria-table-wrapper">
                <table id="auditoria-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Socio</th>
                            <th>Acción</th>
                            <th>Detalle</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((registro) => (
                                <tr key={registro.Id}>
                                    <td>{registro.Id}</td>
                                    <td>{registro.UsuarioNombre}</td>
                                    <td>{registro.Accion}</td>
                                    <td>{registro.Detalle}</td>
                                    <td>{registro.Fecha}</td>
                                    <td>{registro.Hora}</td>
                                    <td>
                                        <button id="auditoria-view-button">
                                            <FaEye /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" id="auditoria-no-results">No se encontraron resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div id="auditoria-pagination-container">
                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName="auditoria-pagination"
                    activeClassName="active"
                    breakLabel="..."
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                />
            </div>
        </div>
    );
};

export default RegistroAuditoria;
