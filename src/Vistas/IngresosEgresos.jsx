import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import axios from 'axios';
import '../CSS/IngresosEgresos.css';

const IngresosEgresos = () => {
    const [registros, setRegistros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [newRegistro, setNewRegistro] = useState({
        Tipo: 'ingreso',
        Categoria: '',
        Descripcion: '',
        Monto: '',
        Fecha: '',
        IdUsuarios: []
    });

    const baseUrl = 'https://elias.go.miorganizacion.cl/api/ingresosEgresos.php';

    useEffect(() => {
        fetchRegistros();
    }, []);

    const fetchRegistros = async () => {
        try {
            const response = await axios.get(`${baseUrl}?action=fetch`);
            if (response.data.status === 'success') {
                setRegistros(response.data.data || []);
            } else {
                console.error('Error al obtener los registros:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener los registros:', error.message);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrl}?action=fetchUsers`);
            if (response.data.status === 'success') {
                const formattedUsers = response.data.data.map((usuario) => ({
                    value: usuario.Id,
                    label: usuario.Nombre,
                }));
                setUsuarios(formattedUsers);
            } else {
                console.error('Error al obtener usuarios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
        }
    };

    const handleOpenModal = () => {
        fetchUsuarios();
        setShowCreateModal(true);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setCurrentPage(0);
    };

    // Filtrar registros por búsqueda
    const filteredData = registros.filter((registro) => {
        const fecha = registro.Fecha ? registro.Fecha.toLowerCase() : '';
        const tipo = registro.Tipo ? registro.Tipo.toLowerCase() : '';
        const categoria = registro.Categoria ? registro.Categoria.toLowerCase() : '';
        const descripcion = registro.Descripcion ? registro.Descripcion.toLowerCase() : '';
        const monto = registro.Monto ? registro.Monto.toString().toLowerCase() : '';
        const usuario = registro.UsuarioNombre ? registro.UsuarioNombre.toLowerCase() : '';

        return (
            fecha.includes(searchTerm) ||
            tipo.includes(searchTerm) ||
            categoria.includes(searchTerm) ||
            descripcion.includes(searchTerm) ||
            monto.includes(searchTerm) ||
            usuario.includes(searchTerm)
        );
    });

    const offset = currentPage * itemsPerPage;
    const paginatedData = filteredData.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleCreateRegistro = async () => {
        try {
            const response = await axios.post(baseUrl, {
                ...newRegistro,
                IdUsuarios: newRegistro.IdUsuarios.map((usuario) => usuario.value), 
            });
            if (response.data.status === 'success') {
                alert('Registro creado con éxito');
                setShowCreateModal(false);
                setNewRegistro({ Tipo: 'ingreso', Categoria: '', Descripcion: '', Monto: '', Fecha: '', IdUsuarios: [] });
                fetchRegistros();
            } else {
                console.error('Error al crear el registro:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear el registro:', error.message);
        }
    };

    return (
        <div className="ingresos-egresos-container">
            <h2>Gestión de Ingresos y Egresos</h2>

            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por fecha, tipo, categoría, descripción, monto o socio"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <Button className="add-button" onClick={handleOpenModal}>
                + Agregar Registro
            </Button>

            <table className="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Socios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((registro) => (
                            <tr key={registro.Id}>
                                <td>{registro.Fecha}</td>
                                <td>{registro.Tipo}</td>
                                <td>{registro.Categoria}</td>
                                <td>{registro.Descripcion}</td>
                                <td>${parseFloat(registro.Monto || 0).toLocaleString('es-CL')}</td>
                                <td>{registro.UsuarioNombre || 'No asignado'}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        className="delete-button"
                                        onClick={() => console.log('Eliminar', registro.Id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-results">No se encontraron registros</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div id="pagination">
                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    breakLabel="..."
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                />
            </div>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Registro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <label>Fecha:</label>
                        <input type="date" value={newRegistro.Fecha} onChange={(e) => setNewRegistro({ ...newRegistro, Fecha: e.target.value })} />

                        <label>Tipo:</label>
                        <select value={newRegistro.Tipo} onChange={(e) => setNewRegistro({ ...newRegistro, Tipo: e.target.value })}>
                            <option value="ingreso">Ingreso</option>
                            <option value="egreso">Egreso</option>
                        </select>

                        <label>Categoría:</label>
                        <input type="text" value={newRegistro.Categoria} onChange={(e) => setNewRegistro({ ...newRegistro, Categoria: e.target.value })} />

                        <label>Descripción:</label>
                        <textarea value={newRegistro.Descripcion} onChange={(e) => setNewRegistro({ ...newRegistro, Descripcion: e.target.value })} />

                        <label>Socios:</label>
                        <Select
                            isMulti
                            options={usuarios}
                            value={newRegistro.IdUsuarios}
                            onChange={(selected) => setNewRegistro({ ...newRegistro, IdUsuarios: selected })}
                            placeholder="Seleccione socios..."
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCreateRegistro}>Crear</Button>
                    <Button variant="danger" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IngresosEgresos;
