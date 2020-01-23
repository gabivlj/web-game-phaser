import cutscene03 from '../cutscenes/cutscene03';
import Scene from './scene';

class Scene4 extends Scene {
  constructor() {
    super(
      {
        key: 'FifthScene',
        tilemapKey: 'pls05',
        startingPointPlayer: [170, 300],
      },
      cutscene03,
    );
  }
}

export default Scene4;
