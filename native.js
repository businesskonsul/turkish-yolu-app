// Registers the native Capacitor plugins on window.Capacitor.Plugins for the single-file app.
import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

const P = (window.Capacitor && window.Capacitor.Plugins) || (Capacitor.Plugins = Capacitor.Plugins || {});
P.Haptics = Haptics;
P.LocalNotifications = LocalNotifications;
window.Capacitor = window.Capacitor || Capacitor;

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  if (Capacitor.getPlatform() === 'android') StatusBar.setBackgroundColor({ color: '#1A4E8F' }).catch(() => {});
  window.addEventListener('load', () => setTimeout(() => SplashScreen.hide().catch(() => {}), 250));
}
