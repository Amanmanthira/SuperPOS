const{contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('api',(n,a)=>ipcRenderer.invoke('api',n,a));
