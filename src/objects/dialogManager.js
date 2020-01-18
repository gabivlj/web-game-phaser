export default class DialogManager {
  constructor(scene, dialogs = []) {
    this.scene = scene;
    this.dialogs = [...dialogs];
    this.current = -1;
    this.max = this.dialogs.length;
    this.finished = false;
    this.text = this.scene.add
      .text(16, 16, 'aa', {
        font: '18px monospace',
        fill: '#000000',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0);
    this.text.setText('');
    this.currentInterval = null;
  }

  process() {
    const currentDialog = this.dialogs[this.current];
    let currentStr = '';

    let i = 0;
    this.currentInterval = setInterval(() => {
      if (!currentDialog) return clearInterval(this.currentInterval);
      this.text.setText(currentStr);
      if (currentStr.length !== currentDialog.length) {
        currentStr += currentDialog[i];
        i++;
      } else clearInterval(this.currentInterval);
    }, 100);
  }

  nextDialog() {
    if (this.current >= this.max) {
      this.finished = true;
      return this.text.destroy();
    }
    if (this.currentInterval) clearInterval(this.currentInterval);
    this.current++;
    this.process();
    if (this.current >= this.max) {
      this.finished = true;
      return this.text.destroy();
    }
    return null;
  }
}
