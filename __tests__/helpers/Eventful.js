export default class Eventful {

  events = {};

  addEventListener = (eventName, handler) => {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(handler);
  }

  trigger = (eventName, ...args) =>
    (this.events[eventName] || []).forEach(handler => handler(...args))
}
