// Small presentation effects for the pixel RPG.
let screenShake = 0;
let hitStop = 0;

function triggerScreenShake(amount = 3, duration = 0.12) {
  screenShake = Math.max(screenShake, duration);
  window.screenShakeAmount = Math.max(window.screenShakeAmount || 0, amount);
}

function triggerHitStop(duration = 0.05) {
  hitStop = Math.max(hitStop, duration);
}

function updateCameraEffects(dt) {
  screenShake = Math.max(0, screenShake - dt);
  hitStop = Math.max(0, hitStop - dt);
  if (screenShake <= 0) window.screenShakeAmount = 0;
}

function getCameraOffset() {
  const amount = window.screenShakeAmount || 0;
  if (!amount || screenShake <= 0) return { x: 0, y: 0 };
  return {
    x: (Math.random() - 0.5) * amount,
    y: (Math.random() - 0.5) * amount,
  };
}
