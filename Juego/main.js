import Level0 from './scripts/levels/level0.js';
import Level1 from './scripts/levels/level1.js';
import LevelDress from './scripts/levels/levelDress.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scene: [Level0, Level1, LevelDress],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    dom: {
        createContainer: true,
    },
    pixelArt: true,
};

// Crear la instancia del juego
const game = new Phaser.Game(config);

// Lógica de visibilidad de tabla y login
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-btn");
    const loginContainer = document.getElementById("login-container");
    loginContainer.style.display = "none"; // Mostrar el login inicialmente

    loginButton.addEventListener("click", () => {
        loginContainer.style.display = "none"; // Ocultar el formulario al iniciar sesión
    });

    const habilidadesContainer = document.getElementById("habilidades-container");
    const habilidadesInner = document.querySelector(".habilidades-inner");
    const personajesContainer = document.getElementById("personajes-container");
    const tempImgPersonajes = new Image();  // Crear una nueva imagen para personajes
    const personajesInner = document.querySelector(".personajes-inner");
    tempImgPersonajes.src = "/maderaInvetario2.png";  // Imagen de fondo para los personajes

    tempImgPersonajes.onload = () => {
        // Ajustar tamaño del contenedor al tamaño original de la imagen de fondo
        personajesContainer.style.width = `${tempImgPersonajes.width}px`;
        personajesContainer.style.height = `${tempImgPersonajes.height}px`;

        // Opcional: Eliminar el borde si no es necesario
        personajesContainer.style.border = "none";
        habilidadesContainer.style.width = `${tempImgPersonajes.width}px`;
        habilidadesContainer.style.height = `${tempImgPersonajes.height}px`;

        // Opcional: elimina el borde si ya no es necesario
        habilidadesContainer.style.border = "none";
    };

    async function cargarPersonajes() {
        const personajesInner = document.querySelector(".personajes-inner");
        personajesInner.innerHTML = ""; // Limpiar el contenedor de personajes

        try {
            const response = await fetch('http://localhost:3000/api/personajes'); // URL de la API de personajes
            if (!response.ok) throw new Error('Error al obtener personajes');
            const personajes = await response.json();

            personajes.forEach(personaje => {
                let imagenPersonaje;

                // Aquí asignamos la imagen dependiendo del nombre del personaje
                switch (personaje.nombre.toLowerCase()) {
                    case 'luffy':
                        imagenPersonaje = '/imgShope/luffy.png';
                        break;
                    case 'zoro':
                        imagenPersonaje = '/imgShope/zoro.png';
                        break;
                    case 'nami':
                        imagenPersonaje = '/imgShope/nami.png';
                        break;
                    // Agregar más casos si es necesario
                    default:
                        imagenPersonaje = '/imgShope/personajeDefault.png'; // Imagen por defecto
                        break;
                }

                // Crear la tarjeta para el personaje
                const card = `
            <div class="personaje-card">
                <div class="card-left">
                    <div class="name">
                        <h1>${personaje.nombre}</h1>
                    </div>
                    <div class="image" style="background-image: url('${imagenPersonaje}');"></div>
                </div>
                <div class="card-right">
                    <p>Fuerza: ${personaje.fuerza}</p>
                    <p>Velocidad: ${personaje.velocidad}</p>
                    <button class="btn-equipar">Equipar</button>
                </div>
            </div>`;

                personajesInner.innerHTML += card; // Agregar la tarjeta al contenedor
            });
        } catch (error) {
            console.error("Error al cargar personajes:", error);
        }
    }
    async function cargarHabilidades() {
        habilidadesInner.innerHTML = ""; // Limpiar el contenedor de habilidades

        try {
            const response = await fetch('http://localhost:3000/api/habilidades'); // URL de la API
            if (!response.ok) throw new Error('Error al obtener habilidades');
            const habilidades = await response.json();

            habilidades.forEach(habilidad => {
                let imagenHabilidad;

                // Aquí asignamos la imagen dependiendo del nombre de la habilidad
                switch (habilidad.nombre.toLowerCase()) {
                    case 'stomp':
                        imagenHabilidad = '/imgShope/golpePie.png';
                        break;
                    case 'elephant gun':
                        imagenHabilidad = '/imgShope/Magnum.png';
                        break;
                    case 'jet pistol':
                        imagenHabilidad = '/imgShope/jetPistol.png';
                        break;
                    // Agregar más casos si es necesario
                    default:
                        imagenHabilidad = '/imgShope/signo.png'; // Imagen por defecto si no coincide
                        break;
                }

                // Crear la tarjeta
                const card = `
        <div class="habilidad-card">
            <div class="card-left">
                <div class="name">
                    <h1>${habilidad.nombre}</h1>
                </div>
                <div class="image" style="background-image: url('${imagenHabilidad}');"></div> <!-- La imagen de fondo ahora es dinámica -->
            </div>
            <div class="card-right">
                <p>Costo</p>
                <p>${habilidad.costo}</p>
                <button class="btn-comprar"></button> <!-- El botón ahora es una imagen de fondo -->
            </div>
        </div>`;

                habilidadesInner.innerHTML += card; // Se agrega la tarjeta al contenedor
            });
        } catch (error) {
            console.error("Error al cargar habilidades:", error);
        }
    }

    window.toggleHabilidades = function () {
        habilidadesContainer.style.display = habilidadesContainer.style.display === "none" ? "block" : "none";
        if (habilidadesContainer.style.display === "block") {
            cargarHabilidades(); // Cargar habilidades cuando el contenedor sea visible
        }
    };
    window.togglePersonajes = function () {
        const personajesContainer = document.getElementById("personajes-container");
        personajesContainer.style.display = personajesContainer.style.display === "none" ? "block" : "none";
        if (personajesContainer.style.display === "block") {
            cargarPersonajes(); // Cargar personajes cuando el contenedor sea visible
        }
    };
});


export default game;