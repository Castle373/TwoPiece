import Level0 from './scripts/levels/level0.js';
import Level1 from './scripts/levels/level1.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight
    ,
    scene: [Level0, Level1]
    ,physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    // En el futuro, agrega niveles como Level1, Level2 aquí.
    pixelArt: true
};

const game = new Phaser.Game(config);
export default game;
