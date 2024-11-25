const { obtenerHabilidades } = require('./carpetabd/habilidadesService');

(async () => {
    try {
        const habilidades = await obtenerHabilidades();
        console.log('Habilidades obtenidas:', habilidades.map(h => h.toJSON()));
    } catch (error) {
        console.error('Error:', error);
    }
})();
