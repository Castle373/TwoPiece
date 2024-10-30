export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
    }

    create() {
        this.add.text(100, 100, 'Bienvenido a Nivel 1', { fontSize: '32px', fill: '#fff' });
    }
}
