import Fondo from '../elementos/fondo.js';
import Barco from '../elementos/barco.js';
import Luffy from '../elementos/luffy.js';
import Kinemon from '../elementos/kinemon.js';
import Law from '../elementos/law.js';
import PersonajeBase from '../elementos/npc.js';

export default class Nivel0 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level0' });
        this.movimientoHabilitado = false;
    }

    preload() {
        // Aquí no cargamos los recursos directamente
        // Se cargan en cada clase correspondiente
        this.load.atlas('luffy', 'recursos/img/luffy.png', 'recursos/img/luffy_atlas.json');
        this.load.atlas('chopper', 'recursos/img/chopper.png', 'recursos/img/chopper_atlas.json');
        this.load.atlas('kinemon', 'recursos/img/kinemon.png', 'recursos/img/kinemon_atlas.json');
        this.load.atlas('law', 'recursos/img/law.png', 'recursos/img/law_atlas.json');
        this.load.image('fondo', 'recursos/img/fondo2.png');
        this.load.atlas('barco', 'recursos/img/barco.png', 'recursos/img/barco.json');
        this.load.image('barcoParteAlta', 'recursos/img/barcoParteAlta.png');
        this.load.image('fondo2', 'recursos/img/fondo2R.png');
        this.load.atlas('impacto', 'recursos/img/impacto.png', 'recursos/img/impacto_atlas.json');
        this.load.image('logo', 'recursos/img/logo.png'); // Logo
        this.load.image('boton', 'recursos/img/boton.png'); // Botón
        this.load.audio('oceano', 'recursos/sound/oceano.mp3'); // Sonido de fondo
        this.load.audio('hoverSound', 'recursos/sound/boton.wav');
        this.load.audio('logoSound', 'recursos/sound/logo.mp3');
        this.load.image('piso', 'recursos/img/piso.png');
        this.load.image('madera', 'recursos/img/madera.png');
        this.load.audio('pistol', 'recursos/sound/pistol.wav');
        this.load.audio('golpeGrande', 'recursos/sound/ELEFANTE.wav');
        this.load.audio('golpe', 'recursos/sound/golpenormal2.wav');
        this.load.audio('stomp', 'recursos/sound/stomp.wav');
        this.load.audio('jetPistol', 'recursos/sound/jetPistol.wav');
        this.load.audio('abanicar', 'recursos/sound/abanicar.wav');
        this.load.audio('dash', 'recursos/sound/dash.wav');
        this.load.audio('luffysalto1', 'recursos/sound/saltoLuffy (1).wav');
        this.load.audio('luffysalto2', 'recursos/sound/saltoLuffy (2).wav');
        this.load.audio('caidasalto', 'recursos/sound/caidaSalto.wav');
        this.load.audio('barco1', 'recursos/sound/caminarBarco.wav');
        this.load.audio('barco2', 'recursos/sound/caminarBarco2.wav');
        this.load.audio('abrirmision', 'recursos/sound/abrirMision.wav');
        this.load.audio('cerrarmision', 'recursos/sound/cerrarMision.wav');
        this.load.atlas('teclax', 'recursos/img/teclax.png', 'recursos/img/teclax_atlas.json');
        this.load.tilemapTiledJSON('map', 'recursos/scripts/piso2.json'); // Carga del tilemap
        this.load.json('luffyAnims', 'recursos/img/luffy_anim.json');
        this.load.json('marinaAnims', 'recursos/img/marina_anim.json');
        this.load.json('kinemonAnims', 'recursos/img/kinemon_anim.json');
        this.load.json('chopperAnims', 'recursos/img/chopper_anim.json');
        this.load.json('lawAnims', 'recursos/img/law_anim.json');
        this.load.font('eternal', 'recursos/fonts/Eternal.ttf', "truetype");

    }

    create() {
        
        this.fondo = new Fondo(this);
        this.createTilemap();
        this.createObjects();
        this.image = this.add.image(-(this.sys.game.config.width / 6), (this.sys.game.config.height / 4), 'barcoParteAlta').setOrigin(0, 0);

        const desplazamientoX = -(this.sys.game.config.width / 6);
        const desplazamientoY = (this.sys.game.config.height / 4);
        // Crear los personajes usando las coordenadas de los objetos ajustadas
        this.personajes = [
            this.law = new PersonajeBase(
                this,
                this.barcocolision,
                this.spawnObjects['law'].x + desplazamientoX, // Aplicar desplazamiento en X
                this.spawnObjects['law'].y + desplazamientoY, // Aplicar desplazamiento en Y
                'law',
                'lawAnims',
                'lawparado'
            ),
            this.kinemon = new PersonajeBase(
                this,
                this.barcocolision,
                this.spawnObjects['kinemon'].x + desplazamientoX, // Aplicar desplazamiento en X
                this.spawnObjects['kinemon'].y + desplazamientoY, // Aplicar desplazamiento en Y
                'kinemon',
                'kinemonAnims',
                'kinemonparado'
            ),
            this.chopper = new PersonajeBase(
                this,
                this.barcocolision,
                this.spawnObjects['chopper'].x + desplazamientoX, // Aplicar desplazamiento en X
                this.spawnObjects['chopper'].y + desplazamientoY, // Aplicar desplazamiento en Y
                'chopper',
                'chopperAnims',
                'chopper'
            )
            
        ];
        this.estrella = new PersonajeBase(
            this,
            null,
            this.spawnObjects['chopper'].x + desplazamientoX, // Aplicar desplazamiento en X
            this.spawnObjects['chopper'].y + desplazamientoY, // Aplicar desplazamiento en Y
            'chopper',
            'chopperAnims',
            'estrella'
        ),
        this.chispas = new PersonajeBase(
            this,
            null,
            this.spawnObjects['chopper'].x + desplazamientoX-27, // Aplicar desplazamiento en X
            this.spawnObjects['chopper'].y + desplazamientoY, // Aplicar desplazamiento en Y
            'chopper',
            'chopperAnims',
            'chispas'
        )
        
        this.luffy = new Luffy(this, this.barcocolision, this.spawnObjects['kinemon'].x + desplazamientoX + 50, this.spawnObjects['kinemon'].y + desplazamientoY);
        this.centroCirculo = { x: this.estrella.sprite.x, y: this.estrella.sprite.y }; // Centro del círculo
    this.radio = 50; // Radio del círculo
    this.angulo = 0;
        this.tweenChispas = this.tweens.add({
            targets: this.chispas.sprite,
            x: this.chispas.sprite.x + 50, // Moverse 50 píxeles a la derecha
            duration: 1000, // Tiempo de ida
            yoyo: true, // Regresar al punto inicial
            repeat: -1, // Repetir infinitamente
            ease: 'Sine.easeInOut', // Movimiento suave
        });
        this.chopper.sprite.setGravityY(0);
        this.chispas.sprite.setGravityY(0);
        this.estrella.sprite.setGravityY(0);

        this.barco = new Barco(this);
        this.luffy.walkSounds[0].setRate(1);
        this.luffy.walkSounds[1].setRate(1);
        this.luffy.walkSounds[0].setVolume(0.5);
        this.luffy.walkSounds[1].setVolume(0.5);
        this.misionAbrir = this.sound.add('abrirmision');
        this.misionCerrar = this.sound.add('cerrarmision');
        // Crear personajes dinámicamente

        // Crear tilemap


        this.createLogo(); // Crear logo
        this.createButton(); // Crear botón
        this.playBackgroundMusic(); // Reproducir música de fondo

        this.barco.animar(this.image);
        this.createPanel();
        this.createWoodenPanel();
        this.teclaxSprite = this.physics.add.sprite(0, 0, 'teclax').setOrigin(0.5, 0.5).setVisible(false);
        this.teclaxSprite.setScale(0.65);
        this.anims.create({
            key: 'teclaAnimacion',  // Nombre de la animación
            frames: [
                { key: 'teclax', frame: 'tecla_(1)' },  // Primer frame
                { key: 'teclax', frame: 'tecla_(2)' },  // Segundo frame
                { key: 'teclax', frame: 'tecla_(3)' }   // Tercer frame
            ],
            frameRate: 10,  // Velocidad de la animación
            repeat: -1  // Repetir indefinidamente
        });

        this.teclaxSprite.play('teclaAnimacion');
        // Configurar la colisión entre Luffy y Kinemon

        this.personajes.forEach((personaje, index) => {
            this.physics.add.overlap(this.luffy.sprite, personaje.sprite, () => {
                this.mostrarTecla(personaje);
            });
        });
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.play();
       

        // Por si quieres alternar la visibilidad de la tabla desde el nivel
        this.input.keyboard.on('keydown-T', () => {
            window.toggleHabilidades();
        });
        this.input.keyboard.on('keydown-U', () => {
            window.togglePersonajes();
        });

    }
    mostrarTecla(personaje) {
        // Hacer visible el sprite y reproducir la animación
        this.teclaxSprite.setVisible(true);

        // Ajustar la posición de la tecla cerca del personaje
        this.teclaxSprite.setPosition(personaje.sprite.x, personaje.sprite.y - 50);

        if (this.keyX.isDown && !this.xKeyPressed) {
            this.misionAbrir.play();
            this.movimientoHabilitado = false;
            this.xKeyPressed = true; // Marcar que la tecla se ha presionado
            console.log(`Interacción con ${personaje.spriteKey}`);
            // Personalizar el mensaje según el personaje
            if (personaje === this.personajes[1]) { // Si es Kinemon
                this.personajeActual = 'kinemon';
                this.togglePanel();
                this.toggleWoodenPanel();
                this.updateMissionText(
                    "MISIÓN: Explora el barco",
                    'DERROTAR A KAIDO\n\nUbicacion: Wano\nRecompensa: 10000 Berrys'
                );
            } else if (personaje === this.personajes[0]) { // Si es Law
                this.personajeActual = 'law';
                this.togglePanel();
                this.toggleWoodenPanel();
                this.updateMissionText(
                    "MISIÓN: Encuentra aliados",
                    'Doflamingo te reto a un duelo en la Arena!!!\n !!!!Recuerda no caigas¡¡¡¡\n\nUbicacion: En algún lugar\nRecompensa: ¡Amistad!'
                );
            }else if (personaje === this.personajes[2]) { // Si es Law
                this.personajeActual = 'chopper';
                this.togglePanel();
                this.toggleWoodenPanel();
                this.updateMissionText(

                );
            }

        }
    }
    createHTMLTable() {
        const { width, height } = this.sys.game.config;
    
        // Estructura HTML para la tabla
        const tableHTML = `
            <div id="table-container" style="
                width: 80%;  /* Ajusta la proporción */
                height: 70%; /* Más espacio para scroll */
                overflow-y: auto;
                background: rgba(255, 255, 255, 0.95);
                border: 2px solid #000;
                border-radius: 10px;
                position: fixed; /* Para mantener la tabla centrada */
                left: 10%;  /* Centrar horizontalmente */
                top: 15%;   /* Centrar verticalmente */
                padding: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 100;
            ">
                <table style="width: 100%; border-collapse: collapse; text-align: center;">
                    <thead>
                        <tr>
                            <th style="border-bottom: 1px solid #ccc; padding: 10px;">#</th>
                            <th style="border-bottom: 1px solid #ccc; padding: 10px;">Nombre</th>
                            <th style="border-bottom: 1px solid #ccc; padding: 10px;">Puntos</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        <!-- Las filas dinámicas se insertan aquí -->
                    </tbody>
                </table>
            </div>
        `;
    
        // Crear el elemento DOM
        this.htmlTable = this.add.dom(0, 0).createFromHTML(tableHTML);
    
        // Añadir filas dinámicas
        this.addTableRow(1, 'Luffy', 500);
        this.addTableRow(2, 'Zoro', 450);
        this.addTableRow(3, 'Sanji', 400);
        this.addTableRow(4, 'Robin', 300);
        this.addTableRow(5, 'Chopper', 200);
        this.addTableRow(6, 'Brook', 100);
    
        // Asegurarse de que la tabla esté visible
        this.htmlTable.setVisible(true);
    }
    

    addTableRow(index, name, points) {
        const tableBody = this.htmlTable.getChildByID('table-body');
        if (tableBody) {
            const newRow = `
                <tr>
                    <td style="padding: 10px; text-align: center;">${index}</td>
                    <td style="padding: 10px; text-align: center;">${name}</td>
                    <td style="padding: 10px; text-align: center;">${points}</td>
                </tr>
            `;
            tableBody.innerHTML += newRow; // Agrega la nueva fila
        }
    }
    updateMissionText(title, body) {
        this.woodenPanel.list[1].list[0].setText(title);
        this.woodenPanel.list[1].list[1].setText(body);
    }
    createTilemap() {
        this.mapa = this.make.tilemap({ key: 'map' });
        const tileset = this.mapa.addTilesetImage('piso', 'piso'); // Cambia por el nombre de tu tileset
        this.barcocolision = this.mapa.createLayer("Capa de patrones 2", tileset, -(this.sys.game.config.width / 6), (this.sys.game.config.height / 4));
        // Cambia por el nombre de tu capa
        this.barcocolision.setCollisionByProperty({ colision: true });


    }
    createObjects() {


        this.spawnObjects = {};

        // Obtener la capa de objetos
        const objectLayer = this.mapa.getObjectLayer('capaObjectos').objects;

        // Guardar los objetos en el diccionario
        objectLayer.forEach(obj => {
            this.spawnObjects[obj.name] = { x: obj.x, y: obj.y, properties: obj.properties };

        });



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
    play() {
        this.movimientoHabilitado = true;
        this.botonPlay.destroy();
    }

    createButton() {
        this.botonPlay = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'boton').setOrigin(0.5);
        this.botonPlay.setInteractive(); // Hacer el botón interactivo
        this.botonPlay.setScale(0.3); // Reducir el tamaño del botón al 30%
        this.hoverSound = this.sound.add('hoverSound');
        this.hoverSound.setVolume(0.1);
        this.botonPlay.on('pointerover', () => {
            this.botonPlay.setScale(0.32); // Aumenta el tamaño del botón
            this.hoverSound.play();
        });

        this.botonPlay.on('pointerout', () => {
            this.botonPlay.setScale(0.3); // Vuelve al tamaño original
        });
        this.botonPlay.on('pointerdown', () => {

            this.play();
            // this.scene.start('Level1'); // Cambiar a la escena Nivel1
        });

    }

    playBackgroundMusic() {
        const playa = this.sound.add('oceano', { loop: true }); // Reproducir sonido de fondo en bucle
        playa.play();
        playa.setVolume(0.05);
    }

    onButtonClick() {
        console.log('Botón presionado!');
        // Aquí puedes agregar lógica para cambiar de nivel o ejecutar otra acción
    }
    createPanel() {
        const { width, height } = this.sys.game.config;

        // Fondo del panel
        this.panelBackground = this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
            .setOrigin(0)
            .setDepth(10) // Asegurarse de que esté por encima de todo
            .setVisible(false); // Oculto por defecto

        // Texto del panel
        this.panelText = this.add.text(width / 2, height / 2, 'Panel de Información', {

            fontSize: '32px',
            color: '#FFFFFF',
        })
            .setOrigin(0.5)
            .setDepth(11) // Asegurarse de que esté encima del fondo
            .setVisible(false); // Oculto por defecto
    }
    createWoodenPanel() {
        const { width, height } = this.sys.game.config;

        // Crear el contenedor principal
        this.woodenPanel = this.add.container(width / 2, height / 2);

        // Crear el panel principal (madera)
        const woodenPanelImage = this.add.image(0, 0, 'madera').setOrigin(0.5);

        // Crear el contenedor para la madera (contendrá solo la imagen de madera)
        const woodenPanelContainer = this.add.container(0, 0, [woodenPanelImage]);

        // Panel rosa (15% más pequeño en los lados, 20% menos en la parte superior y 10% en la inferior)
        const innerWidth = woodenPanelImage.width * 0.75;
        const innerHeight = woodenPanelImage.height * 0.7;
        const offsetYTop = -woodenPanelImage.height / 2 + woodenPanelImage.height * 0.23;

       
        // Título
        const missionTitle = this.add.text(0, -woodenPanelImage.height / 2 + 35, 'MISIÓN: HOLA', {
            fontSize: '24px',
            fontFamily: 'eternal',
            color: '#FFFFFF',
            align: 'center',
        }).setOrigin(0.5);

        // Texto del cuerpo, alineado a la izquierda, 25% más arriba dentro del panel rosa
        const bodyText = this.add.text(
            0,  // Alineado a la izquierda, con un pequeño margen
            offsetYTop + innerHeight * 0.25,  // 25% más arriba
            'Texto de prueba',
            {
                fontSize: '20px',
                fontFamily: 'eternal',
                color: '#FFFFFF',
                align: 'center',
                wordWrap: { width: innerWidth - 40 },
            }
        ).setOrigin(0.5);  // Alinear desde la esquina superior izquierda

        // Crear botones

        // Crear botones
        const buttonWidth = 100;
        const buttonHeight = 40;
        const buttonOffsetY = offsetYTop + innerHeight * 0.9; // 10% desde la parte inferior del panel rosa
        const buttonSpacing = 20; // Espacio horizontal entre los botones

        // Botón izquierdo
        const leftButton = this.createInteractiveButton(
            -buttonWidth - buttonSpacing / 2, // Posición X a la izquierda
            buttonOffsetY,
            'Aceptar',
            0x28a745,
            this.onAccept
        );

        // Botón derecho (Cancelar)
        const rightButton = this.createInteractiveButton(
            buttonWidth + buttonSpacing / 2, // Posición X a la derecha
            buttonOffsetY,
            'Cancelar',
            0xdc3545,
            this.onCancel
        );

        // Crear el contenedor para el panel rosa, el texto y los botones
        const innerPanelContainer = this.add.container(0, 0, [
         
            missionTitle,      // Título
            bodyText,          // Texto dentro del panel
            leftButton.buttonBackground,  // Botón izquierdo (solo el fondo)
            leftButton.buttonText,        // Texto del botón izquierdo
            rightButton.buttonBackground, // Botón derecho (solo el fondo)
            rightButton.buttonText         // Texto del botón derecho
        ]);


        // Agregar ambos contenedores al contenedor principal
        this.woodenPanel.add([woodenPanelContainer, innerPanelContainer]);

        // Configurar la visibilidad y profundidad
        this.woodenPanel.setDepth(15).setVisible(false);  // Ocultar inicialmente
    }
    onAccept() {

        if (this.personajeActual === 'law') {
            this.scene.start('LevelDress');
        } else if (this.personajeActual === 'kinemon') {
            this.scene.start('Level1');
        }
        // Lógica cuando se presiona el botón Aceptar
    }

    onCancel() {
        this.misionCerrar.play();
        this.togglePanel();
        this.toggleWoodenPanel();
        this.movimientoHabilitado = true;
        this.xKeyPressed = false;

    }
    createInteractiveButton(x, y, text, buttonColor, action) {
        // Crear el fondo del botón con forma redondeada usando Graphics
        const buttonBackground = this.add.graphics()
            .fillStyle(buttonColor, 1)
            .fillRoundedRect(x - 60, y - 20, 120, 40, 15); // 15 es el radio de los bordes redondeados

        // Crear el texto del botón encima del fondo
        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'eternal',
            color: '#FFFFFF',
            align: 'center',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }, // Para asegurar que el texto no se "pegue" al borde
        }).setOrigin(0.5).setInteractive();

        // Agregar eventos al texto
        buttonText.on('pointerover', () => {// Agrandar el fondo
            buttonText.setScale(1.1); // Agrandar el texto también
            this.hoverSound.play(); // Usar el sonido definido en la clase
        });

        buttonText.on('pointerout', () => {// Restaurar tamaño original del fondo
            buttonText.setScale(1); // Restaurar tamaño original del texto
        });

        buttonText.on('pointerdown', () => {// Hacerlo más pequeño al pulsar
            buttonText.setScale(0.9); // Hacer el texto más pequeño también
            action.call(this);
        });


        return { buttonBackground, buttonText }; // Devolvemos ambos objetos, el fondo y el texto
    }

    // Alternar visibilidad del panel de madera
    toggleWoodenPanel() {
        const isVisible = this.woodenPanel.visible;
        this.woodenPanel.setVisible(!isVisible);
    }
    update() {

        this.fondo.update();
        if (this.movimientoHabilitado) {
            this.luffy.update();
        }

        let overlap = false;

        // Iterar sobre todos los personajes en this.personajes
        this.personajes.forEach((personaje) => {
            if (this.physics.world.overlap(this.luffy.sprite, personaje.sprite)) {
                overlap = true;  // Si hay colisión, marcar como verdadero
            }
        });

        // Si no hay superposición (Luffy no está tocando ningún personaje)
        if (!overlap) {
            this.teclaxSprite.setVisible(false);  // Ocultar el sprite de la tecla
            this.xKeyPressed = false;  // Resetea el estado de la tecla presionada
        }
        this.angulo += 0.05; // Ajusta la velocidad de rotación

    // Calcular nuevas posiciones de la estrella
    this.estrella.sprite.x = this.centroCirculo.x + this.radio * Math.cos(this.angulo);
    this.estrella.sprite.y = this.centroCirculo.y + this.radio * Math.sin(this.angulo);

    }
    togglePanel() {
        const isVisible = this.panelBackground.visible;
        this.panelBackground.setVisible(!isVisible);
    }
}
