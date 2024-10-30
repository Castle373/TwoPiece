export default class Fondo {
    constructor(scene) {
        this.scene = scene;
        
        this.create();
    }

    

    create() {
        this.fondo1 = this.scene.add.image(0, 0, 'fondo').setOrigin(0, 0);
        this.fondo1.displayWidth = this.scene.sys.game.config.width;
        this.fondo1.displayHeight = this.scene.sys.game.config.height;

        this.fondo2 = this.scene.add.image(this.fondo1.displayWidth, 0, 'fondo2').setOrigin(0, 0);
        this.fondo2.displayWidth = this.scene.sys.game.config.width;
        this.fondo2.displayHeight = this.scene.sys.game.config.height;
    }

    update() {
        this.fondo1.x -= 0.4;
        this.fondo2.x -= 0.4;

        if (this.fondo1.x <= -this.fondo1.displayWidth) {
            this.fondo1.x = this.fondo2.x + this.fondo2.displayWidth;
        }
        if (this.fondo2.x <= -this.fondo2.displayWidth) {
            this.fondo2.x = this.fondo1.x + this.fondo1.displayWidth;
        }
    }
}
