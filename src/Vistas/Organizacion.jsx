import React, { useState, useEffect } from 'react';
import { FaUserTie, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import '../CSS/Organizacion.css';

const Organizacion = () => {
    const [miembros, setMiembros] = useState([]);
    const baseUrl = 'https://elias.go.miorganizacion.cl/api/organizacion.php';

    useEffect(() => {
        fetchMiembros();
    }, []);

    const fetchMiembros = async () => {
        try {
            const response = await axios.get(baseUrl);
            console.log('Miembros:', response.data);
            if (response.data.status === 'success') {
                setMiembros(response.data.data);
            } else {
                console.error('Error al obtener los miembros:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener los miembros:', error.message);
        }
    };

    return (
        <div className="organizacion-container">
            <h2>Composición del Comité</h2>
            <div className="organizacion-grid">
                {miembros.map((miembro) => (
                    <div key={miembro.IdOrganizacion} className={`organizacion-card ${miembro.Rol.toLowerCase()}`}>
                        <div className="card-content">
                            <FaUserTie className="card-icon" />
                            <div className="card-info">
                                <h3 className="card-name">{miembro.NombreUsuario}</h3>
                                <p className="card-role">{miembro.Rol}</p>
                                <p className="card-contact">
                                    <FaEnvelope className="contact-icon" /> {miembro.Contacto}
                                </p>
                                <p className="card-phone">
                                    <FaPhone className="phone-icon" /> {miembro.Telefono}
                                </p>
                            </div>
                        </div>
                        <div className="card-actions">
                            <button className="edit-button" disabled>
                                <FaEdit /> Editar
                            </button>
                            <button className="delete-button" disabled>
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Organizacion;
