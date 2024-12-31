import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../CSS/Cuotas.css';

const Cuotas = () => {
    const [cuotas, setCuotas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCuota, setNewCuota] = useState({
        IdUsuario: '',
        Monto: '',
        Estado: 'Pendiente',
        FechaPago: '',
    });

    const baseUrlCuotas = 'https://elias.go.miorganizacion.cl/api/cuotas.php';
    const baseUrlUsuarios = 'https://elias.go.miorganizacion.cl/api/usuarios.php';

    useEffect(() => {
        fetchCuotas();
        fetchUsuarios();
    }, []);

    // Fetch cuotas from the backend
    const fetchCuotas = async () => {
        try {
            const response = await axios.get(`${baseUrlCuotas}?action=fetch`);
            if (response.data.status === 'success') {
                setCuotas(response.data.data || []);
            } else {
                console.error('Error al obtener cuotas:', response.data.message);
                setCuotas([]);
            }
        } catch (error) {
            console.error('Error al obtener cuotas:', error.message);
        }
    };

    // Fetch usuarios from the backend
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrlUsuarios}?action=fetch`);
            console.log('Respuesta de usuarios:', response.data); // Depuración
            if (response.data.status === 'success') {
                setUsuarios(response.data.data || []);
            } else {
                console.error('Error al obtener usuarios:', response.data.message);
                setUsuarios([]);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
            setUsuarios([]);
        }
    };

    const handleCreateCuota = async () => {
        if (!newCuota.IdUsuario || !newCuota.Monto) {
            alert('Por favor, selecciona un usuario y completa el monto.');
            return;
        }

        try {
            const response = await axios.post(`${baseUrlCuotas}?action=create`, newCuota);
            if (response.data.status === 'success') {
                alert('Cuota creada exitosamente');
                setShowCreateModal(false);
                setNewCuota({ IdUsuario: '', Monto: '', Estado: 'Pendiente', FechaPago: '' });
                fetchCuotas();
            } else {
                console.error('Error al crear cuota:', response.data.message);
            }
        } catch (error) {
            console.error('Error al crear cuota:', error.message);
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
                            <td>${parseFloat(cuota.Monto || 0).toLocaleString('es-CL')}</td>
                            <td>{cuota.Estado}</td>
                            <td>{cuota.FechaPago || 'No registrada'}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    className="delete-button"
                                    onClick={() => handleDeleteCuota(cuota.Id)}
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
                    <Modal.Title>Crear Cuota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-form">
                        <select
                            value={newCuota.IdUsuario}
                            onChange={(e) => setNewCuota({ ...newCuota, IdUsuario: e.target.value })}
                        >
                            <option value="">Seleccionar Usuario</option>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario) => (
                                    <option key={usuario.Id} value={usuario.Id}>
                                        {usuario.Nombre} - {usuario.Correo}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay usuarios disponibles</option>
                            )}
                        </select>
                        <input
                            type="number"
                            placeholder="Monto"
                            value={newCuota.Monto}
                            onChange={(e) => setNewCuota({ ...newCuota, Monto: e.target.value })}
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
