const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

try {
    require('electron-reloader')(module, {
        debug: true,
        watchRenderer: true
    });
} catch (_) { }

let Store;

import('electron-store').then(module => {
    Store = module.default;
    initializeStore();
    handleDailyRewards();
    initializeAchievements();
}).catch(err => {
    console.error('Failed to load electron-store:', err);
});

let store;

function initializeStore() {
    store = new Store();
    if (!store.get('userData')) {
        store.set('userData', {
            currency: 1000,
            inventory: [],
            rollHistory: [],
            lastLogin: null, 
            favorites: [], 
            username: '', 
            icon: '', 
            isCheater: false, 
            usedSpecialUsernames: [],
            lastCollectionTime: null
        });
    }

    const userData = store.get('userData');
    if (userData.isCheater === undefined) {
        userData.isCheater = false;
        store.set('userData', userData);
    }

    if (!userData.usedSpecialUsernames) {
        userData.usedSpecialUsernames = [];
        store.set('userData', userData);
    }

    if (!store.get('characters')) {
        store.set('characters', {
            /* Characters Rank R (Global Banner) */
            1: { id: 1, name: "Toge Inumaki", rarity: "R", image: "./assets/img/chars/Rtoge.png" },
            2: { id: 2, name: "Itadori Yuuji", rarity: "R", image: "./assets/img/chars/Ritadori.png" },
            3: { id: 3, name: "Kiyotaka Ijichi", rarity: "R", image: "./assets/img/chars/Rijichi.png" },
            4: { id: 4, name: "Kaito Yuki", rarity: "R", image: "./assets/img/chars/Rkaito.png" },
            5: { id: 5, name: "Maki Zenin", rarity: "R", image: "./assets/img/chars/Rmaki.png" },
            6: { id: 6, name: "Megumi Fushiguro", rarity: "R", image: "./assets/img/chars/Rmegumi.png" },
            7: { id: 7, name: "Nobara Kugisaki", rarity: "R", image: "./assets/img/chars/Rnobara.png" },
            8: { id: 8, name: "Panda", rarity: "R", image: "./assets/img/chars/Rpanda.png" },
            9: { id: 9, name: "Saki Rindo", rarity: "R", image: "./assets/img/chars/Rrindo.png" },
        
            /* Characters Rank SR (Global Banner) */
            10: { id: 10, name: "Junpei Yoshino", rarity: "SR", image: "./assets/img/chars/SRjunpei.png" },
            11: { id: 11, name: "Kaito Yuki", rarity: "SR", image: "./assets/img/chars/SRkaito.png" },
            12: { id: 12, name: "Noritoshi Kamo", rarity: "SR", image: "./assets/img/chars/SRkamo.png" },
            13: { id: 13, name: "Mai Zenin", rarity: "SR", image: "./assets/img/chars/SRmai.png" },
            14: { id: 14, name: "Ultimate Mechamaru", rarity: "SR", image: "./assets/img/chars/SRmecha.png" },
            15: { id: 15, name: "Kasumi Miwa", rarity: "SR", image: "./assets/img/chars/SRmiwa.png" },
            16: { id: 16, name: "Momo Nishimiya", rarity: "SR", image: "./assets/img/chars/SRmomo.png" },
            17: { id: 17, name: "Kento Nanami", rarity: "SR", image: "./assets/img/chars/SRnanami.png" },
            18: { id: 18, name: "Saki Rindo", rarity: "SR", image: "./assets/img/chars/SRrindo.png" },
            19: { id: 19, name: "Aoi Todo", rarity: "SR", image: "./assets/img/chars/SRtodo.png" },
            20: { id: 20, name: "Masamichi Yaga", rarity: "SR", image: "./assets/img/chars/SRyaga.png" },
            21: { id: 21, name: "Shoko Ieiri", rarity: "SR", image: "./assets/img/chars/SRshoko.png" },
        
            /* Characters Rank SSR (Global Banner) */
            22: { id: 22, name: "Nobara Kugisaki", rarity: "SSR", image: "./assets/img/chars/SSRnobara.png" },
            23: { id: 23, name: "Satoru Gojo", rarity: "SSR", image: "./assets/img/chars/SSRgojo.png" },
            24: { id: 24, name: "Yuji Itadori", rarity: "SSR", image: "./assets/img/chars/SSRitadori.png" },
            25: { id: 25, name: "Maki Zenin", rarity: "SSR", image: "./assets/img/chars/SSRmaki.png" },
            26: { id: 26, name: "Megumi Fushiguro", rarity: "SSR", image: "./assets/img/chars/SSRmegumi.png" },
            27: { id: 27, name: "Kento Nanami", rarity: "SSR", image: "./assets/img/chars/SSRnanami.png" },
            28: { id: 28, name: "Aoi Todo", rarity: "SSR", image: "./assets/img/chars/SSRtodo.png" },
            29: { id: 29, name: "Panda", rarity: "SSR", image: "./assets/img/chars/SSRpanda.png" },
        
            /* Characters (megumidomain) */
            30: { id: 30, name: "Megumi Fushiguro (Domain Expansion)", rarity: "SSR", image: "./assets/img/chars/megumi_domain/SSRmegumi_domain.png" },
        
            /* Characters (jjk0) */
            31: { id: 31, name: "Panda", rarity: "SR", image: "./assets/img/chars/banner_0/SRpanda.png" },
            32: { id: 32, name: "Toge Inumaki", rarity: "SR", image: "./assets/img/chars/banner_0/SRtoge.png" },
            33: { id: 33, name: "Yuta Okkotsu", rarity: "SSR", image: "./assets/img/chars/banner_0/SSRyuta.png" },
            34: { id: 34, name: "Suguru Geto", rarity: "SSR", image: "./assets/img/chars/banner_0/SSRgeto.png" },
        
            /* Characters (purplegojo) */
            35: { id: 35, name: "Gojo (Hollow Purple)", rarity: "SSR", image: "./assets/img/chars/banner_purple/SSRpurpleGojo.png" },
        
            /* Characters (deities) */
            36: { id: 36, name: "Gojo (Domain Expansion)", rarity: "SSR", image: "./assets/img/chars/banner_deities/SSRgojodomain.png" },
            37: { id: 37, name: "Ryomen Sukuna", rarity: "SSR", image: "./assets/img/chars/banner_deities/SSRsukuna.png" },
        
            /* Characters (tokyoprodigies) */
            38: { id: 38, name: "Itadori (Kokusen)", rarity: "SSR", image: "./assets/img/chars/banner_prodigies/SSRitadorikokusen.png" },
            39: { id: 39, name: "Megumi (Dogs)", rarity: "SSR", image: "./assets/img/chars/banner_prodigies/SSRmegumidogs.png" },
            40: { id: 40, name: "Nobara (Nails)", rarity: "SSR", image: "./assets/img/chars/banner_prodigies/SSRnobaranails.png" },
            41: { id: 41, name: "Inumaki (Scream)", rarity: "SSR", image: "./assets/img/chars/banner_prodigies/SSRinumakiscream.png" },
        
            /* Characters (sisters) */
            42: { id: 42, name: "Maki (Weapon)", rarity: "SSR", image: "./assets/img/chars/banner_sisters/SSRmakiweapon.png" },
            43: { id: 43, name: "Mai (Weapon)", rarity: "SSR", image: "./assets/img/chars/banner_sisters/SSRmaiweapon.png" },
        
            /* Characters (teachers) */
            44: { id: 44, name: "Yoshinobu Gakuganji", rarity: "SSR", image: "./assets/img/chars/banner_teachers/SSRgakuganji.png" },
            45: { id: 45, name: "Masamichi Yaga", rarity: "SSR", image: "./assets/img/chars/banner_teachers/SSRyaga.png" },
        
            /* Characters (villains) */
            46: { id: 46, name: "Hanami", rarity: "SSR", image: "./assets/img/chars/banner_villains/SSRhanamibirkin.png" },
            47: { id: 47, name: "Jogo", rarity: "SSR", image: "./assets/img/chars/banner_villains/SSRjogo.png" },
            48: { id: 48, name: "Mahito", rarity: "SSR", image: "./assets/img/chars/banner_villains/SSRmahito.png" },
        
            /* Characters (momopose) */
            49: { id: 49, name: "Momo (Weird Pose)", rarity: "SSR", image: "./assets/img/chars/banner_momo/SSRmomoweirdpose.png" },
        
            /* Characters (poorgirl) */
            50: { id: 50, name: "Miwa (Slash)", rarity: "SSR", image: "./assets/img/chars/banner_miwa/SSRmiwa.png" },
        
            /* Characters (kamodude) */
            51: { id: 51, name: "Kamo (Ketchup)", rarity: "SSR", image: "./assets/img/chars/banner_kamo/SSRkamoketchup.png" },
        
            /* Characters (miguel) */
            52: { id: 52, name: "Miguel", rarity: "SSR", image: "./assets/img/chars/banner_miguel/SSRmipana.png" },
        
            /* Characters (influencer) */
            53: { id: 53, name: "Nobara (Best Girl)", rarity: "SSR", image: "./assets/img/chars/banner_nobara/SSRnobarabestgirl.png" },
        
            /* Characters (punchingbanner) */
            54: { id: 54, name: "Saki Rindo (Punch Girl)", rarity: "SSR", image: "./assets/img/chars/banner_saki/SSRsaki.png" },
            55: { id: 55, name: "Nanami (Cursed Energy)", rarity: "SSR", image: "./assets/img/chars/banner_nanami/SSRnanamienergy.png" },
            56: { id: 56, name: "Itadori (Rasengan)", rarity: "SSR", image: "./assets/img/chars/banner_itadori/SSRitadori.png" },
        
            /* Characters (workers) */
            57: { id: 57, name: "Nanami (Daddy)", rarity: "SSR", image: "./assets/img/chars/banner_overtime/SSRnanami.png" },
            58: { id: 58, name: "Toji Fushiguro", rarity: "SSR", image: "./assets/img/chars/banner_toji/SSRbeast.png" },
        
            /* Characters (itadoriwinter) */
            59: { id: 59, name: "Itadori (Winter Guy)", rarity: "SSR", image: "./assets/img/chars/banner_itadori/SSRitadorichill.png" },
        
            /* Characters (junpeiboy) */
            60: { id: 60, name: "Junpei (couldbefriends)", rarity: "SSR", image: "./assets/img/chars/banner_junpei/SSRjunpeicouldbe.png" },
        
            /* Characters (teens) */
            61: { id: 61, name: "Gojo (Teen)", rarity: "SSR", image: "./assets/img/chars/banner_teens/SSRgojoteen.png" },
            62: { id: 62, name: "Geto (Teen)", rarity: "SSR", image: "./assets/img/chars/banner_teens/SSRgetoteen.png" },
        
            /* Characters (originals) */
            63: { id: 63, name: "ORIGINAL GOJO", rarity: "SSR", image: "./assets/img/chars/banner_originals/SSRgojoog.png" },
            64: { id: 64, name: "ORIGINAL ITADORI", rarity: "SSR", image: "./assets/img/chars/banner_originals/SSRitadoriog.png" },
            65: { id: 65, name: "ORIGINAL MAHITO", rarity: "SSR", image: "./assets/img/chars/banner_originals/SSRmahitoog.png" },

            /* Characters (shibuya) */
            66: { id: 66, name: "Jiro Awasaka", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRawasaka.png" },
            67: { id: 67, name: "Choso", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRchoso.png" },
            68: { id: 68, name: "Suguru Geto (Brain)", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRgeto.png" },
            69: { id: 69, name: "Satoru Gojo (Tired)", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRgojotired.png" },
            70: { id: 70, name: "Granny and Grandson", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRgranny.png" },
            71: { id: 71, name: "Haruta Shigemo", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRharuta.png" },
            72: { id: 72, name: "Yuji Itadori (Trauma)", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRitadoritrauma.png" },
            73: { id: 73, name: "Atsuya Kusakabe", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRkusakabe.png" },
            74: { id: 74, name: "Megumi Fushiguro (Summoning)", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRmegumimahoraga.png" },
            75: { id: 75, name: "Kugisaki Nobara (Mocking)", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRnobaralaugh.png" },
            76: { id: 76, name: "Takuma Ino", rarity: "SR", image: "./assets/img/chars/banner_shibuya/SRtakumaino.png" },
            77: { id: 77, name: "Dagon", rarity: "SSR", image: "./assets/img/chars/banner_shibuya/SSRdagon.png" },
            78: { id: 78, name: "Mahoraga", rarity: "SSR", image: "./assets/img/chars/banner_shibuya/SSRmahoraga.png" },
            79: { id: 79, name: "Mei Mei", rarity: "SSR", image: "./assets/img/chars/banner_shibuya/SSRmeimeipred.png" },
            80: { id: 81, name: "Toji (Reanimated)", rarity: "SSR", image: "./assets/img/chars/banner_shibuya/SSRtojireanimated.png" },
            81: { id: 81, name: "Yuki Tsukumo", rarity: "SSR", image: "./assets/img/chars/banner_shibuya/SSRyuki.png" },
        });     
    }
    
}

ipcMain.handle('getCharacters', () => {
    if (!store) return {};
    return store.get('characters');
});

function initializeAchievements() {
    if (!store.get('achievements')) {
        store.set('achievements', {
            SSR_10: {
                id: 'SSR_10',
                title: 'Sorcerer Grade B',
                description: 'Collect 10 SSR characters',
                progress: 0,
                target: 10,
                completed: false,
                reward: 1500,  // 1.5 multi pulls
                type: 'collection_SSR'
            },
            SSR_25: {
                id: 'SSR_25',
                title: 'Sorcerer Grade A',
                description: 'Collect 25 SSR characters',
                progress: 0,
                target: 25,    
                completed: false,
                reward: 3000,  // 3 multi pulls
                type: 'collection_SSR'
            },
            SSR_50: {
                id: 'SSR_50',
                title: 'Sorcerer Grade S',
                description: 'Collect 50 SSR characters',
                progress: 0,
                target: 50,    
                completed: false,
                reward: 5000,  // 5.5 multi pulls
                type: 'collection_SSR'
            },
            SSR_100: {
                id: 'SSR_100',
                title: 'Above everyone else',
                description: 'Collect 100 SSR characters',
                progress: 0,
                target: 100,   
                completed: false,
                reward: 9000,  // 10 multi pulls
                type: 'collection_SSR'
            },
            SR_10: {
                id: 'SR_10',
                title: 'Cursed Spirit B',
                description: 'Collect 10 SR characters',
                progress: 0,
                target: 10,
                completed: false,
                reward: 500,   // 5 single pulls
                type: 'collection_SR'
            },
            SR_25: {
                id: 'SR_25',
                title: 'Cursed Spirit A',
                description: 'Collect 25 SR characters',
                progress: 0,
                target: 25,    
                completed: false,
                reward: 1000,  // 10 single pulls
                type: 'collection_SR'
            },
            SR_50: {
                id: 'SR_50',
                title: 'Cursed Spirit S',
                description: 'Collect 50 SR characters',
                progress: 0,
                target: 50,    
                completed: false,
                reward: 2000,  // 20 single pulls
                type: 'collection_SR'
            },
            SR_100: {
                id: 'SR_100',
                title: 'Stand Proud',
                description: 'Collect 100 SR characters',
                progress: 0,
                target: 100,   
                completed: false,
                reward: 3500,  // ~4 multi pulls
                type: 'collection_SR'
            },
            GACHA_100: {
                id: 'GACHA_100',
                title: '1 finger',
                description: 'Perform 100 rolls',
                progress: 0,
                target: 100,
                completed: false,
                reward: 1500,  // 1.5 multi pulls
                type: 'rolls'
            },
            GACHA_250: {
                id: 'GACHA_250',
                title: '5 fingers',
                description: 'Perform 250 rolls',
                progress: 0,
                target: 250,  
                completed: false,
                reward: 3000,  // 3 multi pulls
                type: 'rolls'
            },
            GACHA_500: {
                id: 'GACHA_500',
                title: '10 fingers',
                description: 'Perform 500 rolls',
                progress: 0,
                target: 500,  
                completed: false,
                reward: 5000,  // 5.5 multi pulls
                type: 'rolls'
            },
            GACHA_750: {
                id: 'GACHA_750',
                title: '15 fingers',
                description: 'Perform 750 rolls',
                progress: 0,
                target: 750, 
                completed: false,
                reward: 7000,  // ~8 multi pulls
                type: 'rolls'
            },
            GACHA_1000: {
                id: 'GACHA_1000',
                title: 'Run',
                description: 'Perform 1000 rolls',
                progress: 0,
                target: 1000, 
                completed: false,
                reward: 10000,  // ~11 multi pulls
                type: 'rolls'
            },
            FAVORITE_COLLECTOR: {
                id: 'FAVORITE_COLLECTOR',
                title: 'Look at these guys',
                description: 'Add 3 characters to favorites',
                progress: 0,
                target: 3,
                completed: false,
                reward: 500,
                type: 'favorites'
            }
        });
    }
}

ipcMain.handle('getAchievements', () => {
    if (!store) return {};
    return store.get('achievements');
});

ipcMain.handle('checkAchievements', () => {
    if (!store) return { updated: false, achievements: {} };

    const achievements = store.get('achievements') || {};
    const userData = store.get('userData') || { inventory: [], rollHistory: [], currency: 0, favorites: [] };
    const characters = store.get('characters') || {};

    if (userData.isCheater) {
        return { 
            updated: false, 
            achievements: achievements 
        };
    }

    let updated = false;

    // Function to handle updating achievements
    function updateAchievement(type, progress, targets) {
        targets.forEach(target => {
            const achievementKey = `${type}_${target}`;
            const achievement = achievements[achievementKey];
            if (achievement && achievement.progress !== progress) {
                achievement.progress = progress;
                if (progress >= achievement.target && !achievement.completed) {
                    achievement.completed = true;
                    userData.currency += achievement.reward;
                    updated = true;
                }
            }
        });
    }

    // Update SSR achievements
    const ssrCount = userData.inventory.filter(id => characters[id]?.rarity === 'SSR').length;
    updateAchievement('SSR', ssrCount, [10, 25, 50, 100]);

    // Update SR achievements
    const srCount = userData.inventory.filter(id => characters[id]?.rarity === 'SR').length;
    updateAchievement('SR', srCount, [10, 25, 50, 100]);

    // Update roll achievements
    const rollCount = userData.rollHistory.length;
    updateAchievement('GACHA', rollCount, [100, 250, 500, 750, 1000]);

    // Update FAVORITE_COLLECTOR achievement
    const favoriteCount = userData.favorites ? userData.favorites.length : 0;
    const favoriteAchievement = achievements.FAVORITE_COLLECTOR;
    if (favoriteAchievement && favoriteAchievement.progress !== favoriteCount) {
        favoriteAchievement.progress = favoriteCount;
        if (favoriteCount >= favoriteAchievement.target && !favoriteAchievement.completed) {
            favoriteAchievement.completed = true;
            userData.currency += favoriteAchievement.reward;
            updated = true;
        }
    }

    // Save updated data
    if (updated) {
        store.set('achievements', achievements);
        store.set('userData', userData);
    }

    return { updated, achievements };
});

app.disableHardwareAcceleration();


function createAlertWindow() {
    const alertWin = new BrowserWindow({
        width: 600,
        height: 550,
        resizable: false,
        movable: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        modal: true,
        parent: BrowserWindow.getAllWindows()[0],
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    alertWin.loadFile(path.join(__dirname, 'alert', 'alert.html'));
}


function createWindow() {
    const win = new BrowserWindow({
        minWidth: 1280,
        minHeight: 720,
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            accelerator: false
        }
    });

    win.loadFile(path.join(__dirname, 'login', 'login.html'));
}

app.whenReady().then(() => {
    
    createWindow();
    createAlertWindow();
});


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


ipcMain.handle('setUserData', (event, { username, icon }) => {
    if (!store) return { success: false, message: 'Store not initialized!' };
    
    const userData = store.get('userData');

    const normalizedUsername = username.toLowerCase();
    const bonus = getSpecialUsernameBonuses(username, userData.usedSpecialUsernames);

    if (username.toLowerCase() === 'cheater') {
        userData.isCheater = true;
    }
    
    userData.username = username;
    userData.icon = icon;
    
    if (bonus > 0) {
        userData.currency += bonus;
        userData.usedSpecialUsernames.push(normalizedUsername);
    }

    store.set('userData', userData);
    return { 
        success: true,
        bonus: bonus 
    };
});

ipcMain.handle('setFavorites', (event, favoriteIds) => {
    if (!store) return { success: false, message: 'Store not initialized!' };

    const userData = store.get('userData');
    userData.favorites = favoriteIds;
    store.set('userData', userData);

    return { success: true };
});


ipcMain.handle('getUserData', () => {
    if (!store) return { currency: 1000, inventory: [], rollHistory: [] };
    return store.get('userData');
});

ipcMain.handle('updateUserData', (event, userData) => {
    if (!store) return { success: false, message: 'Store not initialized!' };
    store.set('userData', userData);
    return { success: true };
});

function rollCharacter(bannerType, isMulti = false) {
    const banners = {
        standard: {
            name: "Standard",
            rates: {
                normal: {
                    R: 85,
                    SR: 13,
                    SSR: 2
                },
                multi: {
                    R: 80,  // 
                    SR: 15, // 
                    SSR: 5 // 
                }
            },
            featured: [],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
        },
        jjk0: {
            name: "Jujutsu Kaisen 0",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [31, 32, 33, 34],
            exclude: [30, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        megumidomain: {
            name: "YOU ARE TRAPPED WITH ME",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [30],
            exclude: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        momopose: {
            name: "Why Pose Like That?",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [49],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        junpeiboy: {
            name: "We Could Have Been Good Friends...",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [60],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        tokyoprodigies: {
            name: "Tokyo Beasts",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [38, 39, 40, 41],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        kamodude: {
            name: "Want some ketchup?",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [51],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        miguel: {
            name: "Mi Pana Miguel",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [52],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        poorgirl: {
            name: "Please, I Need The Money",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [50],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        punchingbanner: {
            name: "Left, Right, Good Night",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [54, 55, 56],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        sisters: {
            name: "Siters On Arms",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [42, 43],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        teachers: {
            name: "Did you study?",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [44, 45],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        influencer: {
            name: "Nobara (Best Girl)",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [53],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        itadoriwinter: {
            name: "Winter Boy",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [59],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        purplegojo: {
            name: "Let's get a little serious...",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [35],
            exclude: [30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        villains: {
            name: "Bad Guys",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [46, 47, 48],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        workers: {
            name: "Working Overtime",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [57, 58],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        teens: {
            name: "Powerful Teenagers",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [61, 62],
            exclude: [30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        deities: {
            name: "We Broke The PowerScale",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [36, 37],
            exclude: [30, 31, 32, 33, 34, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        original: {
            name: "Original Creations",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [63, 64, 65],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            featuredRate: 0.7
        },
        shibuya: {
            name: "Shibuya Arc",
            rates: {
                normal: {
                    R: 80,
                    SR: 15,
                    SSR: 5
                },
                multi: {
                    R: 65,  
                    SR: 25, 
                    SSR: 10 
                }
            },
            featured: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
            exclude: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
            featuredRate: 0.7
        },
    };

    const characters = store.get('characters');

    const banner = banners[bannerType];
    if (!banner) return { success: false, message: "Invalid banner type" };

    
    const currentRates = isMulti ? banner.rates.multi : banner.rates.normal;
    const roll = Math.random() * 100;

    let rarity;
    if (roll <= currentRates.SSR) rarity = "SSR";
    else if (roll <= currentRates.SSR + currentRates.SR) rarity = "SR";
    else rarity = "R";

    let possibleCharacters = Object.values(characters).filter(char => 
        char.rarity === rarity
    );

    if (banner.exclude && banner.exclude.length > 0) {
        possibleCharacters = possibleCharacters.filter(char => !banner.exclude.includes(char.id));
    }

    if (rarity === "SSR" && banner.featured.length > 0) {
        const isFeatured = Math.random() < banner.featuredRate;
        if (isFeatured) {
            possibleCharacters = possibleCharacters.filter(char => banner.featured.includes(char.id));
        } else {
            possibleCharacters = possibleCharacters.filter(char => !banner.featured.includes(char.id));
        }
    }

    if (possibleCharacters.length === 0) {
        return { success: false, message: "No characters available for this rarity!" };
    }

    const character = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];

    return { 
        success: true, 
        character: character 
    };
}

ipcMain.handle('performRoll', (event, { bannerType, isMulti }) => {
    if (!store) return { success: false, message: 'Store not initialized!' };
    
    const userData = store.get('userData');
    const cost = isMulti ? 900 : 100;

    if (userData.currency < cost) {
        return { success: false, message: 'Not enough currency!' };
    }

    userData.currency -= cost;
    
    let results = [];
    const numRolls = isMulti ? 10 : 1;

    for (let i = 0; i < numRolls; i++) {
        const result = rollCharacter(bannerType, isMulti);  
        if (result.success) {
            userData.inventory.push(result.character.id);
            userData.rollHistory.push({
                characterId: result.character.id,
                timestamp: Date.now()
            });
            results.push(result.character);
        }
    }
    
    store.set('userData', userData);
    return { success: true, characters: results };
});


function handleDailyRewards() {
    if (!store) return;

    const userData = store.get('userData');
    const today = new Date().toDateString(); 

    if (userData.lastLogin !== today) {
        const rewardAmount = 3000; 
        userData.currency += rewardAmount;
        userData.lastLogin = today;

        store.set('userData', userData);
        console.log(`Daily reward granted: ${rewardAmount} coins.`);
    } else {
        console.log('Daily reward already claimed.');
    }
}

function getSpecialUsernameBonuses(username, usedSpecialUsernames) {
    const bonuses = {
        'megumi': 300,
        'nobara': 300,
        'maki': 500,
        'todo': 750,
        'itadori': 1000,
        'yuta': 2000,
        'gojo': 4999,
        'sukuna': 5000,
        'gege': 1,
        'cheater': 999999999,
    };
    
    const normalizedUsername = username.toLowerCase();
    
    if (usedSpecialUsernames.includes(normalizedUsername) || !bonuses[normalizedUsername]) {
        return 0;
    }
    
    return bonuses[normalizedUsername];
}
