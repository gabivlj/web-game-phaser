import Phaser, { Scenes } from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene03 from '../cutscenes/cutscene03';
import sceneUtils from '../config/scenes';

const sceneConfig = {
  // active: false,
  // visible: false,
  key: 'ThirdScene',
};

const path = `http://localhost:5500`;

class Scene2 extends Phaser.Scene {
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
    this.OK = sceneUtils.preloadScene(this, { path, tilemapKey: 'pls03' });
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
    if (!this.OK) return;
    this.PlayerGroup = this.physics.add.group({ collideWorldBounds: true });
    sceneUtils.configScene.bind(this)('pls03', 40, 700, Player);
    // this.camera.setViewport(0, 0, 300, 300);
    this.cutscene = cutscene03(this);
    this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
  }

  update(time, delta) {
    if (!this.OK) return;
    this.sceneUpdate();
  }
}

export default Scene2;
