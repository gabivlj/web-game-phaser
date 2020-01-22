import Phaser from 'phaser';
import DialogManager from '../objects/dialogManager';
import { getConfig, saveConfig } from '../storage/menu';

const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;

let can = true;

// So there is no instant dialog change...
function recharge() {
  can = false;
  setTimeout(() => (can = true), 100);
}

// Check if finished
let finished = !!getConfig('cutscene01', 'number', 0);

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
  // If we already had cutscene don't show it again.
  if (finished)
    return () => {
      return true;
    };
  // Current Dialog for this cutscene
  const dialog = new DialogManager(scene, [
    'Hey...',
    'Hey!',
    'DUDE WAKE UP',
    'Thanks boy!\nDamn I thought you\nwere dead....',
    'If you are wondering who I am,\nthat is not of your bussiness,\nI am just telling you that we\nneed to leave this place ASAP!!',
    'They are following us,\nbut you got great power and \ngreat platforming skills \neven though you do not think so right now...',
  ]);
  // Indicate on what current we want the screen to expand
  const EXPAND_SCREEN = 6;

  /**
   * Process current, show different actions depending on state. Call on every update tick
   * @returns Whether the player can move or not already.
   */
  return () => {
    if (current === EXPAND_SCREEN) {
      scene.camera.setViewport(scene.camera.x, scene.camera.y, 600, 600);
      scene.player.sprite.anims.play('player-idle', true);
      current = 8;
      return false;
    }
    if (dialog.finished) {
      finished = true;
      saveConfig('cutscene01', 1);
      return true;
    }
    if (current < EXPAND_SCREEN) {
      scene.player.sprite.anims.stop();
      scene.player.sprite.setTexture('player', 10);
    }
    // If its on 0, we are on the beginning of the scene
    if (current === 0) {
      dialog.nextDialog();
      scene.camera.setViewport(scene.camera.x, scene.camera.y, 170, 120);
      scene.player;
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
