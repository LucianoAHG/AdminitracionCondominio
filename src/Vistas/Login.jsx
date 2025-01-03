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

        // Validación de campos vacíos
        if (!correo.trim() || !password.trim()) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        try {
            // Realizar la solicitud de inicio de sesión al backend PHP
            const response = await axios.post(
                'https://elias.go.miorganizacion.cl/api/login.php?action=login',
                {
                    Correo: correo.trim(),
                    Password: password.trim(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.status === 'success') {
                const user = response.data.data;

                // Almacenar datos básicos en localStorage
                localStorage.setItem('userId', user.Id);
                localStorage.setItem('userName', user.Nombre);
                localStorage.setItem('userRole', user.Rol);

                // Redirigir al menú principal
                navigate('/Menu_Principal');
            } else {
                setError(response.data.message || 'Credenciales incorrectas.');
            }
        } catch (err) {
            console.error('Error en el inicio de sesión:', err);
            setError('Error al conectar con el servidor. Intente nuevamente más tarde.');
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
