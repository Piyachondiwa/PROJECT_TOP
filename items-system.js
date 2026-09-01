const ITEM_TYPES = Object.freeze({ MATERIAL:'material', CONSUMABLE:'consumable', QUEST:'quest', KEY:'key' });

function ensureItemStore(){ if(!player.items || typeof player.items !== 'object' || Array.isArray(player.items)) player.items = {}; return player.items; }
function addItem(itemId, amount=1){ const store=ensureItemStore(); const n=Math.max(0,Math.floor(Number(amount)||0)); if(!itemId || !n) return false; store[itemId]=(store[itemId]||0)+n; return true; }
function removeItem(itemId, amount=1){ const store=ensureItemStore(); const n=Math.max(0,Math.floor(Number(amount)||0)); if((store[itemId]||0)<n) return false; store[itemId]-=n; if(store[itemId]<=0) delete store[itemId]; return true; }
function getItemCount(itemId){ return ensureItemStore()[itemId]||0; }
function hasItem(itemId, amount=1){ return getItemCount(itemId)>=amount; }
