import Phaser, { Scenes } from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene01 from '../cutscenes/cutscene01';
import sceneUtils from '../config/scenes';
import playerConfig from '../config/playerConfig';

const sceneConfig = {
  // active: false,
  // visible: false,
  key: 'MainScene',
};

const path = `http://localhost:5500`;

class Scene0 extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    this.controls = null;
    this.PlayerGroup = null;
    this.player = null;
    this.dialog = null;
    this.cutscene = null;
    this.sceneUpdate = null;
  }

  preload() {
    this.load.audio('music', `${path}/assets/music.mp3`);
    this.load.image('tiles', `${path}/assets/Tileset.png`);
    this.load.audio('jump_sound', `${path}/assets/jumpSound.mp3`);
    this.load.spritesheet('player', `${path}/assets/tutorial/player.png`, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    this.load.tilemapTiledJSON(`pls`, `${path}/pls.json`);
    this.jumpGroup = this.physics.add.staticGroup();
    this.jumps = [];
  }

  /**
   * @param {Phaser.Tilemaps.DynamicTilemapLayer} objects
   */
  generateColGoal(objects) {
    const goal = [];
    objects.forEachTile(tile => {
      if (tile.index < 0 || !tile.properties.win) return;
      goal.push(tile.index);
    });
    objects.setTileIndexCallback(
      goal,
      () => {
        playerConfig.canJumpFromWalls = true;
        sceneUtils.changeScene(this);
      },
      this,
    );
  }

  create() {
    this.PlayerGroup = this.physics.add.group({ collideWorldBounds: true });
    sceneUtils.configScene.bind(this)('pls', 100, 30);
    // this.camera.setViewport(0, 0, 300, 300);
    this.cutscene = cutscene01(this);
    this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
  }

  update(time, delta) {
    this.sceneUpdate();
  }
}

export default Scene0;
