const characters = {
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
    10: { id: 10, name: "Junpei Yoshino", rarity: "SR", image: "./assets/img/chars/SRJunpei.png" },
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
    65: { id: 65, name: "ORIGINAL MAHITO", rarity: "SSR", image: "./assets/img/chars/banner_originals/SSRmahitoog.png" }
    
};

module.exports = characters;