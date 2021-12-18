import Observable from 'zen-observable';
import debounce from './debounce';

export default new Observable((observer) => {
  const notifySubscribers = debounce(
    () => {
      observer.next({
        width: window.innerWidth,
        height: window.innerHeight
      });
    },
    60,
    {}
  );

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', notifySubscribers);
  }
});
