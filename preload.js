const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getUserData: () => ipcRenderer.invoke('getUserData'),
    performRoll: (options) => ipcRenderer.invoke('performRoll', options),
    setUserData: (data) => ipcRenderer.invoke('setUserData', data),
    updateUserData: (data) => ipcRenderer.invoke('updateUserData', data),
    setFavorites: (favoriteIds) => ipcRenderer.invoke('setFavorites', favoriteIds),
    getCharacters: () => ipcRenderer.invoke('getCharacters'),
    getAchievements: () => ipcRenderer.invoke('getAchievements'),
    checkAchievements: () => ipcRenderer.invoke('checkAchievements'),
})