class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach((callback) => callback(this.notifications));
  }

  createNotification(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }

    return id;
  }

  success(message, duration = 3000) {
    return this.createNotification(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.createNotification(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.createNotification(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.createNotification(message, 'info', duration);
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clearAll() {
    this.notifications = [];
    this.notify();
  }

  getNotifications() {
    return this.notifications;
  }

  getRecentNotifications(count = 5) {
    return this.notifications.slice(-count);
  }
}

export default new NotificationService();
