import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // iconos
import '/src/CSS/Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica de envío del formulario
        console.log('Email:', email, 'Password:', password);

        // 
        navigate('/Menu_Principal'); // Cambia '/home' a la ruta que desees
    };

    return (
        <div className="login-container">
            <h2 className="welcome-text">¡Bienvenido!</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <div className="input-with-icon">
                        <FaEnvelope className="icon" /> {/* Icono de correo */}
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-with-icon">
                        <FaLock className="icon" /> {/* Icono de candado */}
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

                <div className="forgot-password">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
