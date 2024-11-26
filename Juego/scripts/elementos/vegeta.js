export default class Vegeta {
    constructor(scene, colision, x, y, spirtenemigo) {
        this.spirtenemigo = spirtenemigo;
        this.scene = scene;
        this.daño = false;
        this.colision = colision;
        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.isGrounded = true; // Inicializa el estado de estar en el suelo
        this.create(x, y);
    }

    create(x, y) {
        // Crea el sprite del Swordman
        this.sprite = this.scene.physics.add.sprite(x, y, 'vegeta', 0).setScale(1);
        this.sprite.body.setGravityY(800);

        // Configuración de colisiones
        this.scene.physics.add.collider(this.sprite, this.colision, this.onCollision.bind(this));

        // Creación de animaciones
        this.createAnimations();

        this.sprite.play('vegetaparado'); // Reproduce la animación inicial

    }

    createAnimations() {
        const animsData = this.scene.cache.json.get('vegetaanimado');

        animsData.anims.forEach(anim => {
            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });


    }

    siguiendoLuffy() {
        if (this.atacando)
            return
        const distancia = Math.abs(this.spirtenemigo.x - this.sprite.x);
        const permitirAtacar = 80;

        if (distancia > permitirAtacar) {
            const direccionB = (this.spirtenemigo.x < this.sprite.x);
            const direccion = (direccionB) ? -1 : 1;
            this.sprite.flipX = direccionB;
            this.sprite.setVelocityX(150 * direccion);
            if (this.sprite.anims.currentAnim.key !== 'vegetacorriendo' || !this.sprite.anims.isPlaying) {

                this.sprite.play('vegetacorriendo');
            }

        } else {
            this.sprite.setVelocityX(0);
            const probabilidades = [
                { probabilidad: 0, animacion: "vegetapatada", fuerza: 50, velocidad: 5 }, // 50%
                { probabilidad: 0, animacion: "vegetagolpe", fuerza: 50, velocidad: 2 },  // 25%
                { probabilidad: 100, animacion: "vegetaonda", fuerza: 0, velocidad: 2 }     // 25%
            ];

            // Generar un número entre 1 y 100
            const probability = Phaser.Math.Between(1, 100);
            let acumulado = 0;

            // Determinar qué acción realizar según el número generado
            for (const accion of probabilidades) {
                acumulado += accion.probabilidad;
                if (probability <= acumulado) {
                    this.vegetaGolpe(accion.animacion, accion.fuerza, accion.velocidad);
                    break;
                }
            }

        }
    }


    vegetaGolpe(nombre, valor, casta) {
        if (this.atacando)
            return
        this.atacando = true;

        if (nombre === "vegetaonda") {
            this.onda();
            return;
        }
        this.sprite.play(nombre);
        // Listener para cada actualización de frame
        this.sprite.on("animationupdate", (animation, frame) => {
            const frameindex = frame.index;

            if (frameindex === casta) {
                this.daño = true;
                const currentFrame = this.sprite.anims.currentFrame;
                const frameData = this.scene.textures.getFrame("vegeta", currentFrame.frame.name);
                const {
                    width, height, x, y
                } = frameData;

                if (this.sprite.flipX) {
                    this.sprite.body.setSize(width + valor, height);
                    this.sprite.body.setOffset(x - valor, y);
                    // Ajustamos la posición para no hacer la hitbox demasiado grande hacia un lado
                } else {
                    this.sprite.body.setSize(width + valor, height);
                    this.sprite.body.setOffset(x, y); // Ajustamos la posición para la dirección normal
                }

            } else {
                this.daño = false;
                const currentFrame = this.sprite.anims.currentFrame;
                const frameData = this.scene.textures.getFrame("vegeta", currentFrame.frame.name);
                const {
                    width, height, x, y
                } = frameData;

                if (this.sprite.flipX) {
                    this.sprite.body.setSize(width + 0, height);
                    this.sprite.body.setOffset(x - 0, y);
                    // Ajustamos la posición para no hacer la hitbox demasiado grande hacia un lado
                } else {
                    this.sprite.body.setSize(width + 0, height);
                    this.sprite.body.setOffset(x, y); // Ajustamos la posición para la dirección normal
                }
            }
        });

        // Listener para cuando la animación completa
        this.sprite.on("animationcomplete", () => {
            this.daño = false;
            this.atacando = false;
            this.sprite.off("animationcomplete");
            this.sprite.off("animationupdate");
            console.log("geis")
        });



    }


    onda() {
        this.sprite.play("vegetaonda");

        this.scene.time.delayedCall(700, () => {

            this.ondita = this.scene.sac.create(this.sprite.x, this.sprite.y - 30, "onda");
            this.ondita.play("ataque")

        })
        this.sprite.on("animationcomplete", () => {
            this.ondita.destroy();
            this.daño = false;
            this.atacando = false;
            this.sprite.off("animationcomplete");
            this.sprite.off("animationupdate");
            console.log("geis")
        });
    }


    checkCollision(target) {
        if (this.hitbox) {
            return (
                this.hitbox.x < target.x + target.width &&
                this.hitbox.x + this.hitbox.width > target.x &&
                this.hitbox.y < target.y + target.height &&
                this.hitbox.y + this.hitbox.height > target.y
            );
        }
        return false;
    }


    onCollision() {
        this.isGrounded = true; // Establece isGrounded en true al colisionar
    }

    update() {
        this.siguiendoLuffy();

    }

    die() {
        console.log("Vegeta ha muerto!");
        this.sprite.play('muriendo');

        this.sprite.setActive(false);  // Desactivar el sprite (o cambiarlo si quieres que se destruya)
        this.sprite.setVisible(false); // Hacer invisible a Kaido
        this.sprite.body.destroy();
        this.actu = false;
        this.scene.endLevel();
    }

}
