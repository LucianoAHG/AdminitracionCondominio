const express = require('express');
const actasRouter = require('./routes/actas');
const loginRouter = require('./routes/login');
const cuotasRouter = require('./routes/cuotas');
const ingresosEgresosRouter = require('./routes/ingresosEgresos');
const usuariosRouter = require('./routes/usuarios');
const rolesRouter = require('./routes/roles');
const organizacionRouter = require('./routes/organizacion');
const auditoriaRouter = require('./routes/auditoria');
const cors = require('cors');

const app = express();

// Configuración de CORS más permisiva
app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

app.use(express.json()); // Middleware para procesar JSON en las solicitudes

// Rutas para cada tabla de la base de datos
app.use('/api/actas', actasRouter);
app.use('/api/cuotas', cuotasRouter);
app.use('/api/ingresos-egresos', ingresosEgresosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/organizacion', organizacionRouter);
app.use('/api/auditoria', auditoriaRouter);
app.use('/api/login', loginRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
