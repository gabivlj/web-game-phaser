import Phaser from 'phaser';
import Player from '../objects/player';
import sceneUtils from './scenes';

const path = `http://localhost:5500`;

export default class Scene extends Phaser.Scene {
  constructor(sceneConfig, cutscene, onChangeToNext = () => {}) {
    super(sceneConfig);
    this.tilesetKey = sceneConfig.tilesetKey || 'plstileset';
    console.log(this.tilesetKey)
    this.startingPointPlayer = sceneConfig.startingPointPlayer || [70, 700];
    this.tilemapKey = sceneConfig.tilemapKey;
    this.controls = null;
    this.PlayerGroup = null;
    this.player = null;
    this.dialog = null;
    this.movingPlatformGroup = null;
    this.sceneUpdate = null;
    this.cutsceneFn = cutscene;
    this.OK = false;
    this.onChangeToNext = onChangeToNext;
  }

  preload() {
    this.OK = sceneUtils.preloadScene(this, {
      path,
      tilemapKey: this.tilemapKey,
      tilesetKey: this.tilesetKey,
    });
  }

  /**
   * 
   * @param {Phaser.Tilemaps.ObjectLayer} layer 
   */
  generateMovingPlatforms(layer) {
    console.log(this.physics.add);
    this.movingPlatformGroup = this.physics.add.group();
    if (!layer) return;
    // por cada objeto haz new MovingPlatform(x, y, tuputamadre, sprite)
    const { objects } = layer;
    objects.forEach(tile => {
      this.movingPlatformGroup.create(tile.x, tile.y, "moving_platform");
      //this.body.setAllowGravity(false)
      console.log(layer)
    });
    // layer.forEachTile(tile => {
    //   const { range } = tile.properties
      
    //   // TODO: Dani
    // });
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
      this.tilesetKey,
      {
        tilesetKey: this.tilesetKey,
        volume: 0,
      }
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
