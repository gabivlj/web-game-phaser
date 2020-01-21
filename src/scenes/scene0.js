import Phaser, { Scenes } from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene01 from '../cutscenes/cutscene01';
import sceneUtils from '../config/scenes';
import playerConfig from '../config/playerConfig';
import { setPowerUps } from '../storage/scene';

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
    this.OK = false;
  }

  preload() {
    this.OK = sceneUtils.preloadScene(this, { path, tilemapKey: 'pls' });
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
        setPowerUps({ ...playerConfig, canJumpFromWalls: true });
        sceneUtils.changeScene(this);
      },
      this,
    );
  }

  create() {
    if (!this.OK) return;
    sceneUtils.configScene.bind(this)('pls', 100, 30, Player);
    // this.camera.setViewport(0, 0, 300, 300);
    this.cutscene = cutscene01(this);
    this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
  }

  update(time, delta) {
    if (!this.OK) return;
    this.sceneUpdate();
  }
}

export default Scene0;
