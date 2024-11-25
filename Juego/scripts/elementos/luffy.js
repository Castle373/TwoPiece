export default class Luffy {
    constructor(scene, colision, x, y) {
        this.scene = scene;
        this.cursorKeys;
        this.colision = colision;
        this.isAttacking = false;
        this.isBeingAttacked = false;
        this.canMove = true;
        this.flipAdjusted = false;
        this.isDashing = false; // Estado del dash
        this.dashCooldown = false; // Control de enfriamiento del dash
        this.dashSpeed = 2000; // Velocidad del dash
        this.normalSpeed = 300;
        this.isInAir = false;
        this.create(x,y);
        this.attackSounds = {
            luffygolpepie: this.scene.sound.add('stomp'),
            luffytree: this.scene.sound.add('golpeGrande'),
            luffyjet: this.scene.sound.add('jetPistol'),
            luffylargogolpe: this.scene.sound.add('pistol'),
            luffygolpe: this.scene.sound.add('golpe'),
        };
        this.landSound = this.scene.sound.add('caidasalto');
        this.jumpSounds = [
            this.scene.sound.add('luffysalto1'),
            this.scene.sound.add('luffysalto2')
        ];
        this.walkSounds = [
            this.scene.sound.add('barco1'),
            this.scene.sound.add('barco2')
        ]; 
        this.lastJumpSoundIndex = 0;
        this.lastWalkSoundIndex  = 0;
        this.dashSound = this.scene.sound.add('dash');
        this.abanicar = this.scene.sound.add('abanicar');
        this.colisionAtaque=false;
        

    }



    playWalkSound() {
        // Alternar entre dos sonidos de pasos
        if (!this.walkSounds[this.lastWalkSoundIndex].isPlaying) {
            // Alterna entre los dos sonidos de pasos
            this.lastWalkSoundIndex = 1 - this.lastWalkSoundIndex; // Cambia entre 0 y 1
           
            this.walkSounds[this.lastWalkSoundIndex].play();
        }
    }

    create(x,y) {

        this.sprite = this.scene.physics.add.sprite(x, y, 'luffy', "parado_(1)").setScale(1);
        
        this.sprite.body.setGravityY(800);
        

        this.scene.physics.add.collider(this.sprite, this.colision, () => {
            this.isGrounded = true;
        });
        const animsData = this.scene.cache.json.get('luffyAnims');

        animsData.anims.forEach(anim => {
            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });


        this.sprite.play('luffyparado');
        
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        this.keyX = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyV = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keyC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
    dash() {
        this.isDashing = true; // Activa el estado de dash
        const direction = this.sprite.flipX ? -1 : 1; // Determina la dirección del dash
        this.sprite.setVelocityX(this.dashSpeed * direction); // Establece la velocidad de dash
        this.sprite.play('luffydash', true);
        this.dashSound.play();
        // Restablecer el estado de dash después de un tiempo
        setTimeout(() => {
            this.isDashing = false; // Restablece el estado de dash
            this.dashCooldown = true; // Activa el enfriamiento del dash
            if (!this.sprite.body.blocked.down) { // Si no está tocando el suelo
                // Verifica si la animación activa es "luffysalto"
                if (this.sprite.anims.currentAnim.key !== 'luffysalto') {
                    // Reproduce la animación de salto si no está activada
                    this.sprite.play('luffysalto', true);
                }

                // Obtener el último frame de la animación de salto
                const lastFrame = this.sprite.anims.currentAnim.frames[this.sprite.anims.currentAnim.frames.length - 1];

                // Establecer solo el último frame de la animación de salto
                this.sprite.setFrame(lastFrame.frame.name); // Muestra solo el último frame de salto
                this.sprite.anims.stop(); // Detener la animación para que no se reproduzcan más frames
            }
            // Restablecer el enfriamiento después de un tiempo
            setTimeout(() => {
                this.dashCooldown = false; // Restablece el enfriamiento
            }, 1000); // Tiempo de enfriamiento de 1 segundo
        }, 200); // Duración del dash, aquí son 200 ms
    }
    update() {
        // Aquí puedes agregar lógica para el personaje, como controlar el movimiento
        if (this.isAttacking || this.isBeingAttacked || this.isDashing) {
            this.hitbox();
            return;
        }
        if (!this.canMove) {
            // Si está caído, verifica si se presiona la tecla B para levantarse
            if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B))) {
                this.sprite.play('luffylevantandose', true); // Activa la animación de levantarse

                // Cuando la animación de levantarse termine, permite el movimiento nuevamente
                this.sprite.on('animationcomplete', (animation) => {
                    if (animation.key === 'luffylevantandose') {
                        this.canMove = true; // Permite el movimiento
                        this.sprite.play('luffyparado', true); // Vuelve a la animación de parado
                    }
                });
            }
            return; // Salir del update para que no pueda moverse
        }



        if (this.cursorKeys.left.isDown) {
            // Mueve a Luffy hacia la izquierda
            this.sprite.setVelocityX(-400);
            if (this.sprite.flipX == false) {

                // this.updateHitbox(); 
                // Invertir la dirección visual
                // Actualizar hitbox y posición visual solo una vez
            }
            this.sprite.flipX = true;
            // Girar Luffy hacia la izquierda
            if (this.sprite.body.blocked.down) {
                this.sprite.play('luffycorriendo', true);
                
               
                        this.playWalkSound();
                    
                
            }// Reproducir animación de correr
        } else if (this.cursorKeys.right.isDown) {
            this.sprite.setVelocityX(400); // Mueve a Luffy hacia la derecha

            this.sprite.flipX = false;
            // Girar Luffy hacia la derecha
            if (this.sprite.body.blocked.down) {
                this.sprite.play('luffycorriendo', true);
                    this.playWalkSound();
                
            } // Reproducir animación de correr
        } else {
            this.sprite.setVelocityX(0); // si no estan ninguna de estas teclas presionadas su velocidad es 0
            if (this.sprite.body.blocked.down && this.sprite.anims.currentAnim.key !== 'parado') {
                this.sprite.play('luffyparado', true);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyC) && !this.isDashing && !this.dashCooldown) {
            this.dash(); // Ejecuta el dash
        }
        if (this.isInAir && this.sprite.body.blocked.down) {
            this.landSound.play(); // Reproducir sonido de aterrizaje
            this.isInAir = false; // Marcar que ya no está en el aire
        }
        if (this.cursorKeys.up.isDown && this.sprite.body.blocked.down) {  /// si se presiona la tecla arriba y  el personaje esta tocando algo abajo salta
            this.sprite.setVelocityY(-500);
            this.sprite.play('luffysalto', true);
            this.lastJumpSoundIndex = 1 - this.lastJumpSoundIndex; // Cambia entre 0 y 1
            this.jumpSounds[this.lastJumpSoundIndex].play();
            this.isInAir = true; 
        }

       

        if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
            this.sprite.setVelocityX(0);
            this.startAttack('luffygolpepie');

        }
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) {
            this.sprite.setVelocityX(0);
            this.startAttack('luffylargogolpe');
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.sprite.setVelocityX(0);
            this.startAttack('luffygolpe');
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) {
            this.sprite.setVelocityX(0);
            this.startAttack('luffytree');

        }
        if (Phaser.Input.Keyboard.JustDown(this.keyV)) {
            this.sprite.setVelocityX(0);
            this.startAttack('luffyjet');


        }

        this.hitbox();
    }
    playAttackSound(attackAnim) {
        // Reproduce el sonido específico del ataque
        const sound = this.attackSounds[attackAnim];
        if (sound) {
            sound.play();
        }
        let esteno=false;
        // Establece el tiempo de retraso para la finalización según el ataque
        let endSoundDelay;
        switch (attackAnim) {
            case 'luffygolpepie':
                endSoundDelay = 800; // Tiempo para golpe de pie
                break;
            case 'luffytree':
                endSoundDelay = 1200; // Tiempo para tree
                break;
            case 'luffyjet':
                endSoundDelay = 300; // Tiempo para jet
                break;
            case 'luffylargogolpe':
                endSoundDelay = 150; // Tiempo para jet
                break;
            case 'luffygolpe':
                esteno=true;
                endSoundDelay = 1000; 
                // Tiempo para jet
                break;
            default:
                endSoundDelay = 1000; // Tiempo por defecto si no se reconoce el ataque
                break;
        }

        // Temporizador para reproducir el sonido de finalización
        this.scene.time.delayedCall(endSoundDelay, () => {
            if (this.isAttacking && !esteno) { // Asegurarse de que sigue en el ataque
                this.abanicar.play();
            
            }
        });
    }
    atack(attackAnim) {
        this.isAttacking = true;
        this.sprite.play(attackAnim);
        this.sprite.on('animationcomplete', () => {
            this.isAttacking = false;

        });
    }
    startAttack(attackAnim) {
        this.isAttacking = true;
        this.sprite.play(attackAnim);
        this.playAttackSound(attackAnim);
        // Obtener el ancho inicial de la animación
        const initialFrame = this.sprite.anims.currentFrame;
        const initialFrameData = this.scene.textures.getFrame('luffy', initialFrame.frame.name);
        const initialWidth = initialFrameData.width; // Ancho inicial
        const initialX = this.sprite.x; // Guardar la posición inicial en X
        let currentImpacto = null;    
        let frameCounter = 0;
        this.sprite.on('animationupdate', (animation, frame) => {
            const frameIndex = frame.index; 
            const currentFrame = this.sprite.anims.currentFrame;

            switch (animation.key) {
                case 'luffygolpepie':
                    if (frameIndex >14&&frameIndex < 18) {
                        this.colisionAtaque = true; // Activa la colisión en el frame 4
                    } else {
                        this.colisionAtaque = false; // Desactiva en otros frames
                    }
                    break;
                case 'luffytree':
                    if (frameIndex > 15&&frameIndex < 22) {
                        this.colisionAtaque = true; // Activa la colisión en el frame 6
                    } else {
                        this.colisionAtaque = false; // Desactiva en otros frames
                    }
                    break;
                case 'luffyjet':
                    if (frameIndex > 0&& frameIndex<5) {
                        this.colisionAtaque = true; // Activa la colisión en el frame 5
                    } else {
                        this.colisionAtaque = false; // Desactiva en otros frames
                    }
                    break;
                case 'luffylargogolpe':
                    if (frameIndex >5 && frameIndex<9) {
                        this.colisionAtaque = true; // Activa la colisión en el frame 3
                    } else {
                        this.colisionAtaque = false; // Desactiva en otros frames
                    }
                    break;
                case 'luffygolpe':
                    if (frameIndex > 3) {
                        this.colisionAtaque = true; // Activa la colisión en el frame 4
                    } else {
                        this.colisionAtaque = false; // Desactiva en otros frames
                    }
                    break;
                default:
                    this.colisionAtaque = false; // Desactiva colisión para animaciones desconocidas
                    break;
            }

            if (!this.isAttacking) return;
           
            if (currentFrame) {
                const frameData = this.scene.textures.getFrame('luffy', currentFrame.frame.name);
                const currentWidth = frameData.width; // Obtener el ancho del cuadro actual

                // Calcular la diferencia en ancho
                const widthDifference = currentWidth - initialWidth;

                // Calcular nueva posición X

                // Ajustar la posición X según la diferencia de ancho
                if (this.sprite.flipX) {
                    this.newX = initialX - (widthDifference / 2);
                } else {
                    this.newX = initialX + (widthDifference / 2);
                }
                // Establecer la nueva posición X
                this.sprite.x = this.newX;

                this.hitbox(); // Actualizar la hitbox según el nuevo tamaño
            }
            if (animation.key === 'luffyjet' && frameCounter < 2) {
                // Solo ejecutar las primeras 2 veces
                // Eliminar el impacto anterior si existe
                if (currentImpacto) {
                    currentImpacto.destroy();
                }
        
                // Crear un nuevo impacto según el frame actual de luffyjet
                const offset = (this.sprite.flipX ? -1 : 1) * (10 + (frameIndex - 1) * 60); // Ajustar la distancia según el frame
                currentImpacto = this.scene.add.sprite(this.sprite.x + offset, this.sprite.y, 'impacto', `impacto_(${frameIndex-1})`);
                currentImpacto.setFlipX(this.sprite.flipX); // Girar el impacto según la dirección de Luffy
                currentImpacto.setDepth(1); // Colocarlo en el frente
        
                frameCounter++;  // Incrementar el convtador de frames
            }else{
                if (currentImpacto) {
                    currentImpacto.destroy();
                }
            }
           
        });

        // Escuchar el final de la animación para desactivar el indicador de ataque
        this.sprite.on('animationcomplete', () => {
            this.isAttacking = false;
            if (currentImpacto) currentImpacto.destroy();
            this.sprite.off('animationcomplete'); // Desactivar evento para evitar llamadas duplicadas
            this.sprite.off('animationupdate'); // Desactivar el evento de actualización
            
        });
    }
    cancelAttack() {
        if (this.isAttacking) {
            this.isAttacking = false;
            this.sprite.stop(); // Detener la animación de ataque
            this.sprite.off('animationupdate'); // Quitar evento de actualización
            
            this.sprite.off('animationcomplete'); // Quitar evento de completar animación
        }
    }
    updateHitbox() {
        //  this.sprite.body.setSize(this.sprite.width, this.sprite.height);
        const offsetX = this.sprite.width;
        if (this.sprite.flipX) {
            this.sprite.x -= offsetX;
            this.sprite.body.setOffset(0, 0);
        } else {
            this.sprite.x += offsetX;
            this.sprite.body.setOffset(-offsetX, 0);
        }
    }
    receiveAttack(direction) {
        if (this.isAttacking) {
            this.cancelAttack(); // Detener el ataque en progreso
        }
        this.isBeingAttacked = true; // Activar el estado de ser atacado
        const pushForce = 1050; // Ajusta la fuerza del 
        this.sprite.setVelocityY(-190)
        this.sprite.setVelocityX(pushForce * direction); // Empujar en la dirección del ataque
        this.canMove = false;
        this.sprite.play('luffcaida', true);
        // Puedes usar un temporizador para desactivar el estado de ser atacado
        this.scene.time.delayedCall(410, () => { // 500ms de empuje
            this.isBeingAttacked = false; // Desactivar después de un tiempo
            this.sprite.setVelocityX(0); // Detener el movimiento después del empuje
        });
    }
    hitbox() {
        const currentFrame = this.sprite.anims.currentFrame;

        if (currentFrame) {
            const frameData = this.scene.textures.getFrame('luffy', currentFrame.frame.name);

            if (frameData) {
                const { width, height, x, y } = frameData;
                this.sprite.body.setSize(width, 65);
                const attackWidthExtension = this.getAttackWidthExtension(); // Llamamos a un método que devuelva la extensión dependiendo de la animación

                // Si está mirando hacia la izquierda o derecha, ajustamos el ancho de la hitbox
                if (this.sprite.flipX) {
                    this.sprite.body.setSize(width + attackWidthExtension, height);
                    this.sprite.body.setOffset(x - attackWidthExtension, y);
                     // Ajustamos la posición para no hacer la hitbox demasiado grande hacia un lado
                } else {
                    this.sprite.body.setSize(width + attackWidthExtension, height);
                    this.sprite.body.setOffset(x, y); // Ajustamos la posición para la dirección normal
                }


            }
        }
    }
    getAttackWidthExtension() {
        const attackAnimations = {
            'luffygolpepie': 40,  // Para 'luffygolpepie', la hitbox se extiende 40 píxeles
            'luffytree': 50,      // Para 'luffytree', la hitbox se extiende 50 píxeles
            'luffyjet': 300,       // Para 'luffyjet', la hitbox se extiende 60 píxeles
            'luffylargogolpe': 70, // Para 'luffylargogolpe', la hitbox se extiende 70 píxeles
            'luffygolpe': 30,     // Para 'luffygolpe', la hitbox se extiende 30 píxeles
            // Puedes agregar más animaciones aquí si es necesario
        };
    
        const currentAnim = this.sprite.anims.currentAnim.key;
        return attackAnimations[currentAnim] || 0;  // Devuelve la extensión dependiendo de la animación actual
    }
    getAttackDamage() {
        const attackAnimations = {
            'luffygolpepie': 100,      // Para 'luffygolpepie', quita 10 de vida
            'luffytree': 160,          // Para 'luffytree', quita 20 de vida
            'luffyjet': 40,           // Para 'luffyjet', quita 40 de vida
            'luffylargogolpe': 20,    // Para 'luffylargogolpe', quita 30 de vida
            'luffygolpe': 10,         // Para 'luffygolpe', quita 15 de vida
            // Puedes agregar más animaciones y su daño correspondiente aquí
        };
    
        const currentAnim = this.sprite.anims.currentAnim.key;
        return attackAnimations[currentAnim] || 0;  // Devuelve el daño según la animación actual, o 0 si no está en una animación de ataque
    }
   
}
