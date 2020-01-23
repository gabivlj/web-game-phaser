import Phaser from 'phaser';

export default class MovingPlatform {
    constructor(scene, x, y, sprite) {
        this.sprite = scene.fallingPlatformGroup.create(x, y, sprite, 0);
        this.sprite.setName('moving_platform');
        this.sprite.body.setAllowGravity(false);
      }
}