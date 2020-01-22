import cutscene03 from '../cutscenes/cutscene03';
import Scene from './scene';

const path = `http://localhost:5500`;

class Scene4 extends Scene {
  constructor() {
    super(
      {
        key: 'FourthScene',
        tilemapKey: 'pls04.',
        tilesetKey: 'plstilemap02',
      },
      cutscene03,
    );
  }
}

export default Scene4;
