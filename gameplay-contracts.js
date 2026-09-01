// Shared gameplay contracts for Monster Garden.
// Keeps cross-system data shapes consistent without replacing the existing runtime.

const GAMEPLAY_CONTRACTS = Object.freeze({
  monster: ['id','name','level','element','baseHp','speed','seedName','trait','skill'],
  plant: ['plotId','monsterId','plantedAt','growthSeconds','stage'],
  quest: ['id','title','description','type','amount','rewardGold','rewardXp'],
  equipment: ['id','name','slot'],
});

function hasContractFields(object, contractName) {
  const fields = GAMEPLAY_CONTRACTS[contractName];
  if (!fields || !object || typeof object !== 'object') return false;
  return fields.every((field) => Object.prototype.hasOwnProperty.call(object, field));
}

function clampNumber(value, fallback, min = -Infinity, max = Infinity) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}
