export default class Swordman {
    constructor(scene, colision, x, y) {
        this.scene = scene;
        this.colision = colision;
        this.isGrounded = true; // Inicializa el estado de estar en el suelo
        this.create(x, y);
    }

    create(x,y) {
        // Crea el sprite del Swordman
        this.sprite = this.scene.physics.add.sprite(x,y, 'marina', 0).setScale(1);
        this.sprite.body.setGravityY(800);

        // Configuración de colisiones
        this.scene.physics.add.collider(this.sprite, this.colision, this.onCollision.bind(this));

        // Creación de animaciones
        this.createAnimations();

         this.sprite.play('marinaparado'); // Reproduce la animación inicial
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla para atacar
    }

    createAnimations() {
        const animsData = this.scene.cache.json.get('marinaAnims');

        animsData.anims.forEach(anim => {
            console.log("agreagndo");
            this.scene.anims.create({
                key: anim.key,
                frames: anim.frames.map(frame => ({ key: frame.key, frame: frame.frame })),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        });

    
    }

    onCollision() {
        this.isGrounded = true; // Establece isGrounded en true al colisionar
    }

    update() {
        // Lógica para atacar
        if (this.attackKey.isDown) {
            this.attack();
        }

    }

    attack() {
        // Reproducir la animación de ataque
        this.sprite.play('marinaatacando');
        this.sprite.on('animationcomplete', () => {
            // Al completar la animación de ataque, volver a la animación de quieto
            this.sprite.play('marinaparado');
        }, this);
        // Aquí puedes agregar la lógica de daño o interacción con otros objetos
    }

    die() {
        this.sprite.play('muriendo'); // Reproduce la animación de muerte
        // Aquí puedes agregar lógica adicional para manejar la muerte del personaje
    }
}
