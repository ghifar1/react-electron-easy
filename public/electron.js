const { app, BrowserWindow, dialog } = require("electron");
const path = require('path');
const isDev = require('electron-is-dev');

function splashScreen() {
  const splash = new BrowserWindow({
    width: 810,
    height: 610,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    show: false,
  });

  splash.loadFile(__dirname + '/el_file/splash/splash_screen.html').catch((err) =>{
      console.log(err)
  });
  win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`).catch((err) => {
    console.log(err + "errorrrr");
    dialog
      .showMessageBox({
        title: "Error",
        message: "Gagal memuat URL target, cek koneksi Anda",
        type: "error",
        buttons: ["Muat Ulang", "Keluar"],
      })
      .then((res) => {
        splash.destroy();
        win.close();
        if (res.response === 0) {
          return splashScreen();
        }
      });
  });

  win.once("ready-to-show", () => {
    splash.destroy();
    win.show();
  });
}

app.once("ready", () => {
  splashScreen();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
