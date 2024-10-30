export default class Barco {
    constructor(scene) {
        this.scene = scene;
        let barco;
        this.create();
    }
    
    animar(image){
        this.scene.tweens.add({
            targets: [this.barco, image],
            y: this.barco.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    create() {
        this.barco = this.scene.physics.add.sprite(-(this.scene.sys.game.config.width / 6), (this.scene.sys.game.config.height / 4), 'barco').setOrigin(0, 0);
        
        this.scene.anims.create({
            key: 'navegar',
            frames: this.scene.anims.generateFrameNames('barco', { prefix: 'frames2_', start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        this.barco.play("navegar");
        
    }

    update() {
        // Aquí puedes agregar lógica para el barco si es necesario
    }
}
