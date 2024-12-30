const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Obtener todos los roles
router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const query = 'SELECT Id, Nombre FROM Roles';
        const roles = await connection.query(query);
        res.json({ status: 'success', data: roles });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener roles' });
    }
});

// Obtener un rol por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        const result = await connection.query('SELECT * FROM Roles WHERE Id = ?', [id]);
        await connection.close();
        res.json(result);
    } catch (err) {
        res.status(500).send('Error al obtener el rol');
    }
});

// Crear un nuevo rol
router.post('/', async (req, res) => {
    const { Nombre } = req.body;
    try {
        const connection = await connectDB();
        await connection.query(`
            INSERT INTO Roles (Nombre)
            VALUES (?)`,
            [Nombre]
        );
        await connection.close();
        res.send('Rol creado con éxito');
    } catch (err) {
        res.status(500).send('Error al crear el rol');
    }
});

// Actualizar un rol
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    try {
        const connection = await connectDB();
        await connection.query(`
            UPDATE Roles
            SET Nombre = ?
            WHERE Id = ?`,
            [Nombre, id]
        );
        await connection.close();
        res.send('Rol actualizado con éxito');
    } catch (err) {
        res.status(500).send('Error al actualizar el rol');
    }
});

// Eliminar un rol
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        await connection.query('DELETE FROM Roles WHERE Id = ?', [id]);
        await connection.close();
        res.send('Rol eliminado con éxito');
    } catch (err) {
        res.status(500).send('Error al eliminar el rol');
    }
});

module.exports = router;
