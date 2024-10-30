import Fondo from '../elementos/fondo.js';
import Barco from '../elementos/barco.js';
import Luffy from '../elementos/luffy.js';

export default class Nivel0 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level0' });
    }

    preload() {
        // Aquí no cargamos los recursos directamente
        // Se cargan en cada clase correspondiente
        this.load.atlas('luffy', 'recursos/img/luffy.png', 'recursos/img/luffy_atlas.json');
        this.load.image('fondo', 'recursos/img/fondo2.png');
        this.load.atlas('barco', 'recursos/img/barco.png', 'recursos/img/barco.json');
        this.load.image('barcoParteAlta', 'recursos/img/barcoParteAlta.png');
        this.load.image('fondo2', 'recursos/img/fondo2R.png');
        this.load.image('logo', 'recursos/img/logo.png'); // Logo
        this.load.image('boton', 'recursos/img/boton.png'); // Botón
        this.load.audio('oceano', 'recursos/sound/oceano.mp3'); // Sonido de fondo
        this.load.audio('hoverSound', 'recursos/sound/boton.wav');
        this.load.audio('logoSound', 'recursos/sound/logo.mp3');
        this.load.image('piso', 'recursos/img/piso.png');
        this.load.tilemapTiledJSON('map', 'recursos/scripts/piso.json'); // Carga del tilemap
    }

    create() {
        
        this.fondo = new Fondo(this);
        this.createTilemap();
        this.image=this.add.image(-(this.sys.game.config.width / 6), (this.sys.game.config.height / 4), 'barcoParteAlta').setOrigin(0, 0);
        this.luffy = new Luffy(this);
        this.barco = new Barco(this);
        
        
        
         // Crear tilemap
     
     
        this.createLogo(); // Crear logo
        this.createButton(); // Crear botón
        this.playBackgroundMusic(); // Reproducir música de fondo

        this.barco.animar(this.image);
       

    }

    createTilemap() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('piso', 'piso'); // Cambia por el nombre de tu tileset
        this.barcocolision = map.createLayer("Capa de patrones 2", tileset, -(this.sys.game.config.width / 6), (this.sys.game.config.height / 4));
        // Cambia por el nombre de tu capa
        this.barcocolision.setCollisionByProperty({ colision: true });
    }

    createLogo() {
        const logo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 3, 'logo').setOrigin(0.5, 1);
        logo.setScale(0.5); // Reducir el tamaño del logo al 50%
        this.logoSound = this.sound.add('logoSound', { loop: false });
        this.logoSound.play();
            // Reproducir el sonido del logo cada minuto
            setInterval(() => {
                this.logoSound.play();
            }, 60000); // 60000 milisegundos = 1 minuto
            logo.setInteractive();
            logo.on('pointerdown', () => {
                this.logoSound.play();
            });
    }

    createButton() {
        const boton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'boton').setOrigin(0.5);
        boton.setInteractive(); // Hacer el botón interactivo
        boton.setScale(0.3); // Reducir el tamaño del botón al 30%
        const hoverSound = this.sound.add('hoverSound');
        hoverSound.setVolume(0.1);
        boton.on('pointerover',   () => {
            boton.setScale(0.32); // Aumenta el tamaño del botón
            hoverSound.play();
        });

        boton.on('pointerout',  () => {
            boton.setScale(0.3); // Vuelve al tamaño original
        });
        boton.on('pointerdown', () => {
            this.sound.stopAll()
            this.scene.start('Level1'); // Cambiar a la escena Nivel1
        });
        
    }
    
    playBackgroundMusic() {
        const playa=this.sound.add('oceano',{loop:true}); // Reproducir sonido de fondo en bucle
        playa.play();
        playa.setVolume(0.05);
    }

    onButtonClick() {
        console.log('Botón presionado!');
        // Aquí puedes agregar lógica para cambiar de nivel o ejecutar otra acción
    }

    update() {
        this.fondo.update();
        this.luffy.update();
    }
}
