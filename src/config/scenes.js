import Player from '../objects/player';

/* eslint-disable no-plusplus */

let currentScene = 0;

const scenes = ['MainScene', 'SecondScene'];
let loadedMusic = false;

const sceneUtils = {
  restart(scene) {
    scene.music.stop();
    scene.scene.restart();
  },
  changeScene(scene) {
    scene.music.stop();
    if (currentScene + 1 >= scenes.length) return;
    currentScene++;
    scene.scene.start(scenes[currentScene]);
  },

  sceneUpdate() {
    this.camera.startFollow(this.player.sprite);
    const canMove = this.cutscene ? this.cutscene() : true;
    this.player.update(canMove);

    if (this.player.sprite.y > 800) {
      this.player.destroy();
      this.scene.restart();
      this.music.stop();
    }
  },

  loadScene() {},

  configScene(keyTileset, posXPlayer, posYPlayer) {
    if (!loadedMusic)
      this.music = this.sound.add('music', {
        loop: true,
        volume: 0.3,
        delay: 1,
      });
    else this.music.resume();
    loadedMusic = false;
    this.music.play();
    const map = this.make.tilemap({ key: keyTileset });
    const tileset = map.addTilesetImage('plstileset', 'tiles');
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    const platforms = map.createDynamicLayer('Platforms', tileset);
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
    });
    platforms.setCollisionByProperty({ collider: true });
    objects.setCollisionByProperty({ collider: true });
    this.generateColGoal(objects);

    this.camera = this.cameras.main;
    this.player = new Player(this, posXPlayer, posYPlayer);
    this.physics.world.addCollider(this.player.sprite, platforms);
    this.physics.world.addCollider(this.player.sprite, objects);
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  },
};

export default sceneUtils;
