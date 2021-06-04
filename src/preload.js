import { contextBridge, ipcRenderer } from 'electron';
import { factory } from 'electron-json-config'

const config = factory()

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    const subscription = (_, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);
    return {
      remove: () => ipcRenderer.removeListener(channel, subscription),
    };
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (_, ...args) => func(...args));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
})

contextBridge.exposeInMainWorld('config', {
  get: (key, defaultValue) => {
    return config.get(key, defaultValue)
  },
  set: (key, value) => {
    config.set(key, value)
  },
  all: () => {
    return config.all()
  },
  del: (key) => {
    config.delete(key)
  },
  has: (key) => {
    return config.has(key)
  }
})