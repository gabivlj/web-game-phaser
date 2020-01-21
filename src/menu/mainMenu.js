import Phaser from 'phaser';
import Assets from './Assets'
import Scene from '../scenes/scene'
import sceneUtils from '../config/scenes';

const sceneConfig = {
    // active: false,
    // visible: false,
    key: 'MainMenuScene',
  };

  const path = `http://localhost:5500`;

  class MainMenuScene extends Phaser.Scene {
    constructor() {
      super({
        key: "MainMenuScene"
      })
    }

    init() {
    }

    create() {
      // Create images
      this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, )
    }
  }