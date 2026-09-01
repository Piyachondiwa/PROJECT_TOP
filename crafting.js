// Basic crafting registry. Recipes are data-driven and can grow independently.
const CRAFTING_RECIPES = Object.freeze([
  {
    id: 'mana-tonic',
    name: 'Mana Tonic',
    ingredients: { moonleaf: 2 },
    result: { itemId: 'mana-tonic', type: 'consumable', amount: 1 },
  },
  {
    id: 'ember-salve',
    name: 'Ember Salve',
    ingredients: { emberroot: 2 },
    result: { itemId: 'ember-salve', type: 'consumable', amount: 1 },
  },
]);

const craftedItems = window.craftedItems || {};
window.craftedItems = craftedItems;

function canCraft(recipeId) {
  const recipe = CRAFTING_RECIPES.find((item) => item.id === recipeId);
  if (!recipe) return false;
  return Object.entries(recipe.ingredients).every(([itemId, amount]) => {
    return (player.materials?.[itemId] || 0) >= amount;
  });
}

function craft(recipeId) {
  const recipe = CRAFTING_RECIPES.find((item) => item.id === recipeId);
  if (!recipe || !canCraft(recipeId)) {
    if (typeof showMessage === 'function') showMessage('Missing crafting materials.');
    return false;
  }
  player.materials = player.materials || {};
  for (const [itemId, amount] of Object.entries(recipe.ingredients)) {
    player.materials[itemId] = Math.max(0, (player.materials[itemId] || 0) - amount);
    if (player.materials[itemId] === 0) delete player.materials[itemId];
  }
  craftedItems[recipe.result.itemId] = (craftedItems[recipe.result.itemId] || 0) + recipe.result.amount;
  if (typeof showMessage === 'function') showMessage(`Crafted ${recipe.name}.`);
  return true;
}
