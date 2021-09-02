import { useState, useEffect } from 'react';

type config = {
  root?: any;
  threshold?: number;
  rootMargin?: string;
  isDisconnectedOnInitialRender?: boolean;
};
const defaultConfig = {
  root: null,
  threshold: 0.7, // 70% of element is visible
  rootMargin: '0px'
};

// Source: https://github.com/srigar/react-lazyloading/blob/master/src/useVisibilityHook.js (v1.0.0)
// eslint-disable-next-line
const useVisibility = (ref = null, options: config = {}, visible = false) => {
  let observer;
  const [isVisible, setIsVisible] = useState(visible);
  const [element, setElement] = useState(ref);
  const { isDisconnectedOnInitialRender } = options;

  const forceVisible = () => {
    setIsVisible(true);
  };

  const forceCheck = () => {
    observer.unobserve(element.current);
    observer.observe(element.current);
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
    }
  };

  useEffect(() => {
    if (visible) {
      forceVisible();
    }
  }, [visible]);

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
    return () => observer && observer.disconnect && observer.disconnect();
  }, [element, options.root, options.rootMargin, options.threshold]);

  return { setElement, isVisible, forceVisible, forceCheck };
};

export default useVisibility;
