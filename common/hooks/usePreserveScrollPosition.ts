import { RefObject, useEffect, useState } from 'react';
import globalEvents from '../utils/globalEvents';
import scrollPosition from '../services/session/scrollPosition';
import debounce from '../utils/debounce';

// Hooks to preserve scroll position
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function usePreserveScrollPosition(
  sessionKey: string,
  scrollElementRef: RefObject<HTMLDivElement>,
  isCustomRef: boolean
) {
  const [scrollTop, setScrollTop] = useState(0);

  // set scroll top value
  // of main layout main side
  const setMainScrollPosition = (event: CustomEvent) => {
    if (!isCustomRef) {
      setScrollTop(event.detail.scrollTop);
    }
  };

  // subscribe to main layout main side scroll event
  // and set scroll position in state
  useEffect(() => {
    const unsubscribe = globalEvents.subscribe(
      'mainLayoutMainSideScroll',
      setMainScrollPosition
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set scroll top value
  const onScroll = debounce(
    () => {
      setScrollTop(scrollElementRef?.current?.scrollTop);
    },
    30,
    {}
  );

  // event listner to listen scroll event
  useEffect(() => {
    const element = scrollElementRef.current;
    element?.addEventListener('scroll', onScroll);
    return () => element?.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if custom container scroll than set scroll position for scrollElementRef
  // otherwise trigger event to set main layout main side scroll
  useEffect(() => {
    const scrollTopValue = scrollPosition.getScrollPosition(sessionKey);
    setTimeout(() => {
      if (isCustomRef) {
        scrollElementRef.current.scrollTop = scrollTopValue;
      } else {
        globalEvents.trigger('mainLayoutSetMainSideScroll', {
          scrollTop: scrollTopValue
        });
      }
      scrollPosition.removeItem(sessionKey);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollPosition.setItem(sessionKey, scrollTop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTop]);
}
