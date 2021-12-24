import { useEffect, useState, RefObject } from 'react';

type setSwipeOpen = (isOpen: boolean) => any;

const useSwipeReveal = (
  ref: RefObject<HTMLLIElement | HTMLDivElement>,
  setIsSwipeOpen: setSwipeOpen
):void => {
  const { current } = ref;
  // Keep Track Of Our Current Location
  const [clientXStart, setClientXStart] = useState(0);

  function handleTouchStart(event: TouchEvent) {
    // Touch Start Events Give A List Of Touches For Multiple Fingers.  0 Would Be The First Finger
    setClientXStart(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent) {
    const clientXEnd = event.changedTouches[0].clientX;
    // Find The Difference From The Start To The End Touch
    const xDistance = clientXStart - clientXEnd;

    if (xDistance <= -120) {
      setIsSwipeOpen(false);
    } else if (xDistance >= 120) {
      setIsSwipeOpen(true);
    }
  }

  useEffect(() => {
    if (current) {
      current.addEventListener('touchstart', handleTouchStart);
      current.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (current) {
        current.removeEventListener('touchstart', handleTouchStart);
        current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  });
};

export default useSwipeReveal;
