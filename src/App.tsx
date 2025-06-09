import { useEffect, useState } from 'react';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

import Ask from '~view/Ask';
import Settings from '~view/Settings';
import Titlebar from '~view/Titlebar';

const viewMap = {
  ask: <Ask />,
  settings: <Settings />,
  titlebar: <Titlebar />,
};

type ViewLabel = keyof typeof viewMap;

export default function App() {
  const [label, setLabel] = useState<ViewLabel>('ask');

  useEffect(() => {
    const win = WebviewWindow.getByLabel('main') ?? undefined;
    const resolvedLabel = (win?.label ?? 'ask') as ViewLabel;

    if (resolvedLabel in viewMap) {
      setLabel(resolvedLabel);
    } else {
      setLabel('ask'); // fallback
    }
  }, []);

  // 👇 This is the line you're asking about
  return viewMap[label] ?? <div>⚠️ Could not load component</div>;
}
