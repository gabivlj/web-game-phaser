import Phaser, { Scenes } from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene02 from '../cutscenes/cutscene02';
import sceneUtils from './scenes';
import Scene from './scene';

const sceneConfig = {
  // active: false,
  // visible: false,
  key: 'SecondScene',
};

const path = `http://localhost:5500`;

// class Scene1 extends Phaser.Scene {
//   constructor() {
//     super(sceneConfig);
//     this.controls = null;
//     this.PlayerGroup = null;
//     this.player = null;
//     this.dialog = null;
//     this.cutscene = null;
//     this.sceneUpdate = null;
//     this.OK = false;
//   }

//   preload() {
//     this.OK = sceneUtils.preloadScene(this, { path, tilemapKey: 'pls02' });
//   }

//   /**
//    * @param {Phaser.Tilemaps.DynamicTilemapLayer} objects
//    */
//   generateColGoal(objects) {
//     const goal = [];
//     const badBarrels = [];

//     objects.forEachTile(tile => {
//       if (tile.index < 0 || (!tile.properties.win && !tile.properties.death))
//         return;
//       if (tile.properties.death) {
//         badBarrels.push(tile.index);

//         return;
//       }
//       goal.push(tile.index);
//     });
//     objects.setTileIndexCallback(
//       goal,
//       () => {
//         sceneUtils.changeScene(this, true);
//       },
//       this,
//     );
//     objects.setTileIndexCallback(
//       badBarrels,
//       () => {
//         sceneUtils.restart(this);
//       },
//       this,
//     );
//   }

//   create() {
//     sceneUtils.configScene.bind(this)('pls02', 40, 700, Player);
//     // this.camera.setViewport(0, 0, 300, 300);
//     this.cutscene = cutscene02(this);
//     this.sceneUpdate = sceneUtils.sceneUpdate.bind(this);
//   }

//   update(time, delta) {
//     if (!this.OK) return;
//     this.sceneUpdate();
//   }
// }

class Scene1 extends Scene {
  constructor() {
    super({ key: 'SecondScene', tilemapKey: 'pls02' }, cutscene02);
  }
}

export default Scene1;
