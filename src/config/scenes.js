import { getCurrentScene, setCurrentScene } from '../storage/scene';

// import Player from '../objects/player';
/* eslint-disable no-plusplus */

// List of scene names that we are gonna use for cleaner scene one on one passing
const scenes = ['MainScene', 'SecondScene', 'ThirdScene'];
let currentScene = 0;

let loadedMusic = false;

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
    if (idx > currentScene) return;
    currentScene = idx;
    scene.music.stop();
    setCurrentScene(scenes[currentScene]);
    scene.scene.start(scenes[currentScene]);
  },

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {object} configuration Config. Object which tells the tilemap that we wanna load and the path of the stuff inside the webserver.
   */
  preloadScene(scene, { path, tilemapKey }) {
    const currentSceneStr = getCurrentScene();
    console.log(currentSceneStr, scene.scene.key);
    if (scene.scene.key !== currentSceneStr) {
      currentScene = scenes.indexOf(currentSceneStr);
      scene.scene.start(scenes[currentScene]);
      return false;
    }
    scene.load.audio('music', `${path}/assets/music.mp3`);
    scene.load.audio('jump_sound', `${path}/assets/jump01.mp3`);
    scene.load.image('tiles', `${path}/assets/Tileset.png`);
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
  },

  /**
   * Shortcut for passing a scene.
   * @param {Phaser.Scene} scene
   */
  changeScene(scene) {
    scene.music.stop();
    if (currentScene + 1 >= scenes.length) return;
    currentScene++;
    setCurrentScene(scenes[currentScene]);
    scene.scene.start(scenes[currentScene]);
  },

  /**
   * Shortcut for a scene update
   * @this {Phaser.Scene} modified scene with this.player, and everything that an update needs.
   */
  sceneUpdate() {
    this.camera.startFollow(this.player.sprite);
    const canMove = this.cutscene ? this.cutscene() : true;
    if (!this.player.sprite.body) return;
    this.player.update(canMove);

    if (this.player.sprite.y > this.heightOfMap - this.player.sprite.height) {
      this.player.destroy();
      this.scene.restart();
      this.music.stop();
    }
  },

  loadScene() {},

  /**
   * General create() configuration for a normal scene.
   * @param {string} keyTileset
   * @param {number} posXPlayer
   * @param {number} posYPlayer
   */
  configScene(
    keyTileset,
    posXPlayer,
    posYPlayer,
    PlayerClass,
    configuration = { volume: 0 },
  ) {
    const { volume } = configuration;
    // Check if we already loaded music
    if (!loadedMusic)
      this.music = this.sound.add('music', {
        loop: true,
        volume,
        delay: 1,
      });
    // else just resume it
    else this.music.resume();
    // Set it on false so we know later to reset it
    loadedMusic = false;
    this.music.play();
    // Make tilemap with the provided tileset key (For different maps u know)
    const map = this.make.tilemap({ key: keyTileset });
    // The height of the map for checking later if the player f***ed up and fell down.
    this.heightOfMap = map.heightInPixels;
    // Set world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, this.heightOfMap);
    //  Add tileset image to the map, so we can use it. Usually the name of the tileset that we made in Tiled
    //  is gonna be plstileset, if not just pass in the future to this function the name that you want,
    //  and tiles is the key for the image that we loaded before
    const tileset = map.addTilesetImage('plstileset', 'tiles');
    // Background layer
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    // Platforms layer
    const platforms = map.createDynamicLayer('Platforms', tileset);
    // Objects layer: (Goal, bad stuff etc.)
    const objects = map.createDynamicLayer('Objects', tileset);
    // Loop through platforms to get the jumpy ones and add them to the physics group (so we know the player is overlapping)...
    platforms.forEachTile(tile => {
      if (!tile.properties.jump) {
        return;
      }
      const jump = this.jumpGroup.create(
        tile.getCenterX(),
        tile.getCenterY(),
        'jump',
      );
      jump.rotation = tile.rotation;
      jump.rotation = tile.rotation;
      if (jump.angle === 0) jump.body.setSize(25, 12).setOffset(0, 5);
      else if (jump.angle === -90) jump.body.setSize(6, 32).setOffset(0, 0);
      else if (jump.angle === 90) jump.body.setSize(6, 32).setOffset(0, 0);
      jump.visible = false;
    });
    // Make them collidable
    platforms.setCollisionByProperty({ collider: true });
    // Make objects collidable
    objects.setCollisionByProperty({ collider: true });
    /**
     * This depends a lot on the Scene object that you passed, literally you can do whatever you want with the objects array depending on the function
     * usually you want to add what's gonna happen when the player hits the goal tiles or when he hits bad stuff like barrels.
     * @see Scene1 scene1.js
     * @see Scene0 scene0.js
     */
    this.generateColGoal(objects);

    this.camera = this.cameras.main;
    this.player = new PlayerClass(this, posXPlayer, posYPlayer);
    this.physics.world.addCollider(this.player.sprite, platforms);
    this.physics.world.addCollider(this.player.sprite, objects);
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  },
};

export default sceneUtils;
