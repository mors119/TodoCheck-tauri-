import type { Notifier } from '../../domain/notifier';
import { publishToast } from '../toast/ToastBus';

// (role: notifier implementation that emits toast events, type: Notifier)
export const toastNotifier: Notifier = {
  notify: ({ level, message }) => {
    publishToast({ level, message });
  },
};
