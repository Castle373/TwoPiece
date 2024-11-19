
import Doffy from '../elementos/Doffy.js';
import Luffy from '../elementos/luffy.js';


export default class LevelDress extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelDress' });
        this.atacar = true;
    }

    preload() {
        this.load.atlas('luffy', 'recursos/img/luffy.png', 'recursos/img/luffy_atlas.json');
        this.load.atlas('doffy', 'recursos/img/doffy.png', 'recursos/img/doffy_atlas.json');
        this.load.atlas('hilo', 'recursos/img/hilo.png', 'recursos/img/hilo_atlas.json');
        this.load.atlas('vida', 'recursos/img/barravida.png', 'recursos/img/barravida_atlas.json');
        this.load.atlas('corazones', 'recursos/img/corazones.png', 'recursos/img/corazones_atlas.json');
        this.load.json('corazonAnims', 'recursos/img/corazones_anim.json');
        this.load.json('doffyAnims', 'recursos/img/doffy_anim.json');
        this.load.json('hiloAnims', 'recursos/img/hilo_anim.json');
        this.load.image('items', 'recursos/img/items.png');
        this.load.image('piso', 'recursos/img/piso.png');
        this.load.image('ladrillos', 'recursos/img/ladrillos.png');
        this.load.image('coliseo', 'recursos/img/coliseo.jpeg');
        this.load.audio('cesped1', 'recursos/sound/caminarCesped.wav');
        this.load.audio('cesped2', 'recursos/sound/caminarCesped2.wav');
        this.load.audio('caminarcesped', 'recursos/sound/caminarCesped.wav');

        //Ataques Doffy
        this.load.audio('hiloAbajoTiro', 'recursos/sound/hiloAbajoTiro.wav');
        this.load.audio('hiloAbajoGrito', 'recursos/sound/hiloAbajo.wav');
        this.load.audio('hiloArribaTiro', 'recursos/sound/hiloArribaTiro.wav');
        this.load.audio('hiloArribaGrito', 'recursos/sound/hiloArriba.wav');
        this.load.audio('risaDoffy', 'recursos/sound/risaDoffy.wav');
        this.load.audio('cambioLugar', 'recursos/sound/cambioLugar.wav');

        
        this.load.audio('golpeKaido', 'recursos/sound/golpeKaido.wav');
        this.load.audio('ruidoGolpe', 'recursos/sound/ruidoGolep.wav');
        this.load.audio('golpeLuffy', 'recursos/sound/golpeluffy (2).wav');
        this.load.audio('golpeCaida', 'recursos/sound/caidaGolpe.wav');
        this.load.audio('oraKaido', 'recursos/sound/golpeKaidoSonido.wav');
        this.load.tilemapTiledJSON('mapa', 'recursos/scripts/pisoLevelDress.json'); // Carga del tilemap
        this.add.text(100, 100, 'Bienvenido a Nivel 1', { fontSize: '32px', fill: '#fff' });
    }
    updateVidaDisplay() {
        // Mostrar la vida en la interfaz de usuario, usando el atlas de 'vida'
        this.corazon= this.add.sprite(165,50, 'corazones',0);
        this.corazon.setScrollFactor(0);
        this.corazon.play('palpitar');
        this.corazon.setScale(0.1); 
        this.vidaDisplay = this.add.sprite(10, 10, 'vida', `corazon_(${this.luffyVidas})`);

        this.vidaDisplay.setOrigin(0, 0); // Asegúrate de que el origen esté centrado
        this.vidaDisplay.setScale(0.4);
        this.vidaDisplay.setScrollFactor(0);
    }
    create() {
        this.luffyVidas = 5;
        this.background = this.add.image(0, 0, 'coliseo').setOrigin(0).setScrollFactor(0);
        this.background.displayWidth = this.cameras.main.width;
        this.background.displayHeight = this.cameras.main.height;

        this.hiloAbajoTiro = this.sound.add('hiloAbajoTiro');
        this.hiloAbajoGrito = this.sound.add('hiloAbajoGrito');
        this.hiloArribaTiro = this.sound.add('hiloArribaTiro');
        this.hiloArribaGrito = this.sound.add('hiloArribaGrito');
        this.risaDoffy = this.sound.add('risaDoffy');
        this.cambioLugar = this.sound.add('cambioLugar');
        this.cambioLugar.setVolume(0.5);
        
        this.createColisiones();
        this.proyectiles = this.physics.add.group();
        this.luffy = new Luffy(this, this.pisoColision, 400, 500);
        this.doffy = new Doffy(this, this.pisoColision, 1200, 100);
        this.createTilemap();
        //  this.physics.add.collider(this.luffy.sprite, this.swordmanGroup, this.handlePlayerEnemyCollision, null, this);
        //    this.physics.add.overlap(this.luffy.sprite, this.kaido.sprite, () => {
        //        this.handlePlayerEnemyCollision();
        //    });
        //   this.swordman= new Swordman(this,this.pisoColision,100,100);
        

        // Acceder a los proyectiles de Doffy y agregar un collider
        this.physics.add.collider(this.proyectiles , this.luffy.sprite, this.handleProjectileHitLuffy, null, this);

        
        this.createAnimationsCorazon() ;
        this.updateVidaDisplay();
        this.createHealthBar();
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
        this.cameras.main.startFollow(this.luffy.sprite);
        this.luffy.landSound = this.sound.add('caminarcesped');
        this.luffy.walkSounds = [
            this.sound.add('cesped1'),
            this.sound.add('cesped2')
        ];

        this.caidaC = this.sound.add('golpeCaida');
        this.golpeL = this.sound.add('golpeLuffy');
        this.golpeK = this.sound.add('golpeKaido');
        this.ruidoGolpe = this.sound.add('ruidoGolpe');
        this.luffy.walkSounds[0].setRate(1.7);
        this.luffy.walkSounds[1].setRate(1.7);
        this.luffy.walkSounds[0].setVolume(0.3);
        this.luffy.walkSounds[1].setVolume(0.3);
    }
    handleProjectileHitLuffy(luffy, proyectil) {
        // Destruir el proyectil
        proyectil.destroy();//

        // Aplicar daño a Luffy
        this.takeDamage(1);
    }
    takeDamage(amount) {
        this.luffyVidas -= amount;

        // Si Luffy tiene vidas restantes, actualizar la visualización
        if (this.luffyVidas > 0) {
            this.vidaDisplay.setFrame(`corazon_(${this.luffyVidas})`);
            this.corazon.setPosition(this.corazon.x-33,this.corazon.y)
            this.vidaDisplay.setOrigin(0, 0); // Asegúrate de que el origen esté centrado
             this.vidaDisplay.setScale(0.4);
        } else {
            // Lógica para cuando Luffy pierde todas las vidas
            this.endLevel();
        }
    }
    createHealthBar() {
        // Fondo de la barra con borde negro grueso
        this.healthBarBackground = this.add.graphics();
        const barWidth = 600;  // Ancho de la barra total (con borde incluido)
        const barHeight = 20;  // Alto de la barra
        const borderRadius = 10;  // Radio de los bordes redondeados
        const borderWidth = 3;  // Ancho del borde negro

        // Fondo negro (borde grueso)
        this.healthBarBackground.fillStyle(0x000000, 1); // Color negro para el borde
        this.healthBarBackground.fillRoundedRect((this.cameras.main.width - barWidth) / 2 - borderWidth,
            10 - borderWidth,
            barWidth + 2 * borderWidth,
            barHeight + 2 * borderWidth,
            borderRadius); // Borde negro grueso

        // Fondo gris oscuro (fondo de la barra)
        this.healthBarBackground.fillStyle(0x222222, 1); // Fondo gris oscuro
        this.healthBarBackground.fillRoundedRect((this.cameras.main.width - barWidth) / 2,
            10,
            barWidth,
            barHeight,
            borderRadius); // Barra de fondo gris oscuro

        // Barra de vida (verde, también con bordes redondeados)
        this.healthBar = this.add.graphics();
        this.updateHealthBar(); // Establecer la barra con la salud inicial

        // Evitar que se desplace con la cámara
        this.healthBarBackground.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
    }

    updateHealthBar() {
        // Limpiar la barra de vida y actualizarla según la salud de Kaido
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1); // Color verde para la barra de vida

        const barWidth = 600; // Ancho total de la barra
        const healthWidth = (this.doffy.health / this.doffy.maxHealth) * barWidth; // Ancho relativo a la salud

        // Centrar la barra de salud dentro del área de la barra total
        const screenWidth = this.cameras.main.width;
        const barHeight = 20;
        const borderRadius = healthWidth < 100 ? 5 : 10;

        // Dibuja la barra de salud (verde) con el borde negro grueso
        this.healthBar.fillRoundedRect((screenWidth - barWidth) / 2, 10, healthWidth, barHeight, borderRadius); // Centrado horizontalmente
    }



    createAnimationsCorazon() {
        const animsData = this.cache.json.get('corazonAnims');
        console.log(animsData);
        animsData.anims.forEach(anim => {

            this.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });


    }
    createColisiones() {

        this.mapa = this.make.tilemap({ key: 'mapa' });
        const pisoTileset = this.mapa.addTilesetImage('piso', 'piso');
        const decoracionTileset = this.mapa.addTilesetImage('ladrillos', 'ladrillos');
        //const tileset = this.mapa.addTilesetImage('pisoPiedra', 'pisopiedra'); // Conjunto,imagen
        this.pisoColision = this.mapa.createLayer("piso", pisoTileset, 0, 0);

        this.pisoColision.setCollisionByProperty({ colision: true });


        this.decoracion = this.mapa.createLayer('ladrillos', decoracionTileset, 0, 0);
    }
    createTilemap() {


        this.spawnObjects = {};

        // Obtener la capa de objetos
        const objectLayer = this.mapa.getObjectLayer('objectos').objects;

        // Guardar los objetos en el diccionario
        objectLayer.forEach(obj => {
            this.spawnObjects[obj.name] = { x: obj.x, y: obj.y, properties: obj.properties };
            if (obj.name === 'doffyRiendo') {
                this.doffy.sprite.setPosition(obj.x, obj.y);
            }
        });



    }
    update() {
        this.luffy.update();
        this.updateHealthBar();
        if (!this.luffy.isAttacking) {
            this.atacar = true;
        }
        this.doffy.update();
    }
    endLevel() {
        this.scene.start('Level0');
    }
}
