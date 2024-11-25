
import Luffy from '../elementos/luffy.js';
import Swordman from '../elementos/swordman.js';
import Kaido from '../elementos/kaido.js';


export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.swordmen = [];
        this.atacar = true;
    }

    preload() {
        this.load.atlas('luffy', 'recursos/img/luffy.png', 'recursos/img/luffy_atlas.json');
        this.load.atlas('marina', 'recursos/img/marina.png', 'recursos/img/marina_atlas.json');
        this.load.atlas('kaido', 'recursos/img/kaido.png', 'recursos/img/kaido_atlas.json');
        this.load.atlas('vida', 'recursos/img/vida.png', 'recursos/img/vida_atlas.json');
        this.load.json('kaidoAnims', 'recursos/img/kaido_anim.json');
        this.load.image('items', 'recursos/img/items.png');
        this.load.image('pisopiedra', 'recursos/img/pisoPiedra.ong.png');
        this.load.image('wano', 'recursos/img/wano.jpg');
        this.load.audio('cesped1', 'recursos/sound/caminarCesped.wav');
        this.load.audio('cesped2', 'recursos/sound/caminarCesped2.wav');
        this.load.audio('caminarcesped', 'recursos/sound/caminarCesped.wav');
        this.load.audio('abanicarKaido', 'recursos/sound/kaidoAbanica.wav');
        this.load.audio('muereKaido', 'recursos/sound/muereKaido.wav');
        this.load.audio('golpeKaido', 'recursos/sound/golpeKaido.wav');
        this.load.audio('ruidoGolpe', 'recursos/sound/ruidoGolep.wav');
        this.load.audio('golpeLuffy', 'recursos/sound/golpeluffy (2).wav');
        this.load.audio('golpeCaida', 'recursos/sound/caidaGolpe.wav');
        this.load.audio('oraKaido', 'recursos/sound/golpeKaidoSonido.wav');
        this.load.tilemapTiledJSON('mapa', 'recursos/scripts/pisoLevelWano.json'); // Carga del tilemap
        this.add.text(100, 100, 'Bienvenido a Nivel 1', { fontSize: '32px', fill: '#fff' });
    }

    create() {
        this.background = this.add.image(0, 0, 'wano').setOrigin(0).setScrollFactor(0);
        this.background.displayWidth = this.cameras.main.width;
        this.background.displayHeight = this.cameras.main.height;
        this.createTilemap();



        this.luffy = new Luffy(this, this.pisoColision, 400, 100);
        this.kaido = new Kaido(this, this.pisoColision, 1000, 100);
        //  this.physics.add.collider(this.luffy.sprite, this.swordmanGroup, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.luffy.sprite, this.kaido.sprite, () => {
            this.handlePlayerEnemyCollision();
        });
        //   this.swordman= new Swordman(this,this.pisoColision,100,100);
        this.createHealthBar();
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
        this.cameras.main.startFollow(this.luffy.sprite);
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
        const healthWidth = (1 / 100) * barWidth; // Ancho relativo a la salud

        // Centrar la barra de salud dentro del área de la barra total
        const screenWidth = this.cameras.main.width;
        const barHeight = 20;
        const borderRadius = healthWidth < 100 ? 5 : 10;

        // Dibuja la barra de salud (verde) con el borde negro grueso
        this.healthBar.fillRoundedRect((screenWidth - barWidth) / 2, 10, healthWidth, barHeight, borderRadius); // Centrado horizontalmente
    }



    handlePlayerEnemyCollision() {

        if (this.kaido.sprite.anims.currentAnim.key === 'kaidoataquearriba' && this.kaido.isAttacking) {
            const currentFrame = this.kaido.sprite.anims.currentFrame;

            if (currentFrame) {
                const frameIndex = currentFrame.index; // Obtener el índice actual del frame

                // Verificar si el frame está entre 3 y 5 (considerando que el índice empieza desde 0)
                if (frameIndex >= 2 && frameIndex <= 4) {
                    // Empujar a Luffy en la dirección que está mirando Kaido
                    const direction = this.kaido.sprite.flipX ? -1 : 1; // 1 para la derecha, -1 para la izquierda

                    this.luffy.receiveAttack(direction) // Ajusta la velocidad según lo necesites
                    if (!this.golpeL.isPlaying) {
                        this.golpeL.play();
                        this.golpeK.play();
                        this.time.delayedCall(450, () => {
                            // Asegurarse de que sigue en el ataque
                            this.caidaC.play();

                        });
                    }

                }
            }
        }
        if (this.luffy.isAttacking) {  // Comprobamos si Luffy está atacando
            if (this.atacar) {
                if (!this.ruidoGolpe.isPlaying) {
                    this.ruidoGolpe.play();
                    const damage = this.luffy.getAttackDamage();
                    this.kaido.receiveAttack(damage);
                    this.atacar = false;// Método para que Kaido reciba el daño o reacciones por el golpe
                }
            }
        } else {
            this.atacar = true;
        }
    }

    createTilemap() {
        this.mapa = this.make.tilemap({ key: 'mapa' });
        //this.mapa.addTilesetImage('pisopiedra', 'pisoPiedra.ong'); // Conjunto,imagen
        const tileset = this.mapa.addTilesetImage('pisoPiedra.ong', 'pisopiedra'); // Conjunto,imagen
        this.pisoColision = this.mapa.createLayer("cesped", tileset, 0, 0);
        // Cambia por el nombre de tu capa
        this.pisoColision.setCollisionByProperty({ colision: true });
    }
    update() {
        this.luffy.update();
        this.kaido.update();
        this.updateHealthBar();
        if (!this.luffy.isAttacking) {
            this.atacar = true;
        }
        
    }
    endLevel() {




        // Cambia a Level0
        this.scene.start('Level0');
    }
}
