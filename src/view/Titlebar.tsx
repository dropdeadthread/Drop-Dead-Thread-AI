import { useEffect, useState, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-shell';
import { debounce } from 'lodash';
import clsx from 'clsx';

import useInfo from '~hooks/useInfo';
import ReloadIcon from '~icons/Reload';
import PinIcon from '~icons/Pin';
import UnPinIcon from '~icons/UnPin';
import LinkIcon from '~icons/Link';
import AskIcon from '~icons/Ask';
import SettingIcon from '~icons/Setting';
import ThemeSystem from '~icons/ThemeSystem';
import ThemeLight from '~icons/ThemeLight';
import ThemeDark from '~icons/ThemeDark';
import ArrowLeftIcon from '~icons/ArrowLeft';

export default function Titlebar() {
  const info = useInfo();
  const [url, setUrl] = useState('');
  const [hostname, setHostname] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [enableAsk, setEnableAsk] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isPin, setPin] = useState(false);
  const [isTitlebarHidden, setTitlebarHidden] = useState(false);

  const titlebarHidden = info.isMac && isTitlebarHidden;

  useEffect(() => {
    const win = getCurrentWindow();
    let resizeUnlisten: Function | undefined;
    let navUnlisten: Function | undefined;

    invoke<I.AppConf>('get_app_conf').then((v) => {
      setEnableAsk(v.ask_mode);
      setPin(v.stay_on_top);
      setTitlebarHidden(v.mac_titlebar_hidden);
    });

    (async () => {
      const full = await win.isFullscreen();
      setFullScreen(full);

      resizeUnlisten = await win.listen(
        'tauri://resize',
        debounce(async () => {
          setFullScreen(await win.isFullscreen());
        }, 50)
      );

      navUnlisten = await win.listen('navigation:change', (event: any) => {
        const { url } = event.payload;
        setUrl(url);

        try {
          setHostname(new URL(url).hostname);
        } catch {
          setHostname(url);
        }
      });
    })();

    return () => {
      resizeUnlisten?.();
      navUnlisten?.();
    };
  }, []);

  const handleRefresh = () => invoke('view_reload');
  const handleGoForward = () => invoke('view_go_forward');
  const handleGoBack = () => invoke('view_go_back');
  const handlePin = (pin: boolean) => {
    setPin(pin);
    invoke('window_pin', { pin });
  };

  const handleAsk = () => {
    const newStatus = !enableAsk;
    setEnableAsk(newStatus);
    invoke('set_view_ask', { enabled: newStatus });
  };

  const cycleTheme = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    localStorage.setItem('theme', next);
    invoke('set_theme', { theme: next });
  };

  const themeIcon = useMemo(() => {
    switch (theme) {
      case 'system': return <ThemeSystem title="Light" action onClick={cycleTheme} />;
      case 'light': return <ThemeLight title="Dark" action onClick={cycleTheme} />;
      case 'dark': return <ThemeDark title="System" action onClick={cycleTheme} />;
      default: return <ThemeSystem title="System" action onClick={cycleTheme} />;
    }
  }, [theme]);

  const handleOpenUrl = () => {
    if (url) open(url);
  };

  const handleSetting = () => {
    invoke('open_settings');
  };

  const renderSettings = useMemo(() => (
    <div className={clsx('items-center gap-1', {
      'hidden group-hover:flex': titlebarHidden,
      'flex': !titlebarHidden,
    })}>
      {themeIcon}
      {isPin
        ? <PinIcon action onClick={() => handlePin(false)} />
        : <UnPinIcon action onClick={() => handlePin(true)} />}
      <SettingIcon action onClick={handleSetting} />
    </div>
  ), [titlebarHidden, themeIcon, isPin]);

  return (
    <div data-tauri-drag-region className={clsx(
      'flex group pr-2 h-full cursor-default select-none dark:bg-app-gray-2 justify-between',
      { 'pl-[80px]': !fullScreen && info.isMac, 'pl-[10px]': fullScreen || !info.isMac }
    )}>
      <div data-tauri-drag-region className={clsx('items-center gap-0.5', {
        'hidden tablet:group-hover:flex group-hover:hidden': titlebarHidden,
        'tablet:flex hidden': !titlebarHidden,
      })}>
        {hostname && (
          <span
            className="flex items-center bg-slate-300/50 dark:bg-slate-100/10 dark:text-gray-500 rounded-full pl-[4px] pr-[8px] h-[14px] text-[10px] gap-1 text-slate-700 mr-1"
            onClick={handleOpenUrl}
            title={url}
          >
            <LinkIcon size={14} />
            {hostname}
          </span>
        )}
        <ArrowLeftIcon action onClick={handleGoBack} />
        <ArrowLeftIcon action onClick={handleGoForward} className="rotate-180" />
        <ReloadIcon action onClick={handleRefresh} />
        <AskIcon
          action
          onClick={handleAsk}
          className={clsx({ '!text-app-active': enableAsk })}
        />
      </div>
      <div className={clsx({
        'hidden group-hover:flex': titlebarHidden,
        'flex': !titlebarHidden,
      })} />
      {renderSettings}
    </div>
  );
}
