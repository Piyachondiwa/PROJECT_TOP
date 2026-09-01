// Shared economy helpers for shops, rewards and future item transactions.
function addGold(amount) {
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  player.gold = Math.max(0, Math.floor(Number(player.gold) || 0) + value);
  return value;
}

function spendGold(amount) {
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  if (player.gold < value) return false;
  player.gold -= value;
  return true;
}

function addCount(collection, id, amount = 1) {
  if (!collection || !id) return false;
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  if (value === 0) return true;
  collection[id] = (Number(collection[id]) || 0) + value;
  return true;
}

function removeCount(collection, id, amount = 1) {
  if (!collection || !id) return false;
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  const current = Math.max(0, Math.floor(Number(collection[id]) || 0));
  if (current < value) return false;
  const next = current - value;
  if (next === 0) delete collection[id];
  else collection[id] = next;
  return true;
}
