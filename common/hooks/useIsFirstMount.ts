import { useRef, useEffect } from 'react';

const useIsFirstMount = (): boolean => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export default useIsFirstMount;
