export function getScoreScene(key) {
  const scores = localStorage.getItem(key);

  if (scores === 'undefined' || scores === 'null' || !scores) {
    return 0;
  }

  return parseInt(scores, 10);
}

/**
 * The less the better
 */
export function updateScoreScene(key, newScore) {
  const score = getScoreScene(key);
  if (score === 0 || newScore < score) {
    localStorage.setItem(key, newScore);
  }
}
