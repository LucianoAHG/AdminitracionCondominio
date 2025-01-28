import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import axios from 'axios';
import '../CSS/Cuotas.css';

const Cuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 15;

    const [newCuota, setNewCuota] = useState({
        IdUsuarios: [],
        Monto: '',
        Estado: 'Pendiente',
        FechaPago: '',
    });

    const baseUrlCuotas = 'https://elias.go.miorganizacion.cl/api/cuotas.php';
    const baseUrlUsuarios = 'https://elias.go.miorganizacion.cl/api/usuarios.php';

    const userRole = localStorage.getItem('userRole') || 'Rol Usuario';
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchCuotas();
        fetchUsuarios();
    }, []);

    const fetchCuotas = async () => {
        try {
            const response = await axios.get(`${baseUrlCuotas}?action=fetch`);
            if (response.data.status === 'success') {
                const filteredCuotas =
                    userRole === 'Usuario'
                        ? response.data.data.filter((cuota) => cuota.IdUsuario === userId)
                        : response.data.data;
                setCuotas(filteredCuotas);
            } else {
                console.error('Error al obtener cuotas:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener cuotas:', error.message);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrlUsuarios}?action=fetch`);
            if (response.data.status === 'success') {
                const formattedUsers = response.data.data.map((usuario) => ({
                    value: usuario.Id,
                    label: usuario.Nombre,
                }));
                setUsuarios(formattedUsers);
            } else {
                console.error('Error al obtener socios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener socios:', error.message);
        }
    };

    const handleCreateCuota = async () => {
        const { IdUsuarios, Monto } = newCuota;

        if (!IdUsuarios.length || !Monto) {
            alert('Por favor, selecciona al menos a un socio y completa el monto.');
            return;
        }

        if (!/^\d+$/.test(Monto) || parseInt(Monto, 10) <= 0) {
            alert('El monto debe ser un número entero positivo.');
            return;
        }

        try {
            const response = await axios.post(`${baseUrlCuotas}?action=create`, {
                ...newCuota,
                IdUsuarios: IdUsuarios.map((usuario) => usuario.value),
            });
            if (response.data.status === 'success') {
                alert('Cuotas creadas exitosamente');
                setShowCreateModal(false);
                setNewCuota({ IdUsuarios: [], Monto: '', Estado: 'Pendiente', FechaPago: '' });
                fetchCuotas();
            } else {
                console.error('Error al crear cuotas:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear cuotas:', error.message);
        }
    };

    const handleDeleteCuota = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cuota?')) {
            try {
                const response = await axios.get(`${baseUrlCuotas}?action=delete&id=${id}`);
                if (response.data.status === 'success') {
                    alert('Cuota eliminada exitosamente');
                    fetchCuotas();
                } else {
                    console.error('Error al eliminar cuota:', response.data.message);
                }
            } catch (error) {
                console.error('Error al eliminar cuota:', error.message);
            }
        }
    };

    const toggleRow = (usuarioId) => {
        setExpandedRows((prev) =>
            prev.includes(usuarioId) ? prev.filter((id) => id !== usuarioId) : [...prev, usuarioId]
        );
    };

    // Agrupar cuotas por socio
    const groupedCuotas = cuotas.reduce((acc, cuota) => {
        acc[cuota.UsuarioNombre] = acc[cuota.UsuarioNombre] || [];
        acc[cuota.UsuarioNombre].push(cuota);
        return acc;
    }, {});

    // Filtrar registros por término de búsqueda
    const filteredData = Object.entries(groupedCuotas).filter(([usuarioNombre, cuotas]) => {
        return (
            usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cuotas.some((cuota) =>
                cuota.Monto.toString().includes(searchTerm) ||
                cuota.Estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cuota.FechaPago.includes(searchTerm)
            )
        );
    });

    // Paginación de datos
    const offset = currentPage * itemsPerPage;
    const paginatedData = filteredData.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="cuotas-container">
            <h2>Gestión de Cuotas</h2>

            <div className="cuotas-search-bar">
                <FaSearch id="cuota-search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por socio, monto o estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {['Administrador', 'Presidente', 'Secretario', 'Tesorero'].includes(userRole) && (
                <Button className="add-button" onClick={() => setShowCreateModal(true)}>
                    + Crear Cuota
                </Button>
            )}

            <table className="table">
                <thead>
                    <tr>
                        <th>Socio</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Fecha de Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map(([usuarioNombre, cuotas]) => (
                            <React.Fragment key={usuarioNombre}>
                                <tr>
                                    <td onClick={() => toggleRow(usuarioNombre)} style={{ cursor: 'pointer' }}>
                                        {usuarioNombre}{' '}
                                        {expandedRows.includes(usuarioNombre) ? (
                                            <FaChevronUp />
                                        ) : (
                                            <FaChevronDown />
                                        )}
                                    </td>
                                    <td>${cuotas[0].Monto.toLocaleString('es-CL')}</td>
                                    <td>{cuotas[0].Estado}</td>
                                    <td>{cuotas[0].FechaPago || 'No registrada'}</td>
                                    <td>
                                        {['Administrador', 'Presidente', 'Secretario', 'Tesorero'].includes(
                                            userRole
                                        ) && (
                                            <Button
                                                variant="danger"
                                                className="delete-button"
                                                onClick={() => handleDeleteCuota(cuotas[0].Id)}
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                                {expandedRows.includes(usuarioNombre) &&
                                    cuotas.slice(1).map((cuota) => (
                                        <tr key={cuota.Id} className="expanded-row">
                                            <td></td>
                                            <td>${cuota.Monto.toLocaleString('es-CL')}</td>
                                            <td>{cuota.Estado}</td>
                                            <td>{cuota.FechaPago || 'No registrada'}</td>
                                            <td>
                                                {['Administrador', 'Presidente', 'Secretario', 'Tesorero'].includes(
                                                    userRole
                                                ) && (
                                                    <Button
                                                        variant="danger"
                                                        className="delete-button"
                                                        onClick={() => handleDeleteCuota(cuota.Id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-results">
                                No se encontraron resultados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div id="cuotas-pagination">
                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName="cuotas-pagination"
                    activeClassName="active"
                    breakLabel="..."
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                />
            </div>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Cuotas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <label>Seleccionar socios:</label>
                        <Select
                            isMulti
                            options={usuarios}
                            value={newCuota.IdUsuarios}
                            onChange={(selected) => setNewCuota({ ...newCuota, IdUsuarios: selected })}
                            placeholder="Seleccione socios..."
                        />
                        <label>Monto:</label>
                        <input
                            type="number"
                            placeholder="Monto"
                            value={newCuota.Monto}
                            onChange={(e) => setNewCuota({ ...newCuota, Monto: e.target.value })}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCreateCuota}>
                        Crear
                    </Button>
                    <Button variant="danger" onClick={() => setShowCreateModal(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Cuotas;
