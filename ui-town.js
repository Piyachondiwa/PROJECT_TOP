const townUiState = window.townUiState || { open: false, npcId: null };
window.townUiState = townUiState;

function getDistance(aX, aY, bX, bY) {
  return Math.hypot(aX - bX, aY - bY);
}

function getNearbyNpc(maxDistance = 70) {
  const town = getTownData();
  if (!town || !isPointInRect(player.x, player.y, town.bounds, 20)) return null;
  let nearest = null;
  let best = maxDistance;
  for (const npc of getNpcsForTown()) {
    const distance = getDistance(player.x, player.y, npc.x, npc.y);
    if (distance <= best) {
      nearest = npc;
      best = distance;
    }
  }
  return nearest;
}

function interactWithNpc() {
  const npc = getNearbyNpc();
  if (!npc) return false;
  townUiState.open = true;
  townUiState.npcId = npc.id;
  showMessage(`${npc.name}: ${npc.dialogue[0]}`);
  return true;
}

function closeTownInteraction() {
  townUiState.open = false;
  townUiState.npcId = null;
}

function drawTownNpcs() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const npc of getNpcsForTown()) {
    ctx.fillStyle = '#17191a';
    ctx.fillRect(npc.x - 8, npc.y + 14, 16, 12);
    ctx.fillStyle = npc.color;
    ctx.fillRect(npc.x - 10, npc.y - 12, 20, 22);
    ctx.fillStyle = '#c59876';
    ctx.fillRect(npc.x - 7, npc.y - 25, 14, 13);
    ctx.fillStyle = '#ddd6bf';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, npc.x, npc.y - 32);
  }
  ctx.restore();
}

function drawTownPrompt() {
  const npc = getNearbyNpc();
  if (!npc) return;
  ctx.save();
  ctx.fillStyle = '#eee4c9';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`E: Talk to ${npc.name}`, npc.x - camera.x, npc.y - camera.y - 42);
  ctx.restore();
}
