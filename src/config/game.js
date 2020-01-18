import Phaser from 'phaser';
import Scene0 from '../scenes/scene0';

const gameConfig = {
  title: 'Cool game',
  type: Phaser.AUTO,
  scale: {
    width: 500,
    height: 500,
  },
  pixelArt: true,
  scene: [Scene0],
};

export default gameConfig;
