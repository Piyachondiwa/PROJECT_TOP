// Central input map. Runtime systems can consume actions without hardcoding keys everywhere.
const INPUT_MAP = Object.freeze({
  up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'],
  attack: ['KeyJ', 'KeyZ'], dodge: ['Space'], skill: ['KeyK', 'KeyX'],
  interact: ['KeyE'], inventory: ['KeyI'], eat: ['KeyQ'], rest: ['KeyR'],
});
function inputActionDown(action, keys = window.gameKeys) {
  const bindings = INPUT_MAP[action] || [];
  return bindings.some((code) => keys?.has(code));
}
