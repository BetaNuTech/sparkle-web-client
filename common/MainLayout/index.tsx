import clsx from 'clsx';
import React, {
  useState,
  useEffect,
  useRef,
  FunctionComponent,
  ReactElement
} from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from './styles.module.scss';
import SlideNav from '../SlideNav';
import { useNavigatorOnline } from '../utils/getOnlineStatus';
import globalEvents from '../utils/globalEvents';
import debounce from '../utils/debounce';
import UserModel from '../models/user';

const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true';
const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const APP_VERSION = publicRuntimeConfig.appVersion || '';

interface Props {
  user?: UserModel;
  children: ReactElement | ReactElement[];
}

export const MainLayout: FunctionComponent<Props> = ({
  user = {} as UserModel,
  children
}) => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isOnline = useNavigatorOnline();
  const containerRef = useRef();
  // Open & close slide navigation
  const toggleNavOpen = () => setIsNavOpen(!isNavOpen);

  // Remove null children
  const filteredChildren = Array.isArray(children)
    ? children.filter(Boolean)
    : children;

  // Expose main layout
  // values to children
  const childrenWithProps = React.Children.map(
    filteredChildren,
    (child: ReactElement) =>
      React.cloneElement(child, {
        isNavOpen,
        toggleNavOpen,
        isOnline,
        isStaging
      })
  );

  useEffect(() => {
    const handleRouteChange = () => {
      // Check if mobile side nav os open
      // then close it
      if (isNavOpen) {
        toggleNavOpen();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // trigger container scroll event
  // with scroll top value
  const onScroll = debounce(
    () => {
      const element = containerRef.current as HTMLDivElement;
      globalEvents.trigger('mainLayoutMainSideScroll', {
        scrollTop: element?.scrollTop
      });
    },
    30,
    {}
  );

  // event listner to listen scroll event
  useEffect(() => {
    const element = containerRef.current as HTMLDivElement;
    element?.addEventListener('scroll', onScroll);
    return () => element?.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll top to the given value
  const setScrollPosition = (event) => {
    const element = containerRef.current as HTMLDivElement;
    element.scrollTop = event?.detail?.scrollTop;
  };

  // event subscriber for main side scroll
  useEffect(() => {
    const unsubscribe = globalEvents.subscribe(
      'mainLayoutSetMainSideScroll',
      setScrollPosition
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={
        isNavOpen
          ? clsx(styles.wrapper, styles['wrapper--open'])
          : styles.wrapper
      }
    >
      <SlideNav
        isOnline={isOnline}
        isStaging={isStaging}
        toggleNavOpen={toggleNavOpen}
        appVersion={APP_VERSION}
        user={user}
      />
      <main className={styles.mainSide} ref={containerRef}>
        {childrenWithProps}
      </main>
    </div>
  );
};
