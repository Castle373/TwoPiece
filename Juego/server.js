const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./database'); // Importa la conexión de Sequelize
const habilidadesRoutes = require('./routes/habilidades'); // Rutas para manejar habilidades

// Servir archivos estáticos desde la carpeta 'public' (incluyendo HTML, JS y CSS)
app.use(express.static(path.join(__dirname, '/')));

// Usar las rutas para manejar las habilidades
app.use('/api/habilidades', habilidadesRoutes);

// Sincronizar la base de datos (esto crea las tablas si no existen)
sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Iniciar el servidor en el puerto 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});