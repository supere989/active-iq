const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');

const glMode = process.env.VECTORGUARD_GL_MODE || (process.platform === 'linux' ? 'angle' : 'desktop');
if (glMode) {
  if (glMode === 'osmesa') {
    app.commandLine.appendSwitch('use-gl', 'swiftshader');
    app.commandLine.appendSwitch('enable-unsafe-swiftshader');
  } else {
    app.commandLine.appendSwitch('use-gl', glMode);
    if (glMode === 'angle') {
      app.commandLine.appendSwitch('use-angle', 'gl');
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'build', 'icons', process.platform === 'win32' ? 'icon.ico' : process.platform === 'darwin' ? 'icon.icns' : 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webgl: true,
      webSecurity: true,
      backgroundThrottling: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server port
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
