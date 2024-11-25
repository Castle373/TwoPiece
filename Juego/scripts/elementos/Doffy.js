export default class Doffy {
    constructor(scene, colision, x, y) {
        this.scene = scene;
        this.colision = colision;
        this.isGrounded = true; // Inicializa el estado de estar en el suelo
        this.isAttacking = false;
        this.canFollow = true;
        this.create(x, y);
        this.maxHealth = 100;  // Salud máxima de Kaido
        this.health = this.maxHealth;
        this.actu = true;
        this.specialAttackUsed = false;
        this.attackSounds = {


        };

    }

    create(x, y) {
        this.isAttacking = false;
        // Crea el sprite del Swordman
        this.sprite = this.scene.physics.add.sprite(x, y, 'doffy', 0).setScale(1);

        // Configuración de colisiones
        this.scene.physics.add.collider(this.sprite, this.colision, this.onCollision.bind(this));

        // Creación de animaciones
        this.createAnimations();
        this.createAnimationsHilos();
        this.sprite.play('doffyparado'); // Reproduce la animación inicial
        this.sprite.flipX = true;

        this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla para atacar
        this.projectiles = this.scene.proyectiles;
        this.canShoot = true;
        this.risaTimer = this.scene.time.addEvent({
            delay: 2000, // Tiempo entre ataques (en milisegundos)
            callback: this.reir,
            callbackScope: this,
            loop: false
        });
        this.scene.time.delayedCall(4500, () => {
            this.shoot(); // Primer disparo
            this.attackTimer = this.scene.time.addEvent({
                delay: 2000, // Tiempo entre ataques (en milisegundos)
                callback: this.shoot,
                callbackScope: this,
                loop: true // Se repite indefinidamente cada 2 segundos
            });
        }, [], this);

    }
    changeAttackTimerDelay(newDelay) {
        if (this.attackTimer) {
            // Detiene el temporizador actual
            this.attackTimer.remove();

            // Crea un nuevo temporizador con el nuevo delay
            this.attackTimer = this.scene.time.addEvent({
                delay: newDelay, // Nuevo tiempo entre ataques
                callback: this.shoot,
                callbackScope: this,
                loop: true // El temporizador sigue siendo cíclico
            });
        }
    }
    pauseResumeAttackTimer() {
        if (this.attackTimer) {
            // Alterna entre pausar y reanudar el temporizador
            this.attackTimer.paused = !this.attackTimer.paused;
        }
    }

    reir() {
        this.isAttacking = true;
        const position = this.scene.spawnObjects['doffyRiendo'];
        this.sprite.setPosition(position.x, position.y);
        // Reproduce la animación de ataque
        this.sprite.anims.play('doffyriendo', true);
        this.playRandomLaugh();
        // Escucha cuando la animación de ataque termine
        this.sprite.on('animationcomplete-doffyriendo', () => {
            this.isAttacking = false; // Permite volver a la animación 
            this.canShoot = true;
        });
    }
    playRandomLaugh() {
        // Lista de nombres de los audios cargados
        const laughSounds = [
            'risaDoffy1',
            'risaDoffy2',
            'risaDoffy3'
        ];

        // Selecciona uno al azar
        const randomSound = Phaser.Math.RND.pick(laughSounds);

        // Reproduce el sonido aleatorio
        this.scene.sound.play(randomSound);
    }
    shoot() {
        console.log(this.canShoot);
        if (!this.canShoot) return; // No disparar si un proyectil ya está activo
        console.log("luegoluego");
        this.iniciarDisparo();
        
        if (this.health <= this.maxHealth / 2) {
            if (!this.specialAttackUsed) { // Verificar si ya se usó el ataque forzado
                this.executeSpecialAttack();
                this.specialAttackUsed = true; // Marcar que se usó el ataque especial forzado
                this.changeAttackTimerDelay(1500); // Modificar el delay a 3 segundos (ejemplo)
                return; // No continuar con ataques normales
            }

            // Si ya se forzó, usar probabilidades (10%)
            const probability = Phaser.Math.Between(1, 20);
            if (probability <= 10) {
                
                this.executeSpecialAttack();
                return; // No continuar con ataques normales
            }
        }
        console.log("cambiodelugar");
        this.canShoot = false;  
        
        if (this.verificarRisa()) return; // Verificar si Doffy ríe

        this.seleccionarYActualizarPosicion(); // Seleccionar posición y actualizar animación

        // Esperar a que termine la animación antes de disparar
        this.scene.time.delayedCall(500, () => {
            this.dispararProyectiles(); // Lógica de disparo después de 1 segundo
        });
    }

    /** Métodos auxiliares */
    executeSpecialAttack() {
        const position = this.scene.spawnObjects['doffyFinal'];
        this.sprite.setPosition(position.x, position.y);
        this.specialProjectile();
    }
    iniciarDisparo() {
        this.scene.cambioLugar.play();
        this.canShoot = false;
    }
    specialProjectile() {;
        console.log("ataque final");
        const position = this.scene.spawnObjects['doffyRiendo'];
        this.sprite.anims.play('doffyrisa', true);
        this.scene.risaDoffy.setVolume(1.5);
        this.scene.risaDoffy.play();
        this.canShoot = false;   
        this.scene.time.delayedCall(3500, () => {
            this.canShoot = false;   
            this.sprite.anims.play('doffyfinal', true);
            this.scene.sound.play('ataqueDoffyF');
            const randomColumn = Phaser.Math.Between(1, 8);

            this.placeArrow(randomColumn);
            this.sprite.on('animationcomplete', () => {
                const columnToSkip=randomColumn;
                const spacing = this.scene.textures.getFrame('ode').width;
                const spriteHeight = this.scene.textures.getFrame('ode').height;
                const position = this.scene.spawnObjects['doffyRiendo'];
                const numColumns = 8; // Total de columnas (4 a la izquierda y 4 a la derecha)
                const allSprites = []; // Array para almacenar todos los sprites creados

                // Generar los sprites en filas
                for (let row = 0; row < 2; row++) { // 2 filas (una base, otra encima)
                    const offsetY = row === 0 ? 0 : -spriteHeight;
                    for (let col = -numColumns / 2; col <= numColumns / 2; col++) {
                        const columnIndex = col + (numColumns / 2 + 1); // Índice absoluto de la columna
                        if (columnIndex === columnToSkip) continue; // Omitir la columna especificada
                        const offsetX = col * spacing; // Calcular el desplazamiento horizontal
                        const specialSprite = this.projectiles.create(position.x + offsetX, position.y + offsetY, 'ode');
                        specialSprite.play("ode");
                        allSprites.push(specialSprite); // Almacenar el sprite
                    }
                }

                // Crear los sprites de "polvo" en la posición base con un poco de desplazamiento vertical
                const polvoYOffset = 30;
                for (let col = -numColumns / 2; col <= numColumns / 2; col++) {
                    const columnIndex = col + (numColumns / 2 + 1);
                    if (columnIndex === columnToSkip) continue; // Omitir la columna especificada
                    const offsetX = col * spacing;
                    const polvoSprite = this.projectiles.create(position.x + offsetX, position.y + polvoYOffset, 'polvo');
                    polvoSprite.play("polvo");
                    allSprites.push(polvoSprite); // Almacenar el sprite
                }

                // Configurar la destrucción de todos los sprites después de 3 segundos
                this.scene.time.delayedCall(3000, () => {
                    allSprites.forEach(sprite => sprite.destroy());
                    console.log("lo estoy haciendo true");
                    this.canShoot = true;
                  
                });


                this.scene.sound.play('muchosHilos');
                this.scene.risaDoffy.play();
                this.sprite.anims.play('doffyespalda', true);
                this.sprite.off('animationcomplete'); // Desactivar evento para evitar llamadas duplicadas
            });

        });

    }
    placeArrow(columnToSkip) {
        const spacing = this.scene.textures.getFrame('ode').width;
        const spacingF = this.scene.textures.getFrame('flecha').width; // Ancho de cada sprite 'ode'
        const position = this.scene.spawnObjects['doffyRiendo']; // Posición base para los sprites
        var offsetX=0;
        // Calcular el desplazamiento horizontal (offsetX) para la flecha en la columna a omitir
      
             offsetX = (columnToSkip - 5) * spacing; 
        

        // Multiplicamos el desplazamiento por el valor de spacing
    
        // Crear el sprite de la flecha en la posición calculada
        const arrowSprite = this.scene.physics.add.sprite(position.x + offsetX, position.y, 'flecha'); // Usamos 'flecha' como la clave del sprite de la flecha
        arrowSprite.play("flecha"); // Reproducir la animación de la flecha si la tiene
        this.scene.time.delayedCall(2000, () => {
            arrowSprite.destroy();
        });
        // Si quieres que la flecha desaparezca después de unos segundos, puedes configurarlo aquí
        
    }

    verificarRisa() {
        const randomChance = Math.random();
        if (randomChance <= 0.15 && this.lastAction !== 'reir') {
            this.lastAction = 'reir';
            this.reir(); // Permitir nuevo disparo después de reír
            console.log("lo estoy haciendo true risa");
            this.canShoot = true; // Rehabilitar disparo tras risa
            return true;
        }
        this.lastAction = 'shoot';
        return false;
    }

    seleccionarYActualizarPosicion() {
        const positions = ['doffyarribaI', 'doffyarribaD', 'SpawnDoffyI', 'SpawnDoffyD'];

        do {
            this.randomKey = Phaser.Utils.Array.GetRandom(positions);
        } while (this.randomKey === this.previousPosition);

        this.previousPosition = this.randomKey;

        const position = this.scene.spawnObjects[this.randomKey];
        this.sprite.setPosition(position.x, position.y);

        if (this.randomKey === 'doffyarribaD' || this.randomKey === 'doffyarribaI') {
            this.sprite.flipX = this.randomKey === 'doffyarribaD';
            this.sprite.play('doffyatacadoaire');
            this.isOnGround = false;
        } else {
            this.sprite.flipX = this.randomKey === 'SpawnDoffyD';
            this.sprite.play('doffyatacando');
            this.isOnGround = true;
        }
    }

    dispararProyectiles() {
        const position = this.scene.spawnObjects[this.randomKey];
        this.scene.hiloAbajoTiro.setVolume(1);
        if (!this.isOnGround) {
            this.scene.hiloAbajoTiro.setVolume(2.5);
            this.scene.hiloAbajoTiro.play();
            this.scene.hiloArribaGrito.play();
            // Disparar tres proyectiles en el aire
            for (let i = 0; i < 3; i++) {
                const offsetX = i === 1 ? 300 : i === 2 ? -300 : 0; // Desviaciones
                this.crearProyectilAereo(position, offsetX);
            }
        } else {

            this.scene.hiloAbajoTiro.play();
            this.scene.hiloAbajoGrito.play();
            // Disparar un único proyectil en el suelo
            const direction = this.sprite.flipX ? -1 : 1;
            this.crearProyectilSimple(position, direction);
        }
        console.log("lo estoy haciendo true proyectil");
        this.canShoot = true; // Permitir nuevos disparos después de lanzar los proyectiles
    }

    crearProyectilAereo(position, offsetX) {
        const direction = this.calcularDireccionProyectil(position);

        const projectile = this.projectiles.create(position.x, position.y, 'hilo');
        projectile.setRotation(direction.angle);
        projectile.setScale(2.5);
        projectile.play('ataquehilo');
        projectile.setOrigin(0.5, 0.5);
        projectile.setSize(projectile.width, projectile.height);

        const speed = 1000;
        projectile.setVelocityX((direction.x * speed) + offsetX);
        projectile.setVelocityY(direction.y * speed);
        projectile.flipX = this.sprite.flipX;

        this.configurarTiempoDeVida(projectile);
    }

    crearProyectilSimple(position, direction) {
        const projectile = this.projectiles.create(position.x, position.y, 'hilo');
        projectile.setScale(2.5);
        projectile.play('ataquehilo');
        projectile.setVelocityX(1000 * direction);
        projectile.flipX = this.sprite.flipX;

        this.configurarTiempoDeVida(projectile);
    }

    calcularDireccionProyectil(position) {
        const directionX = this.scene.luffy.sprite.x - position.x;
        const directionY = this.scene.luffy.sprite.y - position.y;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

        return {
            x: directionX / magnitude,
            y: directionY / magnitude,
            angle: Math.atan2(directionY, directionX),
        };
    }

    configurarTiempoDeVida(projectile) {
       
        this.scene.time.delayedCall(2000, () => {
            projectile.destroy();
        });
    }

    createAnimationsHilos() {
        const animsData = this.scene.cache.json.get('hiloAnims');

        animsData.anims.forEach(anim => {

            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });
        this.createAnimationsOde();
        this.createAnimationsPolvo();
        this. createAnimationsFlecha();
    }
    createAnimationsOde() {
        const animsData = this.scene.cache.json.get('odeAnims');

        animsData.anims.forEach(anim => {

            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });

    }
    createAnimationsFlecha() {
        const animsData = this.scene.cache.json.get('flechaAnims');

        animsData.anims.forEach(anim => {

            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });

    }
    createAnimationsPolvo() {
        const animsData = this.scene.cache.json.get('polvoAnims');

        animsData.anims.forEach(anim => {

            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });

    }
    createAnimations() {
        const animsData = this.scene.cache.json.get('doffyAnims');
        console.log(animsData);
        animsData.anims.forEach(anim => {

            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });


    }
    playAttackSound(attackAnim) {
        // Reproduce el sonido específico del ataque
        const sound = this.attackSounds[attackAnim];
        if (sound) {
            sound.play();
        }

        // Establece el tiempo de retraso para la finalización según el ataque
        let endSoundDelay;
        switch (attackAnim) {
            case 'kaidoataquearriba':
                endSoundDelay = 200; // Tiempo para golpe de pie
                break;
            case 'luffytree':
                endSoundDelay = 1200; // Tiempo para tree
                break;
            case 'luffyjet':
                endSoundDelay = 300; // Tiempo para jet
                break;
            default:
                endSoundDelay = 1000; // Tiempo por defecto si no se reconoce el ataque
                break;
        }

        // Temporizador para reproducir el sonido de finalización
        this.scene.time.delayedCall(endSoundDelay, () => {
            // Asegurarse de que sigue en el ataque
            this.abanicar.setVolume(0.1);
            this.abanicar.play();

        });
    }

    onCollision() {
        this.isGrounded = true; // Establece isGrounded en true al colisionar
    }

    update() {
        // Lógica para atacar
        if (!this.actu) {
            return;
        }
        if (this.canFollow) {
            //this.followLuffy(); // Solo se llama si no está atacando y puede seguir a Luffy
        }
        if (this.attackKey.isDown && !this.isAttacking) {
            this.playAttackAnimation();
        } else if (!this.isAttacking) {
            // Solo juega la animación por defecto si no está atacando
            // this.playDefaultAnimation();
        }
        if (this.shootKey.isDown && this.canShoot) {
            this.shoot();
        }
        //this.hitbox();
    }
    playAttackAnimation() {
        // Marca al personaje como atacando para evitar cambios de animación
        this.isAttacking = true;

        // Reproduce la animación de ataque
        this.sprite.anims.play('doffyatacando', true);

        // Escucha cuando la animación de ataque termine
        this.sprite.on('animationcomplete-doffyatacando', () => {
            this.isAttacking = false; // Permite volver a la animación predeterminada
        });
    }


    playDefaultAnimation() {
        // Asegúrate de que no se interrumpan otras animaciones
        if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== 'doffyparado') {
            this.sprite.anims.play('doffyparado', true);
        }
    }




    receiveAttack(damage) {
        // Reducir la vida de Kaido por la cantidad de daño recibido
        this.health -= damage;

        // Verificar si Kaido tiene vida suficiente o si se ha derrotado
        if (this.health <= 0) {
            this.health = 0;
            this.die();  // Llamamos a un método para manejar la muerte de Kaido
        }

        // Mostrar la vida actual de Kaido (esto es solo un ejemplo)
        console.log(`Kaido recibió un ataque. Vida restante: ${this.health}`);
    }

    // Método para manejar la muerte de Kaido (cuando su vida llega a 0)
    die() {
        console.log("Kaido ha muerto!");
        this.sprite.play('muriendo');

        this.sprite.setActive(false);  // Desactivar el sprite (o cambiarlo si quieres que se destruya)
        this.sprite.setVisible(false); // Hacer invisible a Kaido
        this.sprite.body.destroy();
        this.actu = false;
        this.scene.endLevel();
    }


}
