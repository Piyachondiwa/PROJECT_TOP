const TOWN_DATA = Object.freeze({
  dawnreach: {
    id: 'dawnreach', kingdomId: 'eldoria', name: 'Dawnreach', x: 420, y: 250, w: 520, h: 360,
    description: 'The first safe settlement on the edge of the wilds.',
    npcs: ['mira', 'nera', 'elian']
  }
});

const NPC_DATA = Object.freeze({
  mira: {
    id: 'mira', name: 'Mira', role: 'Seed Merchant', townId: 'dawnreach',
    dialogue: [
      'The wilds give strange seeds to those brave enough to hunt.',
      'Bring me gold and I can sell you seeds that do not grow in the fields.'
    ]
  },
  nera: {
    id: 'nera', name: 'Nera', role: 'Quest Keeper', townId: 'dawnreach',
    dialogue: [
      'Monsters are spreading farther from the forest every night.',
      'Complete the requests on the board and the town will remember your name.'
    ]
  },
  elian: {
    id: 'elian', name: 'Elian', role: 'Adventurer', townId: 'dawnreach',
    dialogue: [
      'The road north leads to the Whispering Forest.',
      'Do not trust a harmless-looking plant. Around here, even roots can bite.'
    ]
  }
});

const NPC_POSITIONS = Object.freeze([
  { npcId: 'mira', x: 510, y: 350 },
  { npcId: 'nera', x: 700, y: 350 },
  { npcId: 'elian', x: 840, y: 410 }
]);

const NPC_INTERACT_RANGE = 54;

function getNearbyNpc() {
  let best = null;
  let bestDistance = Infinity;
  for (const point of NPC_POSITIONS) {
    const npc = NPC_DATA[point.npcId];
    if (!npc) continue;
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance <= NPC_INTERACT_RANGE && distance < bestDistance) {
      best = { ...npc, x: point.x, y: point.y };
      bestDistance = distance;
    }
  }
  return best;
}

function interactWithNpc() {
  const npc = getNearbyNpc();
  if (!npc) return false;
  openDialogue(npc);
  return true;
}

function drawNpcs(ctxRef, cameraRef) {
  ctxRef.save();
  for (const point of NPC_POSITIONS) {
    const npc = NPC_DATA[point.npcId];
    if (!npc) continue;
    const sx = Math.round(point.x - cameraRef.x);
    const sy = Math.round(point.y - cameraRef.y);
    ctxRef.fillStyle = '#241e1d';
    ctxRef.fillRect(sx - 8, sy + 8, 16, 20);
    ctxRef.fillStyle = '#c18b68';
    ctxRef.fillRect(sx - 7, sy - 10, 14, 14);
    ctxRef.fillStyle = '#3c2f2b';
    ctxRef.fillRect(sx - 8, sy - 12, 16, 5);
    ctxRef.fillStyle = '#dfd5b8';
    ctxRef.font = '10px monospace';
    ctxRef.textAlign = 'center';
    ctxRef.fillText(npc.name, sx, sy - 18);
  }
  ctxRef.restore();
}

let dialogueState = window.dialogueState || { open: false, npcId: null, index: 0 };
window.dialogueState = dialogueState;

function openDialogue(npc) {
  dialogueState.open = true;
  dialogueState.npcId = npc.id;
  dialogueState.index = 0;
  renderDialogue();
}

function advanceDialogue() {
  const npc = NPC_DATA[dialogueState.npcId];
  if (!dialogueState.open || !npc) return;
  dialogueState.index += 1;
  if (dialogueState.index >= npc.dialogue.length) {
    closeDialogue();
    return;
  }
  renderDialogue();
}

function closeDialogue() {
  dialogueState.open = false;
  dialogueState.npcId = null;
  dialogueState.index = 0;
  renderDialogue();
}

function renderDialogue() {
  const panel = document.getElementById('dialogue');
  if (!panel) return;
  const npc = NPC_DATA[dialogueState.npcId];
  panel.classList.toggle('hidden', !dialogueState.open || !npc);
  if (!dialogueState.open || !npc) return;
  panel.innerHTML = `<div class="dialogue-name">${npc.name} <span>${npc.role}</span></div><div class="dialogue-text">${npc.dialogue[dialogueState.index] || ''}</div><div class="dialogue-help">E / Enter: Continue</div>`;
}
