// Expanded quest content registry for Monster Garden.
const QUEST_CONTENT = Object.freeze([
  { id:'field-seed', title:'First Seed', type:'kill', targetId:'goblin', amount:1, rewardGold:40, rewardXp:30 },
  { id:'strange-growth', title:'Strange Growth', type:'harvest', targetId:null, amount:1, rewardGold:60, rewardXp:45 },
  { id:'hunter-pack', title:'Cull the Pack', type:'kill', targetId:'wolf', amount:3, rewardGold:90, rewardXp:80 },
  { id:'shadow-night', title:'Things After Dusk', type:'kill', targetId:'bat', amount:3, rewardGold:120, rewardXp:110 },
]);

function getQuestContent(id) {
  return QUEST_CONTENT.find((quest) => quest.id === id) || null;
}
