// Asset pipeline foundation for Monster Garden.
// Keeps sprite-sheet definitions data-driven so real pixel art can be dropped in later.
const ASSET_MANIFEST = Object.freeze({
  player: {
    idle: { src: 'assets/player/idle.png', frames: 6, fps: 8 },
    walk: { src: 'assets/player/walk.png', frames: 6, fps: 10 },
    run: { src: 'assets/player/run.png', frames: 6, fps: 14 },
    jump: { src: 'assets/player/jump.png', frames: 6, fps: 10 },
    attack: { src: 'assets/player/attack.png', frames: 6, fps: 12 },
    hurt: { src: 'assets/player/hurt.png', frames: 3, fps: 10 },
  },
});

function getAssetAnimation(entityId, animationId) {
  return ASSET_MANIFEST[entityId]?.[animationId] || null;
}

window.MonsterGarden = window.MonsterGarden || {};
window.MonsterGarden.assets = ASSET_MANIFEST;
window.MonsterGarden.getAssetAnimation = getAssetAnimation;
