export default class FallingPlatform {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} sprite
   */
  constructor(scene, x, y, sprite) {
    this.sprite = scene.fallingPlatformGroup.create(x, y, sprite, 0);
    this.sprite.setName('falling_platform');
    this.sprite.body.setAllowGravity(false);
  }
}
