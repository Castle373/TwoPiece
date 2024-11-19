export default class Law {
    constructor(scene, colision, x, y) {
        this.scene = scene;
        this.colision = colision;
        this.isGrounded = true; // Inicializa el estado de estar en el suelo
        this.create(x, y);
    }

    create(x,y) {
        // Crea el sprite del Swordman
        this.sprite = this.scene.physics.add.sprite(x,y, 'law', 0).setScale(1);
        this.sprite.body.setGravityY(800);

        // Configuración de colisiones
        this.scene.physics.add.collider(this.sprite, this.colision, this.onCollision.bind(this));

        // Creación de animaciones
        this.createAnimations();

        this.sprite.play('lawparado'); // Reproduce la animación inicial
    }

    createAnimations() {
        const animsData = this.scene.cache.json.get('lawAnims');

        animsData.anims.forEach(anim => {
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
        

    }

}
