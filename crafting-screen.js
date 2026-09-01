// Crafting screen foundation. UI only; crafting rules remain in crafting.js.

const craftingScreenState = window.craftingScreenState || { open: false };
window.craftingScreenState = craftingScreenState;

function toggleCraftingScreen() {
  craftingScreenState.open = !craftingScreenState.open;
  renderCraftingScreen();
}

function renderCraftingScreen(targetId = 'inventory-content') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const recipes = Array.isArray(window.CRAFTING_RECIPES) ? window.CRAFTING_RECIPES : [];
  const content = recipes.length
    ? recipes.map((recipe) => {
        const ingredients = Object.entries(recipe.ingredients || {})
          .map(([id, amount]) => `${id} ×${amount}`).join(', ');
        return `<div class="item-row"><span>${recipe.name}</span><b>${ingredients || 'No ingredients'}</b></div>`;
      }).join('')
    : '<div class="item-row"><span>Crafting</span><b>No recipes yet.</b></div>';

  target.insertAdjacentHTML('beforeend', `
    <div class="inventory-section crafting-section ${craftingScreenState.open ? '' : 'hidden'}">
      <h3>CRAFTING</h3>
      ${content}
    </div>
  `);
}
