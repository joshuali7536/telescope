import { useState, useEffect, useCallback } from 'react';
import { useMountedState } from 'react-use';
import useVisibility from './use-visibility';

// XXX: VSCode/TS are unhappy with these paths, but they work at build/runtime.
import Logo from '../../public/logo.svg';
import BadgedLogo from '../../public/logo-badge.svg';

const useFaviconBadge = () => {
  const isMounted = useMountedState();
  const [logo, setLogo] = useState(Logo);
  const isVisible = useVisibility();

  // When the logo state changes, update favicon(s)
  useEffect(() => {
    // HACK: Gatsby has ~10 <link rel="shortcut icon"> elements in the <head>
    // for various sizes.  This updates them all, which is not perfect, but works!
    // Code based on useFavicon, see https://github.com/streamich/react-use/blob/master/src/useFavicon.ts
    // Used under Unlicense https://github.com/streamich/react-use/blob/master/LICENSE
    document
      .querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
      .forEach((link: HTMLLinkElement) => {
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = logo;
      });
  }, [logo]);

  // Manage the transition to visible, and reset the logo.
  useEffect(() => {
    if (isVisible) {
      setLogo(Logo);
    }
  }, [isVisible]);

  // Provide a way for users to hint that the badge should be set.
  // We ignore this if the we're not mounted, or page isn't visible.
  const setBadgeHint = useCallback(() => {
    if (!isMounted()) {
      return;
    }
    if (!isVisible) {
      setLogo(BadgedLogo);
    }
  }, [isMounted, isVisible]);

  return setBadgeHint;
};

export default useFaviconBadge;
