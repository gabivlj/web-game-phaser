let before = {
  instancetext: null,
};

export default class DialogManager {
  constructor(scene, dialogs = []) {
    this.scene = scene;
    this.dialogs = [...dialogs];
    this.current = -1;
    this.max = this.dialogs.length;
    this.finished = false;
    if (before.instancetext) {
      before.instancetext.destroy();
      before.instancetext = null;
      clearInterval(this.currentInterval);
    }
    this.text = this.scene.add
      .text(16, 16, 'aa', {
        font: '18px monospace',
        fill: '#000000',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0);
    before.instancetext = this.text;
    this.text.setText('');
    this.currentInterval = null;
  }

  static setText(t, s) {
    try {
      t.setText(s);
    } catch (_) {
      // Ok so Phaser3 has a strange bug with updating text on setIntervals that I literally wanna ignore.
    }
  }

  process() {
    const currentDialog = this.dialogs[this.current];
    let currentStr = '';

    let i = 0;
    this.currentInterval = setInterval(() => {
      if (!currentDialog) return clearInterval(this.currentInterval);
      if (!this.text) clearInterval(this.currentInterval);
      DialogManager.setText(this.text, currentStr);
      if (currentStr.length !== currentDialog.length) {
        currentStr += currentDialog[i];
        i++;
      } else clearInterval(this.currentInterval);
    }, 100);
  }

  nextDialog() {
    if (this.current >= this.max) {
      this.finished = true;
      before.instancetext = null;
      clearInterval(this.currentInterval);
      return this.text.destroy();
    }
    if (this.currentInterval) clearInterval(this.currentInterval);
    this.current++;
    this.process();
    if (this.current >= this.max) {
      this.finished = true;
      before.instancetext = null;
      clearInterval(this.currentInterval);
      return this.text.destroy();
    }
    return null;
  }
}
