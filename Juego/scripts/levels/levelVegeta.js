import Luffy from '../elementos/luffy.js';
import Vegeta from '../elementos/vegeta.js';


export default class LevelVegeta extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelVegeta' });
        this.atacar = true;

    }

    preload() {
        this.load.atlas('luffy', 'recursos/img/luffy.png', 'recursos/img/luffy_atlas.json');
        this.load.atlas('vegeta', 'recursos/img/vegeta.png', 'recursos/img/vegeta_atlas.json');
        this.load.atlas('vida', 'recursos/img/barravida.png', 'recursos/img/barravida_atlas.json');
        this.load.atlas('corazones', 'recursos/img/corazones.png', 'recursos/img/corazones_atlas.json');
        this.load.json('corazonAnims', 'recursos/img/corazones_anim.json');
        this.load.image('Torneo', 'recursos/img/VegetaTorneo.png');
        this.load.image('piso4', 'recursos/img/piso4.png');
        this.load.audio('cesped1', 'recursos/sound/caminarCesped.wav');
        this.load.audio('cesped2', 'recursos/sound/caminarCesped2.wav');
        this.load.audio('caminarcesped', 'recursos/sound/caminarCesped.wav');
        this.load.tilemapTiledJSON('mapa', 'recursos/scripts/pisoLevelTorneo.json'); // Carga del tilemap
        this.load.json('vegetaanimado', 'recursos/img/vegeta_anim.json');
        this.load.atlas('onda', 'recursos/img/onda.png', 'recursos/img/onda_atlas.json');
        this.load.json('ondaanimada', 'recursos/img/onda_anim.json');
    }

    create() {
        this.vidasPersonaje = 5;
        this.background = this.add.image(0, 0, 'Torneo').setOrigin(0).setScrollFactor(0);
        this.background.displayWidth = this.cameras.main.width;
        this.background.displayHeight = this.cameras.main.height;
        this.createTilemap();
        this.sac = this.physics.add.group();



        this.luffy = new Luffy(this, this.pisoColision, 400, 100);
        this.Vegeta = new Vegeta(this, this.pisoColision, 600, 100, this.luffy.sprite);

        this.physics.add.overlap(this.luffy.sprite, this.Vegeta.sprite, this.detectarColision, null, this);
        this.physics.add.overlap(this.luffy.sprite, this.sac, this.kame, null, this);

        //   this.swordman= new Swordman(this,this.pisoColision,100,100);
        this.createHealthBar();
        this.createAnimationsCorazon();
        this.updateVidaDisplay();

        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
        this.cameras.main.startFollow(this.luffy.sprite);
        this.isDamaging=false;

    }

    kame(l, s) {
        if (!this.isDamaging) {
            this.isDamaging = true;  // Activa la bandera de daño continuo
                  this.takeDamage(1); // Aplica daño de 2

            // Temporizador que desactiva el daño después de 1 segundo
            this.time.delayedCall(1000, () => {
                this.isDamaging = false; // Desactiva la bandera después de 1 segundo
            });
        }
    }
    detectarColision(l, v) {
        if (this.Vegeta.daño) {
            this.takeDamage(1)
            this.Vegeta.daño = false;
        }
        if (this.luffy.colisionAtaque && !this.luffy.hasHit) {
            const damage = this.luffy.getAttackDamage();
            this.Vegeta.health -= damage;
            console.log("caca");
            if (this.Vegeta.health <= 0) {
                this.Vegeta.health = 0;
                this.Vegeta.die();
            }

            this.luffy.hasHit = true; // Marca que el daño ya fue aplicado
        }

    }

    updateVidaDisplay() {
        // Mostrar la vida en la interfaz de usuario, usando el atlas de 'vida'
        this.corazon = this.add.sprite(165, 50, 'corazones', 0);
        this.corazon.setScrollFactor(0);
        this.corazon.play('palpitar');
        this.corazon.setScale(0.1);
        this.vidaDisplay = this.add.sprite(10, 10, 'vida', `corazon_(${this.vidasPersonaje})`);

        this.vidaDisplay.setOrigin(0, 0); // Asegúrate de que el origen esté centrado
        this.vidaDisplay.setScale(0.4);
        this.vidaDisplay.setScrollFactor(0);
    }

    createOndaAnimada() {
        const animsData = this.cache.json.get('ondaanimada');
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
        this.createOndaAnimada();

    }

    takeDamage(amount) {
        this.vidasPersonaje -= amount;

        // Si Luffy tiene vidas restantes, actualizar la visualización
        if (this.vidasPersonaje > 0) {
            this.vidaDisplay.setFrame(`corazon_(${this.vidasPersonaje})`);
            this.corazon.setPosition(this.corazon.x - 33, this.corazon.y)
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
        const healthWidth = (this.Vegeta.health / this.Vegeta.maxHealth) * barWidth; // Ancho relativo a la salud

        // Centrar la barra de salud dentro del área de la barra total
        const screenWidth = this.cameras.main.width;
        const barHeight = 20;
        const borderRadius = healthWidth < 100 ? 5 : 10;

        // Dibuja la barra de salud (verde) con el borde negro grueso
        this.healthBar.fillRoundedRect((screenWidth - barWidth) / 2, 10, healthWidth, barHeight, borderRadius); // Centrado horizontalmente
    }

    createTilemap() {
        this.mapa = this.make.tilemap({ key: 'mapa' });
        //this.mapa.addTilesetImage('pisopiedra', 'pisoPiedra.ong'); // Conjunto,imagen
        const tileset = this.mapa.addTilesetImage('piso4', 'piso4'); // Conjunto,imagen
        this.pisoColision = this.mapa.createLayer("Capa4", tileset, 0, 0);
        // Cambia por el nombre de tu capa
        this.pisoColision.setCollisionByProperty({ colision: true });
    }
    update() {
        this.luffy.update();
        this.Vegeta.update();
        if (!this.luffy.colisionAtaque) {
            this.luffy.hasHit = false;

        }
        this.updateHealthBar();
    }
    endLevel() {




        // Cambia a Level0
        this.scene.start('Level0');
    }
}