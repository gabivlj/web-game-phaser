import Phaser from 'phaser';

const sceneConfig = {
  // active: false,
  // visible: false,
  key: 'MainScene',
};

class Scene0 extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    this.controls = null;
  }

  preload() {
    this.load.image('tiles', 'http://localhost:5500/assets/Tileset.png');
    this.load.tilemapTiledJSON('pls', 'http://localhost:5500/pls.json');
    // this.load.tilemapCSV(
    //   'http://localhost:5500/1_Background.csv',
    //   'http://localhost:5500/1_Background.csv',
    // );
  }

  create() {
    const map = this.make.tilemap({ key: 'pls' });
    const tileset = map.addTilesetImage('plstileset', 'tiles');
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    const platforms = map.createStaticLayer('Platforms', tileset, 0, 0);
    const objects = map.createStaticLayer('Objects', tileset, 0, 0);

    const camera = this.cameras.main;
    // camera.setViewport(100, 100, 100, 100);

    const cursors = this.input.keyboard.createCursorKeys();
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    });
    platforms.setCollisionByProperty({ collider: true });
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    platforms.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time, delta) {
    this.controls.update(delta);
  }
}

export default Scene0;
