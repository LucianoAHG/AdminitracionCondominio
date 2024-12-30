const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');

// Ruta para obtener miembros de la organización
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();

        console.log('Ejecutando consulta para obtener organización...');

        const query = `
            SELECT 
                U.Id AS IdUsuario,
                U.Nombre AS NombreUsuario,
                U.Correo AS Contacto,
                U.Telefono,
                R.Nombre AS Rol
            FROM Usuarios U
            INNER JOIN Roles R ON U.IdRol = R.Id
            WHERE R.Nombre IN ('Presidente', 'Secretario', 'Tesorero')
        `;

        const result = await db.query(query);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        console.error('Error al obtener la organización:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener la organización',
            error: error.message,
        });
    }
});

module.exports = router;
