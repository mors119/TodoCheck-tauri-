import { useEffect } from 'react';
import { useDailyCheckStore } from '../store/useDailyCheckStore';

// 자동 종료를 위한 tick
// (role: app-wide timer tick hook, type: () => void)
export function useAutoStopTick() {
  useEffect(() => {
    const id = window.setInterval(() => {
      useDailyCheckStore.getState().autoStopIfReached({ today: new Date() });
    }, 5000);

    return () => window.clearInterval(id);
  }, []);
}
