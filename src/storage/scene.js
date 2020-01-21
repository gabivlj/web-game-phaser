export function setCurrentScene(key) {
  localStorage.setItem('currentScene', key);
}

export function getCurrentScene() {
  const currentScene = localStorage.getItem('currentScene');
  if (
    currentScene === 'undefined' ||
    currentScene === 'null' ||
    !currentScene
  ) {
    setCurrentScene('MainScene');
    return 'MainScene';
  }
  return currentScene;
}

export function getPowerUps() {
  const powerups = localStorage.getItem('powerups');
  if (powerups === 'undefined' || powerups === 'null' || !powerups) {
    localStorage.setItem(
      'powerups',
      JSON.stringify({
        canDash: true,
        canDoubleJump: true,
        canJumpFromWalls: false,
        canBuildPlatforms: false,
      }),
    );
    return {
      canDash: true,
      canDoubleJump: true,
      canJumpFromWalls: false,
      canBuildPlatforms: false,
    };
  }

  return JSON.parse(powerups);
}

export function setPowerUps(powerups) {
  localStorage.setItem('powerups', JSON.stringify(powerups));
}
