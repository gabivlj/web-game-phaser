import cutscene03 from '../cutscenes/cutscene03';
import Scene from './scene';

const path = `http://localhost:5500`;

class Scene2 extends Scene {
  constructor() {
    super(
      {
        key: 'ThirdScene',
        tilemapKey: 'pls03',
      },
      cutscene03,
    );
  }
}

export default Scene2;
