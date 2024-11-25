const express = require('express');
const Habilidad = require('../models/Habilidad'); // Importa el modelo de habilidad
const router = express.Router();

// Ruta para obtener todas las habilidades
router.get('/', async (req, res) => {
    try {
        const habilidades = await Habilidad.findAll(); // Obtiene todas las habilidades de la base de datos
        res.json(habilidades); // Devuelve las habilidades en formato JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las habilidades');
    }
});

module.exports = router;
