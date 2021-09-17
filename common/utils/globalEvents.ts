import eventsConfig from '../../config/globalEvents';

const PREFIX = 'common: utils: globalEvents:';

export default {
  // Publish a global event by name
  trigger(name: string): void {
    const internalEvent = eventsConfig[name];

    if (!internalEvent) {
      throw Error(`${PREFIX} event named "${name}" is not configured`);
    }

    const event = new Event(internalEvent);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  },

  // Create a subscriber for a callback
  // returns an unsubscriber function
  subscribe(name: string, callback: () => any): () => any {
    const internalEvent = eventsConfig[name];

    if (!internalEvent) {
      throw Error(
        `${PREFIX} event named "${name}" is not a globally configured event`
      );
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(internalEvent, callback);
      return () => window.removeEventListener(internalEvent, callback);
    }

    // eslint-disable-next-line
    return () => {}; // noop
  }
};
