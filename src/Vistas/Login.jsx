import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../CSS/Login.css';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Realizar la solicitud de inicio de sesión al backend
            const response = await axios.post('http://go.miorganizacion.cl:3000/api/login', {
                Correo: correo,
                Password: password,
            });

            if (response.data.status === 'success') {
                const user = response.data.data;
                console.log('Usuario autenticado:', user);

                // Almacenar datos básicos en localStorage
                localStorage.setItem('userId', user.Id);
                localStorage.setItem('userName', user.Nombre);
                localStorage.setItem('userRole', user.RolNombre);

                // Redirigir al menú principal
                navigate('/Menu_Principal');
            } else {
                setError(response.data.message || 'Error desconocido');
            }
        } catch (err) {
            console.error('Error en el inicio de sesión:', err);
            setError('Error al iniciar sesión. Verifique sus credenciales.');
        }
    };

    return (
        <div id="login-container">
            <h2 id="welcome-text">¡Bienvenido!</h2>
            <form id="login-form" onSubmit={handleSubmit}>
                <div id="input-group-email">
                    <label htmlFor="email" id="input-label-email">Correo Electrónico</label>
                    <div id="input-with-icon-email">
                        <FaEnvelope id="icon-email" />
                        <input
                            type="email"
                            id="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>
                </div>

                <div id="input-group-password">
                    <label htmlFor="password" id="input-label-password">Contraseña</label>
                    <div id="input-with-icon-password">
                        <FaLock id="icon-password" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>
                </div>

                {error && <p id="error-message">{error}</p>}

                <button id="login-button" type="submit">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default Login;
