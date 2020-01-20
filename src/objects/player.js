/* eslint-disable no-return-assign */
import Phaser from 'phaser';
import DialogManager from './dialogManager';
import playerConfig from '../config/playerConfig';
import sceneUtils from '../config/scenes';

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

/**
 * Player class.
 * @description We could literally rewrite a lot of this things, like a state machine, but its fine for the moment.
 */
export default class Player {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    this.dialog = { finished: true };
    // Direction which he is facing.
    this.facing = { right: true, left: false };
    // If the player died before show the message that he died.
    if (dead) {
      // Choose random dialog with randomized phrase
      this.dialog = new DialogManager(scene, [
        pickUpDialogWhenDead[
          Math.floor(Math.random() * pickUpDialogWhenDead.length)
        ],
      ]);
      // start dialog
      this.dialog.nextDialog();
      // if the dialog didn't finish for whatever reason finish it in 3 seconds with another nextDialog()
      setTimeout(() => !this.dialog.finished && this.dialog.nextDialog(), 3000);
    }
    // Boolean for canDash
    this.canDash = true;
    // Keep scene pointer
    this.scene = scene;
    // Check if user used the jump for a double jump
    this.usedJump = true;
    // Create the animations we need from the player spritesheet
    const { anims } = scene;
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      // Sprite to use
      .sprite(x, y, 'player_a', 0)
      // Decceleration on X axis
      .setDrag(2000, 0)
      // Size of the colliding box
      .setSize(30, 20)
      // Offset so the collider of the sprite works well
      .setOffset(0, 10)
      // Max velocity, important because there is a lot of bouncing goin on if you know what I mean my dudes
      .setMaxVelocity(300, 400)
      // Scale of the sprite and colliding box
      .setScale(1.4);
    // Create idle animation
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    // Run animation
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('player', { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1,
    });
    // Player falls
    anims.create({
      key: 'player-fall',
      frames: anims.generateFrameNumbers('player', { start: 15, end: 19 }),
      frameRate: 3,
      repeat: -1,
    });
    // Player jumps
    anims.create({
      key: 'player-jump',
      frames: anims.generateFrameNumbers('player', { start: 18, end: 20 }),
      frameRate: 1,
      repeat: -1,
    });
    // Track the arrow keys & WASD
    const {
      LEFT,
      RIGHT,
      UP,
      W,
      A,
      D,
      SPACE,
      SHIFT,
    } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D,
      space: SPACE,
      shift: SHIFT,
    });
    this.sprite.setTint(0xfff5db);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.onWorldBounds = true;
    scene.physics.world.on(
      'worldbounds',
      body => {
        if (body.blocked.down) sceneUtils.restart(scene);
      },
      scene,
    );
  }

  checkWallJump(againstWall, inputAgainstWall, onGround, up) {
    if (!playerConfig.canJumpFromWalls) return;
    const { sprite } = this;
    if (againstWall && !onGround && up) {
      this.scene.sound.removeByKey('jump_sound');
      this.scene.sound.play('jump_sound');
      sprite.setVelocityY(-300);
      sprite.setBounceX(100);
      return;
    }
    if (!againstWall || onGround || !inputAgainstWall) return;
    sprite.setVelocityY(30);
  }

  /**
   * The update method of the player.
   * @param {Boolean} canMove If the player can move, useful for a cutscene.
   */
  update(canMove) {
    const { sprite, keys } = this;
    // Reset the max velocity in case that the player dashed.
    sprite.setMaxVelocity(300, 400);
    // Reset bounciness because we wanna let the player "attach" to the wall
    sprite.setBounceX(0);
    sprite.setBounceY(0);
    // Check if player is on the ground.
    const onGround = sprite.body.blocked.down;
    // Check if colliding on left
    const onLeft = sprite.body.blocked.left;
    // Check if colliding on right
    const onRight = sprite.body.blocked.right;
    // Wanna give more of a SM64 vibe when running.
    const acceleration = onGround ? 400 : 200;
    // Check if he is colliding with a jumping platform
    if (this.scene.physics.world.overlap(this.sprite, this.scene.jumpGroup)) {
      // SPIN!!!!!!!! :)
      sprite.setAngularAcceleration(1000 * (this.facing.left ? -1 : 1));
      this.scene.sound.removeByKey('jump_sound');
      this.scene.sound.play('jump_sound');
      this.sprite.setBounceY(100);
      this.canDash = true;
      return;
    }
    // Refactoring of the keys.left.isDown mess that the tutorials make everytime LMAO.
    // Seriously Medium © ARTICLE WRITErS, is that hard to do this instead of making the mess accessing 2 properties
    // FOR A KEY??????? Like i would understand that you wouldn't rewrite it for a personal project or something like that but whatever.
    // Ok this rant is over keep scrolling
    const [isPressingLeft, isPressingRight, isPressingUp] = [
      keys.left.isDown || keys.a.isDown,
      keys.right.isDown || keys.d.isDown,
      keys.up.isDown || keys.w.isDown,
    ];

    // If he can move (because we don't want him to move in the middle of a cutscene)
    if (canMove) {
      if (isPressingLeft) {
        sprite.setAccelerationX(-acceleration);
        // Yea phaser is cool letting us to flip sprites
        sprite.setFlipX(true);
        // Change the facing state to the left
        this.facing.left = true;
        this.facing.right = false;
      } else if (isPressingRight) {
        sprite.setAccelerationX(acceleration);
        sprite.setFlipX(false);
        // Change the facing state to the right
        this.facing.left = false;
        this.facing.right = true;
      } else {
        sprite.setAccelerationX(0);
      }

      // Only allow the player to jump if they are on the ground
      if (onGround && isPressingUp) {
        sprite.anims.play('player-jump', true);
        this.scene.sound.play('jump_sound');
        sprite.setVelocityY(-300);
        setTimeout(() => (this.usedJump = false), 300);
      } else if (
        playerConfig.canDoubleJump &&
        !onGround &&
        !this.usedJump &&
        isPressingUp
      ) {
        this.usedJump = true;
        sprite.setVelocityY(-200);
      }

      if (
        playerConfig.canDash &&
        !onGround &&
        this.canDash &&
        keys.shift.isDown
      ) {
        sprite.setVelocityY(-300);
        sprite.setMaxVelocity(900, 400);
        sprite.setVelocityX((this.facing.left ? -1 : 1) * 700);

        sprite.setAngularAcceleration(100 * (this.facing.left ? -1 : 1));
        // setTimeout(() => {
        //   this.currentVelocityX = 0;
        //   this.currentVelocityY = 0;
        // }, 500);
        this.canDash = false;
      }

      this.checkWallJump(
        onLeft,
        !keys.up.isDown && isPressingLeft,
        onGround,
        keys.space.isDown,
      );

      this.checkWallJump(
        onRight,
        !keys.up.isDown && isPressingRight,
        onGround,
        keys.space.isDown,
      );
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      sprite.setAngularAcceleration(0);
      sprite.setAngularVelocity(0);
      sprite.setAngle(0);
      this.canDash = true;
      if (sprite.body.velocity.x !== 0) sprite.anims.play('player-run', true);
      else sprite.anims.play('player-idle', true);
    } else {
      sprite.anims.stop();
      if (sprite.body.velocity.y > 0) sprite.anims.play('player-fall', false);
      else {
        sprite.anims.play('player-jump', false);
      }
    }
  }

  // Shortcut for destroying the player
  destroy() {
    dead = true;
    this.sprite.destroy();
    // return !this.dialog.finished && this.dialog.nextDialog();
  }
}
