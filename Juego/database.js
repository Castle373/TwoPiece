const { Sequelize } = require('sequelize');

// Configuración de la conexión
const sequelize = new Sequelize('twopiece', 'root', '12345', {
    host: 'localhost',   // Cambia según tu configuración
    dialect: 'mysql',    // Cambia a 'postgres', 'sqlite', etc., según tu base de datos
});

// Probar conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos.');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
})();

module.exports = sequelize;
