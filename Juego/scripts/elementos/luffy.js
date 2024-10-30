export default class Luffy {
    constructor(scene) {
        this.scene = scene;
        this.cursorKeys;
        this.create();
    }

    

    create() {
        this.luffy = this.scene.physics.add.sprite(400, 300, 'luffy').setScale(1);
        this.luffy.setCollideWorldBounds(true);
        this.luffy.body.setGravityY(800);
        
        this.scene.physics.add.collider(this.luffy, this.scene.barcocolision, () => {
            this.isGrounded = true;
        });

        this.scene.anims.create({
            key: 'parado',
            frames: this.scene.anims.generateFrameNames('luffy', { start: 8, end: 10 }),
            frameRate: 7,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'corriendo',
            frames: this.scene.anims.generateFrameNames('luffy', { start: 1, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.luffy.play('parado');
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    }

    update() {
        // Aquí puedes agregar lógica para el personaje, como controlar el movimiento
        
        if (this.cursorKeys.left.isDown) {
            this.luffy.setVelocityX(-300); // Mueve a Luffy hacia la izquierda
            this.luffy.flipX = true; // Girar Luffy hacia la izquierda
            this.luffy.play('corriendo', true); // Reproducir animación de correr
        } else if (this.cursorKeys.right.isDown) {
            this.luffy.setVelocityX(300); // Mueve a Luffy hacia la derecha
            this.luffy.flipX = false; // Girar Luffy hacia la derecha
            this.luffy.play('corriendo', true); // Reproducir animación de correr
        } else {
            this.luffy.setVelocityX(0); // si no estan ninguna de estas teclas presionadas su velocidad es 0

        }

        if (this.cursorKeys.up.isDown && this.luffy.body.blocked.down) {  /// si se presiona la tecla arriba y  el personaje esta tocando algo abajo salta
            this.luffy.setVelocityY(-400);
        }


        if (this.luffy.body.velocity.x === 0 && this.luffy.body.velocity.y === 0) {
            this.luffy.play('parado', true); // Reproducir animación de parado
        }
    }
}
