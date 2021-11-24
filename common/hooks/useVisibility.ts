import { useState, useEffect } from 'react';
import globalEvents from '../utils/globalEvents';

type config = {
  root?: any;
  threshold?: number;
  rootMargin?: string;
  isDisconnectedOnInitialRender?: boolean;
};
const defaultConfig = {
  root: null,
  threshold: 0.5, // 50% of element is visible
  rootMargin: '0px'
};

// Source: https://github.com/srigar/react-lazyloading/blob/master/src/useVisibilityHook.js (v1.0.0)
// eslint-disable-next-line
const useVisibility = (ref = null, options: config = {}, visible = false) => {
  let observer;
  const [isVisible, setIsVisible] = useState(visible);
  const [element, setElement] = useState(ref);
  const { isDisconnectedOnInitialRender } = options;
  let unsubscribe = () => true;

  const forceVisible = () => {
    setIsVisible(true);
  };

  const forceCheck = () => {
    setTimeout(() => {
      if (observer && element.current) {
        observer.unobserve(element.current);
        observer.observe(element.current);
      }
    }, 100);
  };

  const visibilityCallBack = ([entry]) => {
    const { isIntersecting } = entry;

    if (isIntersecting) {
      setIsVisible(true);
    } else if (!visible) {
      setIsVisible(false); // don't hide if forced visible
    }

    // Support one and done visiblity
    if (isIntersecting && isDisconnectedOnInitialRender) {
      observer.disconnect();
      unsubscribe();
    }
  };

  useEffect(() => {
    if (visible) {
      forceVisible();
    }
  }, [visible]);

  let isOnLoadCheckComplete = false;
  useEffect(() => {
    if (!element || !element.current) {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    observer = new IntersectionObserver(visibilityCallBack, {
      ...defaultConfig,
      ...options
    });
    observer.observe(element.current);

    // Subscribe to global visibility force check
    // eslint-disable-next-line
    unsubscribe = globalEvents.subscribe('visibilityForceCheck', forceCheck);

    // On load post-render check
    if (
      typeof requestAnimationFrame === 'function' &&
      !isVisible &&
      !isOnLoadCheckComplete
    ) {
      requestAnimationFrame(forceCheck);
    }
    isOnLoadCheckComplete = true; // eslint-disable-line

    // Cleanup
    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
      unsubscribe();
    };
  }, [element, options.root, options.rootMargin, options.threshold]);

  return { setElement, isVisible, forceVisible, forceCheck };
};

export default useVisibility;
