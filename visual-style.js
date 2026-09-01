// Visual direction: dark, readable pixel-RPG presentation.
// Centralizes shared visual tokens so future art/UI can keep one style.
const VISUAL_STYLE = Object.freeze({
  palette: {
    night: '#10141d',
    panel: '#171c26',
    panelAlt: '#202735',
    ink: '#e7dfc8',
    muted: '#9aa18f',
    accent: '#b4a16e',
    danger: '#9a5b5b',
    nature: '#556c4d',
    shadow: '#4b435f',
    ember: '#9a6048',
    ice: '#667f89',
  },
  pixelScale: 3,
  tileSize: 32,
  uiRadius: 2,
});

function getVisualColor(name, fallback = '#ddd6bf') {
  return VISUAL_STYLE.palette[name] || fallback;
}

function drawPixelPanel(ctx, x, y, width, height) {
  ctx.fillStyle = VISUAL_STYLE.palette.panel;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = VISUAL_STYLE.palette.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
}
