import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/Actas.css';

const Actas = () => {
    const [actas, setActas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredActas, setFilteredActas] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newActa, setNewActa] = useState({
        Fecha: '',
        Numero: '',
        Detalle: '',
        Acuerdo: '',
        Invitados: '',
        IdUsuarios: [],
    });

    const userRole = localStorage.getItem('userRole') || 'Rol Usuario';
    const canManageActas = ['Administrador', 'Secretario', 'Presidente'].includes(userRole);

    const baseUrlActas = 'https://elias.go.miorganizacion.cl/api/actas.php';
    const baseUrlUsuarios = 'https://elias.go.miorganizacion.cl/api/usuarios.php';

    useEffect(() => {
        fetchActas();
        fetchUsuarios();
    }, []);

    const fetchActas = async () => {
        try {
            const response = await axios.get(baseUrlActas);
            if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                setActas(response.data.data);
                setFilteredActas(response.data.data);
            } else {
                setActas([]);
                setFilteredActas([]);
            }
        } catch (error) {
            console.error('Error al obtener las actas:', error.message);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrlUsuarios}?action=fetch`);
            if (response.data.status === 'success') {
                setUsuarios(response.data.data || []);
            } else {
                console.error('Error al obtener socios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener socios:', error.message);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredActas(
            actas.filter(
                (acta) =>
                    acta.Detalle.toLowerCase().includes(value) ||
                    acta.Acuerdo.toLowerCase().includes(value)
            )
        );
    };

    const handleCreateActa = async () => {
        if (!canManageActas) return;

        const actaData = {
            ...newActa,
            Invitados: newActa.Invitados.trim(),
            Socios: newActa.IdUsuarios, // Enviar los IDs seleccionados
        };

        try {
            const response = await axios.post(baseUrlActas, actaData);
            if (response.data.status === 'success') {
                alert('Acta creada con éxito');
                setShowCreateModal(false);
                setNewActa({
                    Fecha: '',
                    Numero: '',
                    Detalle: '',
                    Acuerdo: '',
                    Invitados: '',
                    IdUsuarios: [],
                });
                fetchActas();
            } else {
                console.error('Error en la respuesta del servidor:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear el acta:', error.message);
        }
    };

    const handleDeleteActa = async (id) => {
        if (!canManageActas || !window.confirm('¿Estás seguro de que deseas eliminar esta acta?')) return;
        try {
            const response = await axios.delete(`${baseUrlActas}?id=${id}`);
            if (response.data.status === 'success') {
                alert('Acta eliminada con éxito');
                fetchActas();
            } else {
                console.error('Error en la respuesta del servidor:', response.data.message);
            }
        } catch (error) {
            console.error('Error al eliminar el acta:', error.message);
        }
    };

    return (
        <div className="actas-container">
            <h2>Gestión de Actas</h2>
            {canManageActas && (
                <Button className="add-button" onClick={() => setShowCreateModal(true)}>
                    + Agregar Acta
                </Button>
            )}
            <input
                type="text"
                className="search-input"
                placeholder="Buscar por detalle o acuerdo"
                value={search}
                onChange={handleSearch}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Número</th>
                        <th>Detalle</th>
                        <th>Acuerdo</th>
                        <th>Socios</th>
                        <th>Invitados</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredActas.map((acta) => (
                        <tr key={acta.Id}>
                            <td>{acta.Fecha || 'No registrada'}</td>
                            <td>{acta.Numero || 'No registrado'}</td>
                            <td>{acta.Detalle || 'No registrado'}</td>
                            <td>{acta.Acuerdo || 'No registrado'}</td>
                            <td>{acta.Socios || 'Sin socios asociados'}</td> {/* Mostrar nombres de socios */}
                            <td>{acta.Invitados || 'No registrados'}</td>
                            <td>
                                {canManageActas && (
                                    <Button
                                        variant="danger"
                                        className="delete-button"
                                        onClick={() => handleDeleteActa(acta.Id)}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Acta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            value={newActa.Fecha}
                            onChange={(e) => setNewActa({ ...newActa, Fecha: e.target.value })}
                        />
                        <label>Número:</label>
                        <input
                            type="number"
                            value={newActa.Numero}
                            onChange={(e) => setNewActa({ ...newActa, Numero: e.target.value })}
                        />
                        <label>Detalle:</label>
                        <textarea
                            value={newActa.Detalle}
                            onChange={(e) => setNewActa({ ...newActa, Detalle: e.target.value })}
                        />
                        <label>Acuerdo:</label>
                        <textarea
                            value={newActa.Acuerdo}
                            onChange={(e) => setNewActa({ ...newActa, Acuerdo: e.target.value })}
                        />
                        <label>Seleccionar socios:</label>
                        <select
                            multiple
                            value={newActa.IdUsuarios}
                            onChange={(e) => {
                                const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
                                setNewActa({ ...newActa, IdUsuarios: selectedIds });
                            }}
                        >
                            {usuarios.map((usuario) => (
                                <option key={usuario.Id} value={usuario.Id}>
                                    {usuario.Nombre}
                                </option>
                            ))}
                        </select>
                        <label>Invitados:</label>
                        <textarea
                            placeholder="Invitados manuales"
                            value={newActa.Invitados}
                            onChange={(e) => setNewActa({ ...newActa, Invitados: e.target.value })}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCreateActa}>
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

export default Actas;
