const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const query = `
            SELECT 
                IE.Id AS Id,
                IE.Tipo AS Tipo,
                IE.Categoria AS Categoria,
                CAST(IE.Descripcion AS NVARCHAR(255)) AS Descripcion, -- Limitar nvarchar
                IE.Monto AS Monto,
                CAST(IE.Fecha AS NVARCHAR(10)) AS Fecha, -- Convertir Fecha a texto si es necesario
                IE.IdUsuario AS IdUsuario,
                COALESCE(U.Nombre, 'No asignado') AS UsuarioNombre -- Manejar valores NULL
            FROM IngresosEgresos IE
            LEFT JOIN Usuarios U ON IE.IdUsuario = U.Id;
        `;

        const results = await connection.query(query);

        if (results.length === 0) {
            return res.status(404).json({ status: 'success', message: 'No se encontraron registros', data: [] });
        }

        res.status(200).json({ status: 'success', data: results });
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los registros',
            error: error.message,
        });
    }
});


// Crear un nuevo registro
router.post('/', async (req, res) => {
    const { Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario } = req.body;
    if (!Tipo || !Categoria || !Monto || !Fecha || !IdUsuario) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
    }

    try {
        const connection = await connectDB();
        const query = `
            INSERT INTO IngresosEgresos (Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await connection.query(query, [Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario]);
        res.status(201).json({ status: 'success', message: 'Registro creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el registro:', error);
        res.status(500).json({ status: 'error', message: 'Error al crear el registro', error: error.message });
    }
});

// Actualizar un registro existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario } = req.body;

    if (!Tipo || !Categoria || !Monto || !Fecha || !IdUsuario) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
    }

    try {
        const connection = await connectDB();
        const query = `
            UPDATE IngresosEgresos
            SET Tipo = ?, Categoria = ?, Descripcion = ?, Monto = ?, Fecha = ?, IdUsuario = ?
            WHERE Id = ?;
        `;
        const result = await connection.query(query, [Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario, id]);
        if (result.count === 0) {
            return res.status(404).json({ status: 'error', message: 'Registro no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Registro actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el registro', error: error.message });
    }
});

// Eliminar un registro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectDB();
        const query = `DELETE FROM IngresosEgresos WHERE Id = ?;`;
        const result = await connection.query(query, [id]);
        if (result.count === 0) {
            return res.status(404).json({ status: 'error', message: 'Registro no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Registro eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el registro', error: error.message });
    }
});

module.exports = router;
