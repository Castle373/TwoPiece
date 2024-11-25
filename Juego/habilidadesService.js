const Habilidad = require('./models/Habilidad');

// Función para obtener las habilidades
async function obtenerHabilidades() {
    try {
        const habilidades = await Habilidad.findAll({
            attributes: ['nombre', 'costo'], // Selecciona solo los atributos necesarios
        });
        return habilidades;
    } catch (error) {
        console.error('Error al obtener habilidades:', error);
        throw error;
    }
}

module.exports = { obtenerHabilidades };
