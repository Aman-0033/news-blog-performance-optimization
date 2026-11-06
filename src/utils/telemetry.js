/**
 * Ticket: ENG-84718
 * Telemetry Simulation Utility for News Blog Performance Optimization
 */

let subscribers = [];
const logHistory = [];

export function subscribeTelemetry(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}

export function getTelemetryHistory() {
  return [...logHistory];
}

export function trackInteraction(action, details = {}) {
  const message = `[Analytics] User interacted with Performance Optimization: ${action}`;
  console.log(message, details);

  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toLocaleTimeString(),
    action,
    details,
    message,
  };

  logHistory.unshift(logEntry);
  if (logHistory.length > 30) {
    logHistory.pop();
  }

  // Notify active UI subscribers
  subscribers.forEach((cb) => cb(logHistory));

  return logEntry;
}

export function clearTelemetryHistory() {
  logHistory.length = 0;
  subscribers.forEach((cb) => cb(logHistory));
}
