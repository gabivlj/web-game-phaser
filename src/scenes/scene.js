import Phaser from 'phaser';
import Player from '../objects/player';
import sceneUtils from './scenes';
import timestamper from '../objects/timestamper';
import FallingPlatform from '../objects/fallingPlatform';
import MovingPlatform from '../objects/movingPlatform';

const path = `http://localhost:5500`;

let loadedMusic = false;

export default class Scene extends Phaser.Scene {
  constructor(sceneConfig, cutscene, onChangeToNext = () => {}) {
    super(sceneConfig);
    this.tilesetKey = sceneConfig.tilesetKey || 'plstileset';
    this.startingPointPlayer = sceneConfig.startingPointPlayer || [70, 700];
    this.tilemapKey = sceneConfig.tilemapKey;
    this.controls = null;
    this.PlayerGroup = null;
    this.player = null;
    this.dialog = null;
    this.movingPlatformGroup = null;
    this.cutsceneFn = cutscene;
    this.OK = false;
    this.onChangeToNext = onChangeToNext;
    this.fallingPlatformGroup = null;
    this.specialPlatforms = [];
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
  generateSpecialPlatforms(layer) {
    this.movingPlatformGroup = this.physics.add.group();
    this.fallingPlatformGroup = this.physics.add.group();
    if (!layer) return;
    // por cada objeto haz new MovingPlatform(x, y, tuputamadre, sprite)
    const { objects } = layer;
    objects.forEach(tile => {
      if (!tile || !tile.properties) return;
      /**
       * TODO: DANI DO THIS
       */
      console.log(tile.properties[0].name)
      if (tile.properties[0].name === 'range') {
        // this.movingPlatformGroup.create(tile.x, tile.y, 'moving_platform');
        console.log("xd")
        const movingPlatform = new MovingPlatform(
          this,
          tile.x,
          tile.y,
          tile.properties[0].value,
          'moving_platform'
        );
        this.specialPlatforms.push(movingPlatform);
      }
      if (tile.properties[0].name !== 'falling') return;

      const _ = new FallingPlatform(this, tile.x, tile.y, 'falling_platform');
      this.fallingPlatformGroup.name = 'falling_platform';
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
    this.configScene(
      this.tilemapKey,
      this.startingPointPlayer[0],
      this.startingPointPlayer[1],
      Player,
      this.tilesetKey,
      {
        tilesetKey: this.tilesetKey,
        volume: 0,
      },
    );
    this.cutscene = this.cutsceneFn(this);
  }

  update(time, delta) {
    if (!this.OK) return;
    this.sceneUpdate();
    this.specialPlatforms.forEach((e) => {
      e.update();
    })
  }

  /**
   * Shortcut for a scene update
   * @this {Phaser.Scene} modified scene with this.player, and everything that an update needs.
   */
  sceneUpdate() {
    this.camera.startFollow(this.player.sprite);
    const canMove = this.cutscene ? this.cutscene() : true;
    if (!this.player.sprite.body) return;
    this.player.update(canMove);

    if (this.player.sprite.y > this.heightOfMap - this.player.sprite.height) {
      this.player.destroy();
      this.scene.restart();
      this.music.stop();
      // this.player.setDead(true);
    }
  }

  /**
   * General create() configuration for a normal scene.
   * @param {string} keyTileset
   * @param {number} posXPlayer
   * @param {number} posYPlayer
   */
  configScene(
    keyTileset,
    posXPlayer,
    posYPlayer,
    PlayerClass,
    tilesetKey = 'plstileset',
    configuration = { volume: 0, tilemapKey: 'plstileset' },
  ) {
    const { volume } = configuration;
    // Check if we already loaded music
    if (!loadedMusic)
      this.music = this.sound.add('music', {
        loop: true,
        volume,
        delay: 1,
      });
    // else just resume it
    else this.music.resume();
    // Set it on false so we know later to reset it
    loadedMusic = false;
    this.music.play();
    // Make tilemap with the provided tileset key (For different maps u know)
    const map = this.make.tilemap({ key: keyTileset });
    // The height of the map for checking later if the player f***ed up and fell down.
    this.heightOfMap = map.heightInPixels;
    // Set world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, this.heightOfMap);
    //  Add tileset image to the map, so we can use it. Usually the name of the tileset that we made in Tiled
    //  is gonna be plstileset, if not just pass in the future to this function the name that you want,
    //  and tiles is the key for the image that we loaded before
    // TODO: call this pls pls
    const tileset = map.addTilesetImage(tilesetKey, 'tiles');
    // Background layer
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    // Platforms layer
    const platforms = map.createDynamicLayer('Platforms', tileset);
    // Objects layer: (Goal, bad stuff etc.)
    const objects = map.createDynamicLayer('Objects', tileset);
    // Special Platform layer
    const specialPlatforms = map.getObjectLayer('SpecialPlatforms');
    // Loop through platforms to get the jumpy ones and add them to the physics group (so we know the player is overlapping)...
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
      if (jump.angle === 0) jump.body.setSize(25, 12).setOffset(0, 5);
      else if (jump.angle === -90) jump.body.setSize(6, 32).setOffset(0, 0);
      else if (jump.angle === 90) jump.body.setSize(6, 32).setOffset(0, 0);
      jump.visible = false;
    });

    // Loop through special platforms to get to move the ones that move
    this.generateSpecialPlatforms(specialPlatforms);
    // Make them collidable
    platforms.setCollisionByProperty({ collider: true });
    // Make objects collidable
    objects.setCollisionByProperty({ collider: true });
    /**
     * This depends a lot on the Scene object that you passed, literally you can do whatever you want with the objects array depending on the function
     * usually you want to add what's gonna happen when the player hits the goal tiles or when he hits bad stuff like barrels.
     * @see Scene scene.js
     */
    this.generateColGoal(objects);

    this.camera = this.cameras.main;
    this.player = new PlayerClass(this, posXPlayer, posYPlayer);
    this.physics.world.addCollider(this.player.sprite, platforms);
    this.physics.world.addCollider(this.player.sprite, objects);
    this.physics.world.addCollider(
      this.player.sprite,
      this.movingPlatformGroup,
      (player, platform) => {
        console.log(platform);
        this.player.bounce = true;
        platform.body.setImmovable(true);
        setTimeout(() => {
          this.player.bounce = false;
          platform.body.setImmovable(false);
        }, 100);
      },
      (player, platform) => {
        console.log(platform);
        this.player.bounce = true;
        platform.body.setImmovable(true);
        setTimeout(() => {
          this.player.bounce = false;
          platform.body.setImmovable(false);
        }, 100);
      }
    );
    this.physics.world.addCollider(
      this.player.sprite,
      this.fallingPlatformGroup,
      () => {
        this.player.onGround = true;
      },
      () => {},
    );
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    timestamper.start(this);
  }
}

// export default Scene1;
