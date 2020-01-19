/* eslint-disable no-return-assign */
import Phaser from 'phaser';
import DialogManager from './dialogManager';
import playerConfig from '../config/playerConfig';

let dead = false;
const pickUpDialogWhenDead = [
  'Damn, you suck at this.',
  'So, are we trying again?',
  'This is becoming boring\nto be honest....',
  'Chill out!!',
];

const dialogWhenJumping = [
  'WOOOOOO',
  'DAAAMN',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

export default class Player {
  constructor(scene, x, y) {
    if (dead) {
      const dialog = new DialogManager(scene, [
        pickUpDialogWhenDead[
          Math.floor(Math.random() * pickUpDialogWhenDead.length)
        ],
      ]);
      dialog.nextDialog();
      setTimeout(() => dialog.nextDialog(), 3000);
    }
    this.scene = scene;
    this.usedJump = true;

    // Create the animations we need from the player spritesheet
    const { anims } = scene;
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('player', { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1,
    });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'player', 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400);

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D, SPACE } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D,
      space: SPACE,
    });
    this.sprite.setTint(0xfff5db);
  }

  checkWallJump(againstWall, inputAgainstWall, onGround, up) {
    if (!playerConfig.canJumpFromWalls) return;
    const { sprite } = this;
    if (againstWall && !onGround && up) {
      // input.up.isDown || input.w.isDown
      sprite.setVelocityY(-300);
      sprite.setBounceX(100);
    } else if (againstWall && !onGround && inputAgainstWall) {
      // input.left.isDown || input.a.isDown
      sprite.setVelocityY(30);
    }
  }

  update(canMove) {
    const { sprite, keys } = this;
    const onGround = sprite.body.blocked.down;
    const onLeft = sprite.body.blocked.left;
    const onRight = sprite.body.blocked.right;
    const acceleration = onGround ? 600 : 200;
    sprite.setBounceX(0);
    sprite.setBounceY(0);
    if (this.scene.physics.world.overlap(this.sprite, this.scene.jumpGroup)) {
      // this.sprite.setBounceY(100);

      this.sprite.setBounceY(100);
    } else this.sprite.setBounceY(0);

    // Apply horizontal acceleration when left/a or right/d are applied
    if (canMove) {
      if (keys.left.isDown || keys.a.isDown) {
        sprite.setAccelerationX(-acceleration);
        // No need to have a separate set of graphics for running to the left & to the right. Instead
        // we can just mirror the sprite.
        sprite.setFlipX(true);
      } else if (keys.right.isDown || keys.d.isDown) {
        sprite.setAccelerationX(acceleration);
        sprite.setFlipX(false);
      } else {
        sprite.setAccelerationX(0);
      }

      // Only allow the player to jump if they are on the ground
      if (onGround && (keys.up.isDown || keys.w.isDown)) {
        this.scene.sound.play('jump_sound');
        sprite.setVelocityY(-300);
        setTimeout(() => (this.usedJump = false), 300);
      } else if (
        playerConfig.canDoubleJump &&
        !onGround &&
        !this.usedJump &&
        (keys.up.isDown || keys.w.isDown)
      ) {
        console.log('xxxdf');
        this.usedJump = true;
        sprite.setVelocityY(-200);
      }

      this.checkWallJump(
        onLeft,
        !keys.up.isDown && (keys.left.isDown || keys.a.isDown),
        onGround,
        keys.space.isDown,
      );

      this.checkWallJump(
        onRight,
        !keys.up.isDown && (keys.right.isDown || keys.d.isDown),
        onGround,
        keys.space.isDown,
      );
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play('player-run', true);
      else sprite.anims.play('player-idle', true);
    } else {
      sprite.anims.stop();
      sprite.setTexture('player', 10);
    }
  }

  destroy() {
    dead = true;
    this.sprite.destroy();
  }
}
