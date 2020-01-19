import Phaser, { Scenes } from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene02 from '../cutscenes/cutscene02';
import sceneUtils from '../config/scenes';

const sceneConfig = {
  // active: false,
  // visible: false,
  key: 'SecondScene',
};

const path = `http://localhost:5500`;

class Scene1 extends Phaser.Scene {
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
    this.load.audio('jump_sound', `${path}/assets/jumpSound.mp3`);
    this.load.image('tiles', `${path}/assets/Tileset.png`);
    this.load.spritesheet('player', `${path}/assets/tutorial/player.png`, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    this.load.tilemapTiledJSON(`pls02`, `${path}/pls02.json`);
    this.jumpGroup = this.physics.add.staticGroup();
    this.jumps = [];
  }

  /**
   * @param {Phaser.Tilemaps.DynamicTilemapLayer} objects
   */
  generateColGoal(objects) {
    const goal = [];
    const badBarrels = [];

    objects.forEachTile(tile => {
      if (tile.index < 0 || (!tile.properties.win && !tile.properties.death))
        return;
      if (tile.properties.death) {
        badBarrels.push(tile.index);

        return;
      }
      goal.push(tile.index);
    });
    objects.setTileIndexCallback(
      goal,
      () => {
        sceneUtils.changeScene(this);
      },
      this,
    );
    objects.setTileIndexCallback(
      badBarrels,
      () => {
        sceneUtils.restart(this);
      },
      this,
    );
  }

  create() {
    this.PlayerGroup = this.physics.add.group({ collideWorldBounds: true });
    sceneUtils.configScene.bind(this)('pls02', 40, 700);
    // this.camera.setViewport(0, 0, 300, 300);
    this.cutscene = cutscene02(this);
    this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
  }

  update(time, delta) {
    this.sceneUpdate();
  }
}

export default Scene1;
