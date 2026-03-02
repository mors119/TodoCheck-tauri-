import { setNotifier } from '../di/notifierDI';
import { toastNotifier } from '../../infra/notifier/ToastNotifier';

// (role: app bootstrap initializer, type: ()=>void)
export function initNotifier(): void {
  setNotifier(toastNotifier);
}
