// Small notification queue for gameplay feedback.
// Keeps transient messages out of the core game loop when possible.

const notificationState = window.notificationState || {
  queue: [],
  current: null,
  expiresAt: 0,
};
window.notificationState = notificationState;

function pushNotification(text, durationMs = 2200) {
  if (typeof text !== 'string' || !text.trim()) return false;
  notificationState.queue.push({ text: text.trim(), durationMs: Math.max(250, durationMs) });
  pumpNotificationQueue();
  return true;
}

function pumpNotificationQueue() {
  const now = Date.now();
  if (notificationState.current && now < notificationState.expiresAt) return;
  notificationState.current = notificationState.queue.shift() || null;
  if (!notificationState.current) return;
  notificationState.expiresAt = now + notificationState.current.durationMs;
  if (typeof showMessage === 'function') showMessage(notificationState.current.text);
}

function updateNotifications() {
  pumpNotificationQueue();
}
