import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/Cuotas.css';

const Cuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchUsuario, setSearchUsuario] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCuota, setNewCuota] = useState({
        IdUsuario: '',
        Monto: '',
        Estado: 'Pendiente',
        FechaPago: '',
    });
    const [assignToAll, setAssignToAll] = useState(false);
    const [meses, setMeses] = useState('');

    const baseUrlCuotas = 'http://localhost:3000/api/cuotas';
    const baseUrlUsuarios = 'http://localhost:3000/api/usuarios';

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchCuotas();
        fetchUsuarios();
    }, []);

    const fetchCuotas = async () => {
        try {
            const response = await axios.get(baseUrlCuotas, {
                headers: getAuthHeader(),
            });
            setCuotas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener cuotas:', error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(baseUrlUsuarios, {
                headers: getAuthHeader(),
            });
            const usuariosData = Array.isArray(response.data) ? response.data : [];
            setUsuarios(usuariosData);
            setFilteredUsuarios(usuariosData);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setUsuarios([]);
            setFilteredUsuarios([]);
        }
    };

    const handleCreateCuota = async () => {
        try {
            if (assignToAll) {
                const usuariosRolUsuario = usuarios.filter((usuario) => usuario.Rol === 'Usuario');
                await Promise.all(
                    usuariosRolUsuario.map((usuario) =>
                        axios.post(
                            baseUrlCuotas,
                            {
                                IdUsuario: usuario.Id,
                                Monto: newCuota.Monto,
                                Estado: newCuota.Estado,
                                FechaPago: newCuota.FechaPago,
                                Meses: meses,
                            },
                            { headers: getAuthHeader() }
                        )
                    )
                );
            } else {
                await axios.post(
                    baseUrlCuotas,
                    { ...newCuota, Meses: meses },
                    { headers: getAuthHeader() }
                );
            }
            alert('Cuota(s) creada(s) con éxito');
            setShowCreateModal(false);
            setNewCuota({ IdUsuario: '', Monto: '', Estado: 'Pendiente', FechaPago: '' });
            setMeses('');
            setAssignToAll(false);
            fetchCuotas();
        } catch (error) {
            console.error('Error al crear cuota:', error);
        }
    };

    const handleSearchUsuario = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchUsuario(value);
        setFilteredUsuarios(
            usuarios.filter(
                (usuario) =>
                    usuario.Nombre.toLowerCase().includes(value) ||
                    usuario.Correo.toLowerCase().includes(value)
            )
        );
    };

    return (
        <div className="cuotas-container">
            <h2>Gestión de Cuotas</h2>
            <Button className="add-button" onClick={() => setShowCreateModal(true)}>
                + Crear Cuota
            </Button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Fecha de Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cuotas.map((cuota) => (
                        <tr key={cuota.Id}>
                            <td>{cuota.UsuarioNombre || 'No asignado'}</td>
                            <td>${cuota.Monto?.toLocaleString('es-CL')}</td>
                            <td>{cuota.Estado}</td>
                            <td>{cuota.FechaPago || 'No registrada'}</td>
                            <td>
                                {/* Agregar acciones si es necesario */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para Crear Cuota */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Cuota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <select
                            value={newCuota.IdUsuario}
                            onChange={(e) => setNewCuota({ ...newCuota, IdUsuario: e.target.value })}
                            disabled={assignToAll}
                        >
                            <option value="">Seleccionar Usuario</option>
                            {Array.isArray(filteredUsuarios) &&
                                filteredUsuarios.map((usuario) => (
                                    <option key={usuario.Id} value={usuario.Id}>
                                        {usuario.Nombre} - {usuario.Correo}
                                    </option>
                                ))}
                        </select>
                        <div>
                            <input
                                type="checkbox"
                                id="assignToAll"
                                checked={assignToAll}
                                onChange={(e) => setAssignToAll(e.target.checked)}
                            />
                            <label htmlFor="assignToAll">Asignar a todos los usuarios</label>
                        </div>
                        <input
                            type="number"
                            placeholder="Monto"
                            value={newCuota.Monto}
                            onChange={(e) => setNewCuota({ ...newCuota, Monto: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Meses"
                            value={meses}
                            onChange={(e) => setMeses(e.target.value)}
                        />
                        <select
                            value={newCuota.Estado}
                            onChange={(e) => setNewCuota({ ...newCuota, Estado: e.target.value })}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pagada">Pagada</option>
                        </select>
                        <input
                            type="date"
                            placeholder="Fecha de Pago"
                            value={newCuota.FechaPago}
                            onChange={(e) => setNewCuota({ ...newCuota, FechaPago: e.target.value })}
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
