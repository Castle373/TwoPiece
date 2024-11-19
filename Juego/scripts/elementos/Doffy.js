export default class Doffy {
    constructor(scene, colision, x, y) {
        this.scene = scene;
        this.colision = colision;
        this.isGrounded = true; // Inicializa el estado de estar en el suelo
        this.isAttacking = false;
        this.canFollow = true;
        this.create(x, y);
        this.maxHealth = 2000;  // Salud máxima de Kaido
        this.health = this.maxHealth;
        this.actu = true;

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
    reir() {
        this.isAttacking = true;
        const position = this.scene.spawnObjects['doffyRiendo'];
        this.sprite.setPosition(position.x, position.y);
        // Reproduce la animación de ataque
        this.sprite.anims.play('doffyriendo', true);
        this.scene.risaDoffy.play();
        // Escucha cuando la animación de ataque termine
        this.sprite.on('animationcomplete-doffyriendo', () => {
            this.isAttacking = false; // Permite volver a la animación 
            this.canShoot = true;
        });
    }
    shoot() {
        if (!this.canShoot) return; // No disparar si un proyectil ya está activo
    
        this.iniciarDisparo();
    
        if (this.verificarRisa()) return; // Verificar si Doffy ríe
    
        this.seleccionarYActualizarPosicion(); // Seleccionar posición y actualizar animación
    
        // Esperar a que termine la animación antes de disparar
        this.scene.time.delayedCall(500, () => {
            this.dispararProyectiles(); // Lógica de disparo después de 1 segundo
        });
    }
    
    /** Métodos auxiliares */
    
    iniciarDisparo() {
        this.scene.cambioLugar.play();
        this.canShoot = false;
    }
    
    verificarRisa() {
        const randomChance = Math.random();
        if (randomChance <= 0.15 && this.lastAction !== 'reir') {
            this.lastAction = 'reir';
            this.reir(); // Permitir nuevo disparo después de reír
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
        projectile.on('destroy', () => {
            this.canShoot = true;
        });
    
        this.scene.time.delayedCall(2000, () => {
            projectile.destroy();
        });
    }
    
    createAnimationsHilos() {
        const animsData = this.scene.cache.json.get('hiloAnims');
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
    hitbox() {

        const currentFrame = this.sprite.anims.currentFrame;

        if (currentFrame) {
            const frameData = this.scene.textures.getFrame('kaido', currentFrame.frame.name);

            if (frameData) {
                const { width, height, x, y } = frameData;
                this.sprite.body.setSize(width, height);
                if (this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key === 'kaidoataquearriba') {
                    // Si Kaido está atacando, alargar la hitbox en la dirección en que mira
                    const extendedWidth = width + 40; // Añadir 40 píxeles al ancho de la hitbox

                    this.sprite.body.setSize(extendedWidth, height);

                    if (this.sprite.flipX) {
                        // Si está volteado a la izquierda, desplaza la hitbox hacia la izquierda
                        this.sprite.body.setOffset(x - 40, y);
                    } else {
                        // Si está mirando a la derecha, desplaza la hitbox hacia la derecha
                        this.sprite.body.setOffset(x, y);
                    }
                } else {
                    // Si no está atacando, usa la hitbox normal
                    this.sprite.body.setSize(width, height);
                    this.sprite.body.setOffset(x, y);
                }


            }
        }
    }







    followLuffy() {
        const luffyPosition = this.scene.luffy.sprite;
        const kaidoPosition = this.sprite;

        const distanceX = Math.abs(kaidoPosition.x - luffyPosition.x); // Distancia en el eje X
        const followRange = 300;
        const attackRange = 50; // Rango para atacar a Luffy
        if (this.isAttacking) {
            this.sprite.setVelocityX(0); // Detener el movimiento horizontal durante el ataque
            return; // Salir de la función si está atacando
        }
        if (distanceX < attackRange) {
            // Cuando esté en rango de ataque, reproducir animación de ataque
            kaidoPosition.setVelocityX(0);
            if (kaidoPosition.anims.currentAnim.key !== 'kaidoataquearriba' || !kaidoPosition.anims.isPlaying) {
                this.attack();
            }
            // Detener el movimiento horizontal al atacar
        } else if (distanceX < followRange) {
            // Cuando esté en rango de seguimiento, moverse hacia Luffy solo en X
            const speed = 100;
            const direction = (luffyPosition.x < kaidoPosition.x) ? -1 : 1; // Dirección hacia Luffy

            kaidoPosition.setVelocityX(speed * direction);

            // Voltear animación si Luffy está a la izquierda de Kaido
            this.sprite.flipX = (luffyPosition.x < kaidoPosition.x);

            // Reproducir animación de caminar si Kaido se está moviendo
            if (kaidoPosition.anims.currentAnim.key !== 'kaidocaminando' || !kaidoPosition.anims.isPlaying) {

                kaidoPosition.play('kaidocaminando');
            }
        } else {
            // Detener el movimiento si Luffy está fuera del rango
            kaidoPosition.setVelocityX(0);

            // Reproducir animación de "parado" cuando no se esté moviendo
            if (kaidoPosition.anims.currentAnim.key !== 'kaidoparado' || !kaidoPosition.anims.isPlaying) {
                kaidoPosition.play('kaidoparado');
            }
        }
    }



    attack() {
        // Reproducir la animación de ataque
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.canFollow = false;
        this.sprite.play('kaidoataquearriba');
        this.playAttackSound('kaidoataquearriba');
        // Ajustar temporalmente el tamaño de la hitbox durante el ataque
        const attackHitboxWidth = 100; // Ancho adicional de la hitbox para el ataque
        const baseWidth = this.sprite.width; // Ancho original del sprite
        this.sprite.y -= 15;
        // Ajustar la hitbox y el offset según la dirección
        if (this.sprite.flipX) {
            // Si Kaido está mirando hacia la izquierda
            this.sprite.body.setSize(baseWidth + attackHitboxWidth, this.sprite.height);
            this.sprite.body.setOffset(-attackHitboxWidth, 0); // Mover el offset a la izquierda
        } else {
            // Si Kaido está mirando hacia la derecha
            this.sprite.body.setSize(baseWidth + attackHitboxWidth, this.sprite.height);
            this.sprite.body.setOffset(0, 0); // El offset se mantiene en la posición original
        }

        // Escuchar el evento de finalización de la animación para restaurar la hitbox
        this.sprite.on('animationcomplete', () => {
            this.isAttacking = false;
            // Restaurar el tamaño original de la hitbox y volver a la animación de parado
            this.sprite.body.setSize(baseWidth, this.sprite.height);
            this.sprite.body.setOffset(0, 0);
            this.sprite.play('kaidoparado');
            setTimeout(() => {
                this.canFollow = true; // Permitir seguir a Luffy nuevamente
            }, 100500);
        }, this);
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
