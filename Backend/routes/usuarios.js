const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Obtener todos los usuarios junto con su rol
router.get('/', async (req, res) => {
    try {
        const db = await connectDB(); // Obtener la conexión
        const query = `
            SELECT 
                u.Id, 
                u.Nombre, 
                u.Correo, 
                u.Telefono, 
                r.Nombre AS RolNombre
            FROM Usuarios u
            LEFT JOIN Roles r ON u.IdRol = r.Id;
        `;
        const result = await db.query(query); // Ejecutar la consulta
        await db.close(); // Cerrar la conexión después de usarla
        res.json({
            status: 'success',
            message: 'Usuarios obtenidos exitosamente',
            data: result,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuarios',
            error: error.message,
        });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { Nombre, Correo, Telefono, Password, IdRol } = req.body;
    try {
        const db = await connectDB(); // Obtener la conexión
        const query = `
            INSERT INTO Usuarios (Nombre, Correo, Telefono, Password, IdRol)
            VALUES (?, ?, ?, ?, ?);
        `;
        const params = [Nombre, Correo, Telefono, Password, IdRol];
        await db.query(query, params); // Ejecutar la consulta
        await db.close(); // Cerrar la conexión después de usarla
        res.json({
            status: 'success',
            message: 'Usuario creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear usuario',
            error: error.message,
        });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Correo, Telefono, Password, IdRol } = req.body;
    try {
        const db = await connectDB(); // Obtener la conexión
        const query = `
            UPDATE Usuarios 
            SET Nombre = ?, Correo = ?, Telefono = ?, Password = ?, IdRol = ?
            WHERE Id = ?;
        `;
        const params = [Nombre, Correo, Telefono, Password, IdRol, id];
        await db.query(query, params); // Ejecutar la consulta
        await db.close(); // Cerrar la conexión después de usarla
        res.json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar usuario',
            error: error.message,
        });
    }
});

module.exports = router;
