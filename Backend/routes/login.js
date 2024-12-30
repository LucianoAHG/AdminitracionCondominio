const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Ruta para el inicio de sesión
router.post('/', async (req, res) => {
    const { Correo, Password } = req.body;

    if (!Correo || !Password) {
        return res.status(400).json({
            status: 'error',
            message: 'Correo y contraseña son obligatorios',
        });
    }

    try {
        // Establecer conexión a la base de datos
        const db = await connectDB();

        // Consulta para validar el usuario en la base de datos
        const query = `
            SELECT u.Id, u.Nombre, u.Correo, u.IdRol, r.Nombre AS RolNombre
            FROM Usuarios u
            LEFT JOIN Roles r ON u.IdRol = r.Id
            WHERE u.Correo = ? AND u.Password = ?;
        `;
        const params = [Correo, Password];
        const result = await db.query(query, params);

        if (result.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Correo o contraseña incorrectos',
            });
        }

        // Usuario encontrado
        const usuario = result[0];
        res.json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            data: {
                Id: usuario.Id,
                Nombre: usuario.Nombre,
                Correo: usuario.Correo,
                RolId: usuario.IdRol,
                RolNombre: usuario.RolNombre,
            },
        });
    } catch (error) {
        console.error('Error al procesar el inicio de sesión:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
            error: error.message,
        });
    }
});

module.exports = router;
