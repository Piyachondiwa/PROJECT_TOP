// Minimal visual fallback for the prototype. Keeps the canvas visibly populated
// even when optional world drawing modules/assets are not available yet.
(() => {
  window.MonsterGarden = window.MonsterGarden || {};
  window.MonsterGarden.renderFallback = function (ctx, canvas) {
    if (!ctx || !canvas) return;
    ctx.save();
    ctx.fillStyle = '#22312c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#30453a';
    for (let y = 0; y < canvas.height; y += 48) {
      for (let x = 0; x < canvas.width; x += 48) {
        if (((x / 48) + (y / 48)) % 3 === 0) ctx.fillRect(x + 2, y + 2, 44, 44);
      }
    }
    ctx.fillStyle = '#c7b88f';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MONSTER GARDEN', canvas.width / 2, canvas.height / 2 - 12);
    ctx.font = '12px monospace';
    ctx.fillText('Loading world...', canvas.width / 2, canvas.height / 2 + 12);
    ctx.restore();
  };
})();
