export default class FallingPlatform {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} sprite
   */
  constructor(scene, x, y, sprite) {
    this.sprite = scene.physics.add.sprite(x, y, sprite, 0);
    scene.fallingPlatformGroup.add(this.sprite);
    this.sprite.body.setAllowGravity(false);
  }
}
