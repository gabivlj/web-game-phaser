import { updateScoreScene, getScoreScene } from '../storage/scores';

let interval = 0;
let text = null;
let newDate = null;

export default {
  start(scene) {
    const record = getScoreScene(scene.scene.key);
    if (text) {
      text.destroy();
      text = null;
      clearInterval(interval);
    }
    text = scene.add
      .text(350, 450, 'aa', {
        font: '18px monospace',
        fill: 'yellow',
      })
      .setScrollFactor(0);
    const date = new Date();
    const dateBefore = new Date(record);
    interval = setInterval(() => {
      newDate = new Date(new Date() - date);
      text.setText(
        `${newDate.getMinutes()}:${newDate.getSeconds()}:${newDate.getMilliseconds()}\n${dateBefore.getMinutes()}:${dateBefore.getSeconds()}:${dateBefore.getMilliseconds()}`,
      );
    });
  },

  finish(scenekey, success = false) {
    if (text) text.destroy();
    text = null;
    clearInterval(interval);
    if (success) updateScoreScene(scenekey, newDate.getTime());
  },
};
