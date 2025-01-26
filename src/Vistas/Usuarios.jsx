import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../CSS/Usuarios.css';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

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
            usuarioPassword: '',
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(0);
    };

    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.Nombre.toLowerCase().includes(searchTerm) ||
        usuario.Correo.toLowerCase().includes(searchTerm) ||
        usuario.Telefono.toLowerCase().includes(searchTerm) ||
        usuario.RolNombre.toLowerCase().includes(searchTerm)
    );

    const offset = currentPage * itemsPerPage;
    const paginatedUsuarios = filteredUsuarios.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="usuarios-container">
            <h2>Gestión de Socios</h2>

            <div className="usuarios-search-bar">
                <FaSearch id="usuario-search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo, teléfono o rol..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            <Button className="add-button" onClick={() => { resetForm(); setShowModal(true); }}>
                Agregar Socio
            </Button>

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
                    {paginatedUsuarios.map((usuario) => (
                        <tr key={usuario.Id}>
                            <td>{usuario.Nombre}</td>
                            <td>{usuario.Correo}</td>
                            <td>{usuario.Telefono}</td>
                            <td>{usuario.RolNombre}</td>
                            <td>
                                <button className="edit-button" onClick={() => prepareEditUsuario(usuario)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteUsuario(usuario.Id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'←'}
                nextLabel={'→'}
                pageCount={Math.ceil(filteredUsuarios.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName="usuarios-pagination"
                activeClassName="active"
                breakLabel="..."
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Socio' : 'Agregar Socio'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuarioNombre"
                                value={formData.usuarioNombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="usuarioCorreo"
                                value={formData.usuarioCorreo}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="usuarioPassword"
                                value={formData.usuarioPassword}
                                onChange={handleInputChange}
                                required={!isEditing}
                            />
                        </Form.Group>
                        <Button type="submit" className="submit-button">
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Usuarios;
