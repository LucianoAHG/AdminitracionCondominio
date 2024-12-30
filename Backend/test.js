const { connectDB } = require('./db');

(async () => {
    try {
        const connection = await connectDB();

        // Prueba una consulta básica
        const result = await connection.query('SELECT 1 AS Test');
        console.log('Resultado de la prueba:', result);

        // Cierra la conexión
        await connection.close();
        console.log('Conexión cerrada exitosamente.');
    } catch (err) {
        console.error('Error durante la prueba de conexión:', err);
    }
})();
