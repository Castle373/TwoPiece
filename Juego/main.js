import Level0 from './scripts/levels/level0.js';
import Level1 from './scripts/levels/level1.js';
import LevelDress from './scripts/levels/levelDress.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // Vincula el canvas de Phaser al contenedor HTML
    scene: [Level0, Level1,LevelDress],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: true }
        
    },
    pixelArt: true
};

// Crear la instancia del juego
const game = new Phaser.Game(config);

// Lógica adicional para manejar elementos HTML
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-btn");

    //ocultarlo por el momento alv
    const loginContainer = document.getElementById("login-container");
    loginContainer.style.display = "none";
    


    // Ocultar formulario de inicio de sesión al hacer clic en el botón
    loginButton.addEventListener("click", () => {
        const loginContainer = document.getElementById("login-container");
        loginContainer.style.display = "none";  // Ocultar el formulario
    });
});

export default game;
