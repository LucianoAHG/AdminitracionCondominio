import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/Cuotas.css';

const Cuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
                const filteredCuotas = userRole === 'Usuario'
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
                setUsuarios(response.data.data || []);
            } else {
                console.error('Error al obtener usuarios:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
        }
    };

    const handleCreateCuota = async () => {
        const { IdUsuarios, Monto } = newCuota;

        if (!IdUsuarios.length || !Monto) {
            alert('Por favor, selecciona al menos un usuario y completa el monto.');
            return;
        }

        if (!/^\d+$/.test(Monto) || parseInt(Monto, 10) <= 0) {
            alert('El monto debe ser un número entero positivo.');
            return;
        }

        try {
            const response = await axios.post(`${baseUrlCuotas}?action=create`, { ...newCuota });
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

    const handleUpdateEstadoCuota = async (id, newEstado) => {
        try {
            const response = await axios.get(`${baseUrlCuotas}?action=updateEstado&id=${id}&estado=${newEstado}`);
            if (response.data.status === 'success') {
                alert('Estado de la cuota actualizado');
                fetchCuotas();
            } else {
                console.error('Error al actualizar estado:', response.data.message);
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error.message);
        }
    };

    const handleUpdateFechaPago = async (id, newFechaPago) => {
        try {
            const response = await axios.get(`${baseUrlCuotas}?action=updateFechaPago&id=${id}&fechaPago=${newFechaPago}`);
            if (response.data.status === 'success') {
                alert('Fecha de pago actualizada');
                fetchCuotas();
            } else {
                console.error('Error al actualizar fecha de pago:', response.data.message);
            }
        } catch (error) {
            console.error('Error al actualizar fecha de pago:', error.message);
        }
    };

    return (
        <div className="cuotas-container">
            <h2>Gestión de Cuotas</h2>
            {['Administrador', 'Presidente', 'Secretario', 'Tesorero'].includes(userRole) && (
                <Button className="add-button" onClick={() => setShowCreateModal(true)}>
                    + Crear Cuota
                </Button>
            )}
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
                            <td>${parseFloat(cuota.Monto || 0).toLocaleString('es-CL')}</td>
                            <td>
                                {userRole === 'Tesorero' ? (
                                    <select
                                        value={cuota.Estado}
                                        onChange={(e) => {
                                            handleUpdateEstadoCuota(cuota.Id, e.target.value);
                                            if (e.target.value === 'Pendiente') {
                                                handleUpdateFechaPago(cuota.Id, '----/--/--');
                                            }
                                        }}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Pagada">Pagada</option>
                                    </select>
                                ) : (
                                    cuota.Estado
                                )}
                            </td>
                            <td>
                                {userRole === 'Tesorero' && cuota.Estado === 'Pagada' ? (
                                    <input
                                        type="date"
                                        value={cuota.FechaPago || ''}
                                        onChange={(e) => handleUpdateFechaPago(cuota.Id, e.target.value)}
                                    />
                                ) : (
                                    cuota.Estado === 'Pendiente' ? '----/--/--' : cuota.FechaPago || 'No registrada'
                                )}
                            </td>
                            <td>
                                {['Administrador', 'Presidente', 'Secretario', 'Tesorero'].includes(userRole) && (
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
                </tbody>
            </table>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Cuotas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <label>Seleccionar Usuarios:</label>
                        <select
                            multiple
                            value={newCuota.IdUsuarios}
                            onChange={(e) =>
                                setNewCuota({
                                    ...newCuota,
                                    IdUsuarios: Array.from(e.target.selectedOptions, (option) => option.value),
                                })
                            }
                        >
                            {usuarios.map((usuario) => (
                                <option key={usuario.Id} value={usuario.Id}>
                                    {usuario.Nombre}
                                </option>
                            ))}
                        </select>
                        <label>Monto:</label>
                        <input
                            type="number"
                            placeholder="Monto"
                            value={newCuota.Monto}
                            onChange={(e) => setNewCuota({ ...newCuota, Monto: e.target.value })}
                        />
                        <label>Fecha de Pago (opcional):</label>
                        <input
                            type="date"
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
