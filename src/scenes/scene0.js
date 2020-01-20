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
    // Space enemy!!
    this.load.spritesheet('space', `${path}/assets/space.png`, {
      frameWidth: 22,
      frameHeight: 32,
      spacing: 10,
    });
    this.load.audio('music', `${path}/assets/music.mp3`);
    this.load.image('tiles', `${path}/assets/Tileset.png`);
    this.load.audio('jump_sound', `${path}/assets/jump01.mp3`);
    // The tutorial that we followed sprite.
    this.load.spritesheet('player2', `${path}/assets/tutorial/player.png`, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    // Player sprite
    this.load.spritesheet('player', `${path}/assets/player.png`, {
      frameWidth: 30,
      frameHeight: 30,
      margin: 1,
      spacing: 2,
    });
    // Map tile
    this.load.tilemapTiledJSON(`pls`, `${path}/pls.json`);
    // Jumping tiles
    this.jumpGroup = this.physics.add.staticGroup();
    // TODO Not important maybe delete
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
