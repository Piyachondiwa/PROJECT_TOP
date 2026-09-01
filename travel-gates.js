// Travel gate definitions. Runtime integration can consume these records.
const TRAVEL_GATES = Object.freeze([
  { id:'gate-eldoria-veylthorn', from:'eldoria_fields', to:'veylthorn_forest', minLevel:4 },
  { id:'gate-veylthorn-dravaryn', from:'veylthorn_forest', to:'dravaryn_ash', minLevel:8 },
  { id:'gate-dravaryn-nythrheim', from:'dravaryn_ash', to:'nythrheim_moor', minLevel:14 },
  { id:'gate-nythrheim-aureval', from:'nythrheim_moor', to:'aureval_wastes', minLevel:22 },
]);

function getTravelGate(id) { return TRAVEL_GATES.find((gate) => gate.id === id) || null; }
function canUseTravelGate(gateId, playerLevel = player?.level || 1) {
  const gate = getTravelGate(gateId);
  return !!gate && playerLevel >= gate.minLevel;
}
