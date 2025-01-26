import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Usuarios.css';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        usuarioNombre: '',
        usuarioCorreo: '',
        usuarioTelefono: '',
        usuarioPassword: '',
        usuarioRol: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const baseUrlUsuarios = 'https://elias.go.miorganizacion.cl/api/usuarios.php';
    const baseUrlRoles = 'https://elias.go.miorganizacion.cl/api/roles.php';

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${baseUrlUsuarios}?action=fetch`);
            setUsuarios(response.data.data || []);
        } catch (error) {
            console.error('Error al obtener socios:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(baseUrlRoles);
            setRoles(response.data.data || []);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.usuarioRol) {
            alert('Por favor, selecciona un rol.');
            return;
        }

        try {
            const actionUrl = `${baseUrlUsuarios}?action=${isEditing ? 'update' : 'create'}`;
            const payload = {
                Nombre: formData.usuarioNombre,
                Correo: formData.usuarioCorreo,
                Telefono: formData.usuarioTelefono,
                Password: formData.usuarioPassword,
                IdRol: formData.usuarioRol
            };

            const response = await axios.post(actionUrl, payload);
            if (response.data.status === 'success') {
                alert(isEditing ? 'Socio actualizado con éxito' : 'Socio creado con éxito');
                fetchUsuarios();
                resetForm();
                setShowModal(false);
            } else {
                alert(response.data.message || 'No se pudo guardar el socio.');
            }
        } catch (error) {
            console.error('Error al guardar socio:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    const prepareEditUsuario = (usuario) => {
        setFormData({
            usuarioNombre: usuario?.Nombre || '',
            usuarioCorreo: usuario?.Correo || '',
            usuarioTelefono: usuario?.Telefono || '',
            usuarioPassword: '', // La contraseña no se muestra ni se edita directamente.
            usuarioRol: roles.find((rol) => rol.Nombre === usuario?.RolNombre)?.Id || ''
        });
        setEditId(usuario?.Id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteUsuario = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este socio?')) {
            try {
                const response = await axios.delete(baseUrlUsuarios, {
                    headers: { 'Content-Type': 'application/json' },
                    data: { Id: id },
                });

                if (response.data.status === 'success') {
                    alert('Socio eliminado con éxito');
                    fetchUsuarios();
                } else {
                    alert(response.data.message || 'No se pudo eliminar el socio.');
                }
            } catch (error) {
                console.error('Error al eliminar socio:', error);
                alert('Error al conectar con el servidor.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            usuarioNombre: '',
            usuarioCorreo: '',
            usuarioTelefono: '',
            usuarioPassword: '',
            usuarioRol: ''
        });
        setEditId(null);
        setIsEditing(false);
    };

    return (
        <div className="usuarios-container">
            <h2>Gestión de Socios</h2>

            <Button
                className="add-button"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}
            >
                Agregar Socio
            </Button>

            <h3>Lista de Socios</h3>
            <table className="usuarios-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario?.Id}>
                            <td>{usuario?.Nombre || 'Sin Nombre'}</td>
                            <td>{usuario?.Correo || 'Sin Correo'}</td>
                            <td>{usuario?.Telefono || 'Sin Teléfono'}</td>
                            <td>{usuario?.RolNombre || 'Sin Rol'}</td>
                            <td>
                                <button className="edit-button" onClick={() => prepareEditUsuario(usuario)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteUsuario(usuario?.Id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Socio' : 'Agregar Socio'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faUser} className="input-group-text" />
                                <Form.Control
                                    type="text"
                                    name="usuarioNombre"
                                    value={formData.usuarioNombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faEnvelope} className="input-group-text" />
                                <Form.Control
                                    type="email"
                                    name="usuarioCorreo"
                                    value={formData.usuarioCorreo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faPhone} className="input-group-text" />
                                <Form.Control
                                    type="text"
                                    name="usuarioTelefono"
                                    value={formData.usuarioTelefono}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faLock} className="input-group-text" />
                                <Form.Control
                                    type="password"
                                    name="usuarioPassword"
                                    value={formData.usuarioPassword}
                                    onChange={handleInputChange}
                                    required={!isEditing}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                as="select"
                                name="usuarioRol"
                                value={formData.usuarioRol}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar Rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.Id} value={rol.Id}>
                                        {rol.Nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <div className="modal-buttons">
                            <Button type="submit" className="submit-button">
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="cancel-button"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Usuarios;
