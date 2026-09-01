// Lightweight equipment framework. Stats are additive and data-driven.
const EQUIPMENT_DATA = Object.freeze({
  wanderer_staff:{ id:'wanderer_staff', name:'Wanderer Staff', slot:'weapon', attackPower:8, element:null },
  iron_ward:{ id:'iron_ward', name:'Iron Ward', slot:'armor', maxHp:20, defense:3, element:null },
  moon_charm:{ id:'moon_charm', name:'Moon Charm', slot:'accessory', maxMp:12, magicPower:3, element:'shadow' },
});

const equipmentState = window.equipmentState || { equipped:{ weapon:'wanderer_staff', armor:null, accessory:null } };
window.equipmentState = equipmentState;

function getEquippedItems(){ return Object.values(equipmentState.equipped).map(id=>id?EQUIPMENT_DATA[id]:null).filter(Boolean); }
function getEquipmentBonuses(){
  return getEquippedItems().reduce((out,item)=>{
    for(const key of ['attackPower','maxHp','maxMp','defense','magicPower']) out[key]=(out[key]||0)+(Number(item[key])||0);
    return out;
  },{});
}
function equipItem(id){
  const item=EQUIPMENT_DATA[id]; if(!item) return false;
  equipmentState.equipped[item.slot]=id;
  showMessage(`Equipped ${item.name}.`); return true;
}
