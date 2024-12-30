const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Obtener todas las cuotas con el nombre del usuario
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query(`
            SELECT c.Id, c.Monto, c.Estado, c.FechaPago, c.IdUsuario, 
                   ISNULL(u.Nombre, 'No asignado') AS UsuarioNombre
            FROM Cuotas c
            LEFT JOIN Usuarios u ON c.IdUsuario = u.Id
        `);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener cuotas:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener cuotas', error: error.message });
    }
});

// Crear una nueva cuota
router.post('/', async (req, res) => {
    const { IdUsuario, Monto, Estado, FechaPago } = req.body;
    try {
        const connection = await connectDB();
        await connection.query(`
            INSERT INTO Cuotas (IdUsuario, Monto, Estado, FechaPago)
            VALUES (?, ?, ?, ?)`,
            [IdUsuario, Monto, Estado, FechaPago]
        );
        await connection.close();
        res.send('Cuota creada con éxito');
    } catch (err) {
        res.status(500).send('Error al crear la cuota');
    }
});

// Actualizar una cuota
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Monto, Estado, FechaPago } = req.body;
    try {
        const connection = await connectDB();
        await connection.query(`
            UPDATE Cuotas
            SET Monto = ?, Estado = ?, FechaPago = ?
            WHERE Id = ?`,
            [Monto, Estado, FechaPago, id]
        );
        await connection.close();
        res.send('Cuota actualizada con éxito');
    } catch (err) {
        res.status(500).send('Error al actualizar la cuota');
    }
});

// Eliminar una cuota
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        await connection.query('DELETE FROM Cuotas WHERE Id = ?', [id]);
        await connection.close();
        res.send('Cuota eliminada con éxito');
    } catch (err) {
        res.status(500).send('Error al eliminar la cuota');
    }
});

module.exports = router;
