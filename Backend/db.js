require('dotenv').config(); // Cargar las variables de entorno
const odbc = require('odbc'); // Importar el paquete ODBC

// Configuración de conexión
const connectionString = `Driver=ODBC Driver 17 for SQL Server;Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};UID=${process.env.DB_USER};PWD=${process.env.DB_PASSWORD};Encrypt=no;TrustServerCertificate=yes;`;

// Crear una conexión y exportarla como una promesa
const connectDB = async () => {
    try {
        const connection = await odbc.connect(connectionString);
        console.log('Conexión a la base de datos establecida.');
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
};

module.exports = { connectDB };
