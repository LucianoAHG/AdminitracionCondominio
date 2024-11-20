import React from 'react';
import { FaUserTie, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import '/src/CSS/Organizacion.css';

const Organizacion = () => {
    const data = [
        { nombre: 'Juan Pérez', rol: 'Presidente', contacto: 'juan.perez@example.com', telefono: '+56912345678' },
        { nombre: 'María Gómez', rol: 'Secretario', contacto: 'maria.gomez@example.com', telefono: '+56998765432' },
        { nombre: 'Carlos Sánchez', rol: 'Tesorero', contacto: 'carlos.sanchez@example.com', telefono: '+56911223344' },
    ];

    return (
        <div className="organizacion-container">
            <h2>Composición del Comité</h2>
            <div className="organizacion-grid">
                {data.map((miembro, index) => (
                    <div key={index} className={`organizacion-card ${miembro.rol.toLowerCase()}`}>
                        <div className="card-content">
                            <FaUserTie className="card-icon" />
                            <div className="card-info">
                                <h3 className="card-name">{miembro.nombre}</h3>
                                <p className="card-role">{miembro.rol}</p>
                                <p className="card-contact">
                                    <FaEnvelope className="contact-icon" /> {miembro.contacto}
                                </p>
                                <p className="card-phone">
                                    <FaPhone className="phone-icon" /> {miembro.telefono}
                                </p>
                            </div>
                        </div>
                        <div className="card-actions">
                            <button className="edit-button">
                                <FaEdit /> Editar
                            </button>
                            <button className="delete-button">
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
