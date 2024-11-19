export default class PersonajeBase {
    constructor(scene, colision, x, y, spriteKey, animsKey, animInicial) {
        this.scene = scene;
        this.colision = colision;
        this.isGrounded = true; // Estado inicial de estar en el suelo
        this.spriteKey = spriteKey;
        this.animsKey = animsKey;

        this.create(x, y, animInicial);
    }

    create(x, y, animInicial) {
        // Crear el sprite del personaje
        this.sprite = this.scene.physics.add.sprite(x, y, this.spriteKey, 0).setScale(1);
        this.sprite.body.setGravityY(800);

        // Configuración de colisiones
        this.scene.physics.add.collider(this.sprite, this.colision, this.onCollision.bind(this));

        // Crear animaciones del personaje
        this.createAnimations();

        // Reproducir la animación inicial
        this.sprite.play(animInicial);
    }

    createAnimations() {
        const animsData = this.scene.cache.json.get(this.animsKey);

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
        this.isGrounded = true; // Establecer estado al colisionar con el suelo
    }

    update() {
        // Lógica común de actualización, si es necesaria
    }
}
