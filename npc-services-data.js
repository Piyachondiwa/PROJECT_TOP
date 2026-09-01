const NPC_SERVICE_DATA = Object.freeze({
  mira: { id:'mira', name:'Mira', service:'seed-shop', description:'Sells basic seeds.' },
  nera: { id:'nera', name:'Nera', service:'quest-board', description:'Posts local quests.' },
  elian: { id:'elian', name:'Elian', service:'adventure-info', description:'Shares field and monster information.' },
});

function getNpcService(npcId){ return NPC_SERVICE_DATA[npcId] || null; }
