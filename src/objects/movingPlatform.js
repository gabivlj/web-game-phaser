import Phaser from 'phaser';
import sceneUtils from '../scenes/scenes'

export default class MovingPlatform {
    constructor() {
        this.body.setAllowGravity(false);
    }
}