export default class MovingPlatform {
    constructor(scene, x, y, range, sprite) {
        this.sprite = scene.movingPlatformGroup.create(x, y, sprite, 0);
        this.sprite.setName('moving_platform');
        this.sprite.body.setAllowGravity(false);
        this.direction = (Math.floor(Math.random() * 2)) ? 1 : -1;
        this.range = range;
        this.initialX = x;
        this.initialY = y;
        this.speed = 20;
        setInterval(() => {
            this.direction *= -1;
        }, 3000)
    }

    update() {
        this.sprite.setVelocityX(this.speed * this.direction);
    }
}