import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/IngresosEgresos.css';

const IngresosEgresos = () => {
    const [registros, setRegistros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredRegistros, setFilteredRegistros] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRegistro, setNewRegistro] = useState({
        Tipo: 'ingreso',
        Categoria: '',
        Descripcion: '',
        Monto: '',
        Fecha: '',
        IdUsuario: ''
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
                setFilteredRegistros(response.data.data || []);
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
                setUsuarios(response.data.data || []);
            } else {
                console.error('Error al obtener socios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener socios:', error.message);
        }
    };

    const handleOpenModal = () => {
        fetchUsuarios();
        setShowCreateModal(true);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredRegistros(
            registros.filter(
                (registro) =>
                    registro.Categoria.toLowerCase().includes(value) ||
                    registro.Tipo.toLowerCase().includes(value) ||
                    (registro.UsuarioNombre && registro.UsuarioNombre.toLowerCase().includes(value))
            )
        );
    };

    const handleCreateRegistro = async () => {
        try {
            const response = await axios.post(baseUrl, newRegistro);
            if (response.data.status === 'success') {
                alert('Registro creado con éxito');
                setShowCreateModal(false);
                setNewRegistro({ Tipo: 'ingreso', Categoria: '', Descripcion: '', Monto: '', Fecha: '', IdUsuario: '' });
                fetchRegistros();
            } else {
                console.error('Error al crear el registro:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear el registro:', error.message);
        }
    };

    const handleDeleteRegistro = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            try {
                const response = await axios.delete(`${baseUrl}?id=${id}`);
                if (response.data.status === 'success') {
                    alert('Registro eliminado con éxito');
                    fetchRegistros();
                } else {
                    console.error('Error al eliminar el registro:', response.data.message);
                }
            } catch (error) {
                console.error('Error al eliminar el registro:', error.message);
            }
        }
    };

    return (
        <div className="ingresos-egresos-container">
            <h2>Gestión de Ingresos y Egresos</h2>
            <Button className="add-button" onClick={handleOpenModal}>
                + Agregar Registro
            </Button>
            <input
                type="text"
                className="search-input"
                placeholder="Buscar por categoría, tipo o usuario"
                value={search}
                onChange={handleSearch}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Socio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRegistros.map((registro) => (
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
                                    onClick={() => handleDeleteRegistro(registro.Id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Registro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <select
                            value={newRegistro.Tipo}
                            onChange={(e) => setNewRegistro({ ...newRegistro, Tipo: e.target.value })}
                        >
                            <option value="ingreso">Ingreso</option>
                            <option value="egreso">Egreso</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={newRegistro.Categoria}
                            onChange={(e) => setNewRegistro({ ...newRegistro, Categoria: e.target.value })}
                        />
                        <textarea
                            placeholder="Descripción"
                            value={newRegistro.Descripcion}
                            onChange={(e) => setNewRegistro({ ...newRegistro, Descripcion: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Monto"
                            value={newRegistro.Monto}
                            onChange={(e) => setNewRegistro({ ...newRegistro, Monto: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newRegistro.Fecha}
                            onChange={(e) => setNewRegistro({ ...newRegistro, Fecha: e.target.value })}
                        />
                        <select
                            value={newRegistro.IdUsuario}
                            onChange={(e) => setNewRegistro({ ...newRegistro, IdUsuario: e.target.value })}
                        >
                            <option value="">Seleccionar Usuario</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.Id} value={usuario.Id}>
                                    {usuario.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCreateRegistro}>
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

export default IngresosEgresos;
