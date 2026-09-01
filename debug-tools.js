// Lightweight runtime diagnostics for Monster Garden.
// Safe to load in development and harmless if a system is still optional.
(function attachDebugTools(){
  const debug = window.MONSTER_GARDEN_DEBUG || { errors: [], startedAt: Date.now() };
  window.MONSTER_GARDEN_DEBUG = debug;

  window.addEventListener('error', (event) => {
    debug.errors.push({ type: 'error', message: event.message || 'Unknown error', time: Date.now() });
    if (debug.errors.length > 20) debug.errors.shift();
  });

  window.addEventListener('unhandledrejection', (event) => {
    debug.errors.push({ type: 'promise', message: String(event.reason || 'Unknown rejection'), time: Date.now() });
    if (debug.errors.length > 20) debug.errors.shift();
  });

  window.gameHealthCheck = function gameHealthCheck(){
    const required = ['player','monsters','MONSTER_DATA','GARDEN_PLOTS','plantInstances'];
    const missing = required.filter((name) => typeof window[name] === 'undefined');
    return { ok: missing.length === 0 && debug.errors.length === 0, missing, recentErrors: [...debug.errors] };
  };
})();
