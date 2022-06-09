const { app, BrowserWindow,ipcMain } = require('electron')
const bindings=require("@serialport/bindings-cpp")
const serialport=require("serialport")
const path=require("path")
const utf8 = require('utf8');
var win




const createWindow = () => {
    win = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            preload:path.join(__dirname, "preload.js")
        },
          width: 800,
          height: 600
        })
       // win.removeMenu()
  win.loadFile('app/html/index.html')
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  ipcMain.on('toMain', (event, arg) => {
   sendMessage(arg.port,arg.message)
});
ipcMain.on('reload', (event, arg) => {
    switch (process.platform) {
        case "win32":
            bindings.WindowsBinding.list().then((data)=>{
              let array=[]
                data.forEach(element => {
                   array.push({friendlyName:element.friendlyName,path:element.path}) 
                });
                win.webContents.send("fromMain",array)
            })
            break;
    
        default:
            break;
    }
    //serialList.list
    /*serialport.list().then(function(ports){
        ports.forEach(function(port){
          console.log("Port: ", port);
        })
        win.webContents.send("fromMain",ports)
      });*/
    
 });
  function sendMessage(portName,message){
    let port=new serialport.SerialPort({path:portName,baudRate:115200,autoOpen:false})
   if(!port.isOpen){
    port.open()
   }
    port.write(message, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
        if(port.isOpen){
            port.close()
        }
      
      })
   // Open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message)
  })
   
  }