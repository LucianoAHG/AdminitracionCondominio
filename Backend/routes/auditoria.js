const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Obtener todos los registros de auditoría con detalles del usuario
router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const query = `
            SELECT 
                A.Id,
                A.Fecha,
                A.Hora,
                A.Accion,
                A.IdUsuario,
                ISNULL(U.Nombre, 'Usuario no disponible') AS UsuarioNombre
            FROM Auditoria A
            LEFT JOIN Usuarios U ON A.IdUsuario = U.Id
        `;
        console.log('Ejecutando consulta de auditoría:', query);
        const results = await connection.query(query);

        console.log('Resultados obtenidos:', results);

        if (results && results.length > 0) {
            res.json({
                status: 'success',
                message: 'Registros de auditoría obtenidos exitosamente',
                data: results,
            });
        } else {
            res.json({
                status: 'success',
                message: 'No se encontraron registros de auditoría',
                data: [],
            });
        }
    } catch (error) {
        console.error('Error al obtener los registros de auditoría:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los registros de auditoría',
            error: error.message,
        });
    }
});

module.exports = router;
