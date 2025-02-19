import {app, BrowserWindow, dialog} from 'electron';
import path from 'path';
import fs from 'fs';
import reportExceptions from './features/reportExceptions.js';
import windowWrapper from './windowWrapper.js';
import {enforceSingleInstance, restoreFirstInstance} from './features/singleInstance.js';
import environment from "../environment.js";
import enableContextMenu from './features/contextMenu.js';
import runAtLogin from './features/openAtLogin.js';
import updateNotifier from './features/appUpdates.js';
import setupTrayIcon from './features/trayIcon.js';
import keepWindowState from './features/windowState.js';
import externalLinks from './features/externalLinks.js';
import badgeIcons from './features/badgeIcon.js';
import closeToTray from './features/closeToTray.js';
import setAppMenu from './features/appMenu.js';
import overrideUserAgent from './features/userAgent.js';
import setupOfflineHandlers, {checkForInternet} from './features/inOnline.js';
import handleNotification from './features/handleNotification.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;
let trayIcon = null;

// Features
//const reportExceptions = await import('./features/reportExceptions.js');
//reportExceptions.default();

reportExceptions();

if (enforceSingleInstance()) {
  app.whenReady()
    .then(() => {
      overrideUserAgent();
      mainWindow = windowWrapper(environment.appUrl);
      setupOfflineHandlers(mainWindow);
      checkForInternet(mainWindow);

      trayIcon = setupTrayIcon(mainWindow);
      setAppMenu(mainWindow);
      restoreFirstInstance(mainWindow);
      keepWindowState(mainWindow);
      runAtLogin(mainWindow);
      updateNotifier();
      enableContextMenu();
      badgeIcons(mainWindow, trayIcon);
      closeToTray(mainWindow);
      externalLinks(mainWindow);
      handleNotification(mainWindow);
    })
}

app.setAppUserModelId('com.electron.google-chat');

app.on('window-all-closed', () => {
  app.exit();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
