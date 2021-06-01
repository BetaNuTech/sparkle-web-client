import { useEffect, useState } from 'react';

const useSwipeReveal = (ref, setIsSwipeOpen) => {
  // Keep Track Of Our Current Location
  const [clientXStart, setClientXStart] = useState(0);

  function handleTouchStart(event) {
    // Touch Start Events Give A List Of Touches For Multiple Fingers.  0 Would Be The First Finger
    setClientXStart(event.touches[0].clientX);
  }

  function handleTouchEnd(event) {
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
    if (ref.current) {
      ref.current.addEventListener('touchstart', handleTouchStart);
      ref.current.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('touchstart', handleTouchStart);
        ref.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  });
};

export default useSwipeReveal;
