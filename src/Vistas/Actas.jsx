﻿import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/Actas.css';

const Actas = () => {
    const [actas, setActas] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredActas, setFilteredActas] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newActa, setNewActa] = useState({
        Fecha: '',
        Numero: '',
        Detalle: '',
        Acuerdo: '',
        Invitados: '',
    });

    // Base URL configurada para el servidor PHP
    const baseUrl = 'https://elias.go.miorganizacion.cl/api/actas.php';

    useEffect(() => {
        fetchActas();
    }, []);

    const fetchActas = async () => {
        try {
            const response = await axios.get(baseUrl);
            console.log('Respuesta del backend:', response.data);

            // Verificar que la respuesta sea válida
            if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                setActas(response.data.data);
                setFilteredActas(response.data.data);
            } else {
                console.error('Error al obtener las actas:', response.data.message || 'Formato no válido');
                setActas([]);
                setFilteredActas([]);
            }
        } catch (error) {
            console.error('Error al obtener las actas:', error.message);
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
        try {
            const response = await axios.post(baseUrl, newActa);
            console.log('Respuesta de creación:', response.data);

            if (response.data.status === 'success') {
                alert('Acta creada con éxito');
                setShowCreateModal(false);
                setNewActa({ Fecha: '', Numero: '', Detalle: '', Acuerdo: '', Invitados: '' });
                fetchActas();
            } else {
                console.error('Error al crear el acta:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear el acta:', error.message);
        }
    };

    const handleDeleteActa = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta acta?')) {
            try {
                const response = await axios.delete(`${baseUrl}?id=${id}`);
                console.log('Respuesta de eliminación:', response.data);

                if (response.data.status === 'success') {
                    alert('Acta eliminada con éxito');
                    fetchActas();
                } else {
                    console.error('Error al eliminar el acta:', response.data.message);
                }
            } catch (error) {
                console.error('Error al eliminar el acta:', error.message);
            }
        }
    };

    return (
        <div className="actas-container">
            <h2>Gestión de Actas</h2>
            <Button className="add-button" onClick={() => setShowCreateModal(true)}>
                + Agregar Acta
            </Button>
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
                            <td>{acta.Invitados || 'No registrados'}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    className="delete-button"
                                    onClick={() => handleDeleteActa(acta.Id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para Crear Acta */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Acta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <input
                            type="date"
                            placeholder="Fecha"
                            value={newActa.Fecha}
                            onChange={(e) => setNewActa({ ...newActa, Fecha: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Número"
                            value={newActa.Numero}
                            onChange={(e) => setNewActa({ ...newActa, Numero: e.target.value })}
                        />
                        <textarea
                            placeholder="Detalle"
                            value={newActa.Detalle}
                            onChange={(e) => setNewActa({ ...newActa, Detalle: e.target.value })}
                        />
                        <textarea
                            placeholder="Acuerdo"
                            value={newActa.Acuerdo}
                            onChange={(e) => setNewActa({ ...newActa, Acuerdo: e.target.value })}
                        />
                        <textarea
                            placeholder="Invitados"
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
