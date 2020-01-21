import Phaser from 'phaser';
import DialogManager from '../objects/dialogManager';

const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;

let can = true;

// So there is no instant dialog change...
function recharge() {
  can = false;
  setTimeout(() => (can = true), 100); //
}

// Check if finished
let finished = false;

export default scene => {
  let current = 0;
  // Get inputs of scene.
  const keys = scene.input.keyboard.addKeys({
    left: LEFT,
    right: RIGHT,
    up: UP,
    w: W,
    a: A,
    d: D,
  });
  /**
   * [
    'Yeah, that was easy...',
    'But you know you can double JUMP?',
    'Use jump button again on the air!',
  ]
   */
  // Current Dialog for this cutscene
  const dialog = new DialogManager(scene, [
    'Hey, you know you can dash with shift right?',
    'Yeah, I suppose you knew that...',
  ]);
  // Indicate on what current we want the screen to expand
  const EXPAND_SCREEN = 6;
  // If we already had cutscene don't show it again.
  if (finished)
    return () => {
      dialog.nextDialog();
      return finished;
    };

  /**
   * Process current, show different actions depending on state. Call on every update tick
   * @returns Whether the player can move or not already.
   */
  return () => {
    if (current === EXPAND_SCREEN) {
      scene.player.sprite.anims.play('player-idle', true);
      current = 8;
      return false;
    }
    if (dialog.finished) {
      finished = true;
      return true;
    }
    if (current < EXPAND_SCREEN) {
      scene.player.sprite.anims.stop();
      scene.player.sprite.setTexture('player', 10);
    }
    // If its on 0, we are on the beginning of the scene
    if (current === 0) {
      dialog.nextDialog();
      current++;
      // If its an odd number we are reading dialog
    } else if (current % 2 === 1) {
      if (keys.right.isDown && can) {
        current++;
      }
      // If it's not we pass dialog and call recharge
    } else {
      dialog.nextDialog();
      current++;
      recharge();
    }

    return false;
  };
};
