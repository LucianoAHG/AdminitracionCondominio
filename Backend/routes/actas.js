const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Obtener todas las actas
router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const result = await connection.query('SELECT * FROM Actas');
        await connection.close();
        res.json(result);
    } catch (err) {
        res.status(500).send('Error al obtener las actas');
    }
});

// Obtener una acta por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        const result = await connection.query('SELECT * FROM Actas WHERE Id = ?', [id]);
        await connection.close();
        res.json(result);
    } catch (err) {
        res.status(500).send('Error al obtener el acta');
    }
});

// Crear una nueva acta
router.post('/', async (req, res) => {
    const { Fecha, Numero, Detalle, Acuerdo, Invitados } = req.body;

    console.log('Parámetros recibidos:', { Fecha, Numero, Detalle, Acuerdo, Invitados }); // Depuración

    try {
        const connection = await connectDB();
        await connection.query(`
            INSERT INTO Actas (Fecha, Numero, Detalle, Acuerdo, Invitados)
            VALUES (?, ?, ?, ?, ?)`,
            [Fecha, Numero, Detalle, Acuerdo, Invitados]
        );
        await connection.close();
        res.json({ status: 'success', message: 'Acta creada con éxito' });
    } catch (err) {
        console.error('Error al crear el acta:', err.message);
        res.status(500).json({ status: 'error', message: 'Error al crear el acta', error: err.message });
    }
});




// Actualizar una acta
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Fecha, Numero, Detalle, Acuerdo, Invitados } = req.body;
    try {
        const connection = await connectDB();
        await connection.query(`
            UPDATE Actas
            SET Fecha = ?, Numero = ?, Detalle = ?, Acuerdo = ?, Invitados = ?
            WHERE Id = ?`,
            [Fecha, Numero, Detalle, Acuerdo, Invitados, id]
        );
        await connection.close();
        res.send('Acta actualizada con éxito');
    } catch (err) {
        res.status(500).send('Error al actualizar el acta');
    }
});

// Eliminar una acta
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        await connection.query('DELETE FROM Actas WHERE Id = ?', [id]);
        await connection.close();
        res.send('Acta eliminada con éxito');
    } catch (err) {
        res.status(500).send('Error al eliminar el acta');
    }
});

module.exports = router;
