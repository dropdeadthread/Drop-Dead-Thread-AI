import { useEffect, useState } from 'react';
import { platform as TauriPlatform } from '@tauri-apps/plugin-os';

export default function useInfo() {
  const [platform, setPlatform] = useState('');
  const [isMac, setMac] = useState(false);

  useEffect(() => {
    const handleInfo = async () => {
      try {
        const p = await TauriPlatform();
        setPlatform(p);
        setMac(p === 'macos');
      } catch (err) {
        console.error('Failed to get platform info', err);
      }
    };

    handleInfo();
  }, []);

  return { platform, isMac };
}
