function grantQuestReward(quest){
  if(!quest) return false;
  player.gold = Math.max(0, player.gold + (Number(quest.rewardGold)||0));
  player.xp = Math.max(0, player.xp + (Number(quest.rewardXp)||0));
  if(typeof checkLevelUp==='function') checkLevelUp();
  if(typeof showMessage==='function') showMessage(`Quest Complete: ${quest.title} • +${quest.rewardGold||0} Gold • +${quest.rewardXp||0} XP`);
  return true;
}
