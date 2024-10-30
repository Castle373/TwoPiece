const express = require('express');
const app = express();
const path = require('path');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '/')));

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
