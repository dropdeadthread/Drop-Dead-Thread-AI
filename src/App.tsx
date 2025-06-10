import { useEffect, useState } from 'react';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

import Ask from '~view/Ask';
import Settings from '~view/Settings';
import Titlebar from '~view/Titlebar';

const viewMap = {
  ask: Ask,
  settings: Settings,
  titlebar: Titlebar,
};

type ViewLabel = keyof typeof viewMap;

export default function App() {
  const [label, setLabel] = useState<ViewLabel>('ask');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let resolved: string | undefined;

    try {
      resolved = WebviewWindow.getByLabel('main')?.label;
    } catch (err) {
      console.warn('Unable to resolve window label', err);
    }

    if (resolved && resolved in viewMap) {
      setLabel(resolved as ViewLabel);
    } else {
      if (resolved && !(resolved in viewMap)) {
        console.warn(`Unknown view label "${resolved}"; falling back to "ask"`);
      }
      setLabel('ask');
    }
  }, []);

  const View = viewMap[label];

  if (!View) {
    return <div>⚠️ Could not load component: {label}</div>;
  }

  try {
    return <View />;
  } catch (err) {
    console.error('Failed to render component', label, err);
    setError(`Failed to render ${label} view`);
  }

  return <div>{error ?? 'Unknown error loading view'}</div>;
}
