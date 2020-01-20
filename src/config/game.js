import Phaser from 'phaser';
import Scene0 from '../scenes/scene0';
import Scene1 from '../scenes/scene1';
import Scene2 from '../scenes/scene2';

const gameConfig = {
  title: 'Cool game',
  type: Phaser.AUTO,
  scale: {
    width: 500,
    height: 500,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 600 },
    },
  },
  pixelArt: true,
  scene: [Scene0, Scene2, Scene1],
};

export default gameConfig;
