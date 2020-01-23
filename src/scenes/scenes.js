/* eslint-disable no-param-reassign */
import { getCurrentScene, setCurrentScene } from '../storage/scene';
import timestamper from '../objects/timestamper';
import { saveConfig, getConfig } from '../storage/menu';

// import Player from '../objects/player';
/* eslint-disable no-plusplus */

// List of scene names that we are gonna use for cleaner scene one on one passing
const scenes = ['MainScene', 'FourthScene', 'SecondScene', 'ThirdScene'];
let currentScene = 0;
let maxScene = getConfig('maxScene', 'number', 0);

const loadedMusic = false;

/**
 * Scene utils that we are gonna use across all scenes so we save lines of code :)
 */
const sceneUtils = {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} idx
   */
  fastSceneChange(scene, idx) {
    if (idx > maxScene) return;
    currentScene = idx;
    scene.player.setDead(false);
    scene.music.stop();
    setCurrentScene(scenes[currentScene]);
    timestamper.finish(scene.scene.key);
    scene.scene.start(scenes[currentScene]);
  },

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {object} configuration Config. Object which tells the tilemap that we wanna load and the path of the stuff inside the webserver.
   */
  preloadScene(scene, { path, tilemapKey }) {
    const currentSceneStr = getCurrentScene();
    if (scene.scene.key !== currentSceneStr) {
      currentScene = scenes.indexOf(currentSceneStr);
      scene.scene.start(scenes[currentScene]);
    }
    scene.load.audio('music', `${path}/assets/music.mp3`);
    scene.load.audio('jump_sound', `${path}/assets/jump01.mp3`);
    scene.load.image('tiles', `${path}/assets/Tileset.png`);
    scene.load.image('moving_platform', `${path}/assets/movingPlatform.png`);
    scene.load.spritesheet('player2', `${path}/assets/tutorial/player.png`, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    scene.load.spritesheet('player', `${path}/assets/player.png`, {
      frameWidth: 30,
      frameHeight: 30,
      margin: 1,
      spacing: 2,
    });
    scene.load.tilemapTiledJSON(`${tilemapKey}`, `${path}/${tilemapKey}.json`);
    scene.jumpGroup = scene.physics.add.staticGroup();
    scene.jumps = [];
    return true;
  },

  /**
   * Shortcut for resetting a scene.
   * @param {Phaser.Scene} scene
   */
  restart(scene) {
    scene.player.destroy();
    scene.scene.restart();
    scene.music.stop();
    timestamper.finish(scene.scene.key);
  },

  /**
   * Shortcut for passing a scene.
   * @param {Phaser.Scene} scene
   */
  changeScene(scene, success) {
    timestamper.finish(scene.scene.key, success);
    scene.music.stop();
    if (currentScene + 1 >= scenes.length) return;
    currentScene++;
    if (maxScene <= currentScene) {
      maxScene = currentScene;
      saveConfig('maxScene', maxScene);
    }
    setCurrentScene(scenes[currentScene]);
    scene.player.setDead(false);
    scene.scene.start(scenes[currentScene]);
  },
};

export default sceneUtils;
