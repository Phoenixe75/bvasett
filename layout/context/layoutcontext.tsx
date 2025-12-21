'use client';
import React, {createContext, useEffect, useState} from 'react';
import {ChildContainerProps, LayoutConfig, LayoutContextProps, LayoutState} from '@/types';
import {redirect} from 'next/navigation';

export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({children}: ChildContainerProps) => {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14
  });

  const [layoutState, setLayoutState] = useState<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  });

  const [settingScript, setSettingScript] = useState<boolean>(false);

  useEffect(() => {
    if (!settingScript) {
      const script = document.createElement("script");
      script.innerHTML = `!function (t, e, n) {
      t.yektanetAnalyticsObject = n, t[n] = t[n] || function () {
      t[n].q.push(arguments)
    }, t[n].q = t[n].q || [];
      var a = new Date, r = a.getFullYear().toString() + "0" + a.getMonth() + "0" + a.getDate() + "0" + a.getHours(),
      c = e.getElementsByTagName("script")[0], s = e.createElement("script");
      s.id = "ua-script-jD1totro"; s.dataset.analyticsobject = n;
      s.async = 1; s.type = "text/javascript";
      s.src = "https://cdn.yektanet.com/rg_woebegone/scripts_v3/jD1totro/rg.complete.js?v=" + r, c.parentNode.insertBefore(s, c)
    }(window, document, "yektanet");`;
      document.head.appendChild(script);


      // <!-- Google tag (gtag.js) -->
      const gtmRequirementScript = document.createElement("script");
      const gtmScript = document.createElement("script");
      gtmRequirementScript.async = true;
      gtmRequirementScript.src = "https://www.googletagmanager.com/gtag/js?id=G-Z0S5J74RCB";
      document.head.appendChild(gtmRequirementScript);
      const gtmScriptContent = document.createTextNode(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Z0S5J74RCB');
      `);
      gtmScript.appendChild(gtmScriptContent);
      document.head.appendChild(gtmScript);
      setSettingScript(true);
    }
  }, [settingScript]);

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive
      }));
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
      }));
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
      }));
    }
  };

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible
    }));
  };

  const isOverlay = () => {
    return layoutConfig.menuMode === 'overlay';
  };

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  useEffect(() => {
    if (!isDesktop()) {
      redirect('https://app.bvasett.ir/')
    }
  }, []);

  const value: LayoutContextProps = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
