import Phaser from 'phaser';
import Player from '../objects/player';
import DialogManager from '../objects/dialogManager';
import cutscene01 from '../cutscenes/cutscene01';

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
  }

  preload() {
    this.load.image('tiles', `${path}/assets/Tileset.png`);
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

  create() {
    this.PlayerGroup = this.physics.add.group({ collideWorldBounds: true });

    const map = this.make.tilemap({ key: 'pls' });
    const tileset = map.addTilesetImage('plstileset', 'tiles');
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    const platforms = map.createDynamicLayer('Platforms', tileset, 0, 0);
    const objects = map.createDynamicLayer('Objects', tileset);
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
      // platforms.removeTileAt(tile.x, tile.y);
    });
    platforms.setCollisionByProperty({ collider: true });

    this.camera = this.cameras.main;
    this.player = new Player(this, 100, 30);
    this.physics.world.addCollider(this.player.sprite, platforms);
    // const cursors = this.input.keyboard.createCursorKeys();
    // // ODIO PHASER ODIO TODO
    // this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
    //   camera,
    //   left: cursors.left,
    //   right: cursors.right,
    //   up: cursors.up,
    //   down: cursors.down,
    //   speed: 0.5,
    // });
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.camera.setViewport(0, 0, 300, 300);
    this.cutscene = cutscene01(this);
  }

  update(time, delta) {
    this.camera.startFollow(this.player.sprite);
    const canMove = this.cutscene();
    this.player.update(canMove);

    if (this.player.sprite.y > 400) {
      this.player.destroy();
      this.scene.restart();
    }
  }
}

export default Scene0;
