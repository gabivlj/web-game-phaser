import Player from '../objects/player';
import sceneUtils from '../config/scenes';

const path = `http://localhost:5500`;

export default class Scene extends Phaser.Scene {
  constructor(sceneConfig, cutscene, onChangeToNext = () => {}) {
    super(sceneConfig);
    this.startingPointPlayer = sceneConfig.startingPointPlayer || [70, 700];
    this.tilemapKey = sceneConfig.tilemapKey;
    this.controls = null;
    this.PlayerGroup = null;
    this.player = null;
    this.dialog = null;
    this.sceneUpdate = null;
    this.cutsceneFn = cutscene;
    this.OK = false;
    this.onChangeToNext = onChangeToNext;
  }

  preload() {
    this.OK = sceneUtils.preloadScene(this, {
      path,
      tilemapKey: this.tilemapKey,
    });
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
        this.onChangeToNext();
        sceneUtils.changeScene(this, true);
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
    sceneUtils.configScene.bind(this)(
      this.tilemapKey,
      this.startingPointPlayer[0],
      this.startingPointPlayer[1],
      Player,
    );
    // this.camera.setViewport(0, 0, 300, 300);
    // this.cutscene = cutscene02(this);
    this.cutscene = this.cutsceneFn(this);
    this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
  }

  update(time, delta) {
    if (!this.OK) return;
    this.sceneUpdate();
  }
}

// export default Scene1;
