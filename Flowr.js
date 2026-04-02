/* TODO: 
 GARDEN:
 Petals:
 - Add Neutron Star
 - Add Clover
 - Add Amulet Of Grace 
 - Add Shiny Wing
 Mobs:
 - Add Shiny Soldier Ant
 - Add Shiny Queen
 - Add Shiny Ant Hole
 Misc:
  - Add Wave Timer
 DESERT:
 Petals:
 - Add Blood Leaf
 - Add Blood Rose
 - Add Horn
 - Add Salt
 - Add Blood Horn
 - Add Fire Missile
 - Add Compass
 - Add Dark Compass
 - Add Shade
 - Add Radience
 - Add Dust
 - Add Toxin
 - Fix Pincer
 Mobs:
 - Fix Sandstone (looks)
 - Add Tarantula
 - Add Evil Desert Centipede
 - Add Locust
 Misc:
- Add boss special abilities
OCEAN:
 Petals:
 - Add Carapace
 - Add Cutter
 - Add Coral
 - Add Jolt
 - Add Jellyfish Egg
 - Add Shiny Bubble
 - Add Spine
 - Add Amulet Of Time
 - Add Waterlogged Compass
 - Add Rubber
 - Add Sapphire
 - Add Plastic Egg
 - Add Trident
 - Add Blood Jolt
 - Add Dark Waterlogged Compass
 Mobs:
 - Add Urchin
 - Add Electric Eel
 - Add Dark Electric Eel
 - Add Seafloor Burrow
 - Add Whirlpool
 Misc:
 - Add the new biomes...
 Other:
 - Fix crashing 
*/
const Current_Player_Accounts = new Map();
const mutedUsers = new Map();
let PLAYER_ACCOUNTS = {};

async function loadPlayerAccounts() {
    try {
        const response = await fetch("/server/Player_Accounts.txt");
        const text = await response.text();

        const entries = text.split(/\[SAVE DATA\]\s*/g)
            .map(e => e.trim())
            .filter(e => e.startsWith("{") && e.endsWith("}"));

        for (const entry of entries) {
            try {
                const json = JSON.parse(entry);

                const accountName = json.aN || json.accountName;
                const accountPassword = json.aP || json.accountPassword;

                if (!accountName || !accountPassword) {
                    console.warn("Skipping malformed entry (missing name/password):", json);
                    continue;
                }

                PLAYER_ACCOUNTS[accountName] = {
                    username: accountName,
                    password: accountPassword,
                    data: {
                        aN: json.aN ?? accountName,
                        aP: json.aP ?? accountPassword,
                        sW: json.sW ?? 0,
                        L: json.L ?? 1,
                        XP: json.XP ?? 0,
                        TSP: json.TSP ?? [],
                        TSR: json.TSR ?? [],
                        BSP: json.BSP ?? [],
                        BSR: json.BSR ?? [],
                        I: json.I ?? {},
                        CPR: json.CPR ?? {},
                        CPP: json.CPP ?? {}
                    }
                };
            } catch (err) {
                console.warn("Skipping invalid JSON entry in Player_Accounts.txt:", err);
            }
        }

        console.log("[PLAYER_ACCOUNTS LOADED]", Object.keys(PLAYER_ACCOUNTS));
    } catch (err) {
        console.error("Failed to fetch Player_Accounts.txt:", err);
    }
}

loadPlayerAccounts().then(() => {
    console.log("PLAYER_ACCOUNTS ready:", PLAYER_ACCOUNTS);
});

const bossRarityDropTable = {
  0: [ // Common
    { rarity: 0, weight: 0.5, value: 10, jackpot: 0 }
  ],
  1: [ // Unusual
    { rarity: 0, weight: 0.75, value: 35, jackpot: 0 },
    { rarity: 1, weight: 0.25, value: 5, jackpot: 0 }
  ],
  2: [ // Rare
    { rarity: 0, weight: 0.431, value: 90, jackpot: 0 },
    { rarity: 1, weight: 0.504, value: 20, jackpot: 0 },
    { rarity: 2, weight: 0.0661, value: 2, jackpot: 0 }
  ],
  3: [ // Epic
    { rarity: 0, weight: 0.00014, value: 200, jackpot: 0 },
    { rarity: 1, weight: 0.455, value: 60, jackpot: 0 },
    { rarity: 2, weight: 0.454, value: 7, jackpot: 0 },
    { rarity: 3, weight: 0.0289, value: 1, jackpot: 0 }
  ],
  4: [ // Legendary
    { rarity: 1, weight: 0.0106, value: 250, jackpot: 0 },
    { rarity: 2, weight: 0.821, value: 15, jackpot: 0 },
    { rarity: 3, weight: 0.155, value: 3, jackpot: 0 },
  ],
  5: [ // Mythic
    { rarity: 2, weight: 0.0189, value: 150, jackpot: 0 },
    { rarity: 3, weight: 0.703, value: 90, jackpot: 0 },
    { rarity: 4, weight: 0.279, value: 2, jackpot: 0 }
  ],
  6: [ // Ultra
    { rarity: 3, weight: 0.0384, value: 400, jackpot: 0 },
    { rarity: 4, weight: 0.904, value: 300, jackpot: 0 },
    { rarity: 5, weight: 0.058, value: 100, jackpot: 0 }
  ],
  7: [ // Super
    { rarity: 4, weight: 0.15, value: 600, jackpot: 0 },
    { rarity: 5, weight: 0.83, value: 200, jackpot: 0 },
    { rarity: 6, weight: 0.0209, value: 3, jackpot: 0 }
  ],
  8: [ // Omega
    { rarity: 5, weight: 0.2, value: 600, jackpot: 0 },
    { rarity: 6, weight: 0.75, value: 50, jackpot: 0 },
    { rarity: 7, weight: 0.05, value: 1, jackpot: 0 },
  ],
  9: [ // Fabled
    { rarity: 5, weight: 0.2, value: 5000, jackpot: 0 },
    { rarity: 6, weight: 0.75, value: 500, jackpot: 0 },
    { rarity: 7, weight: 0.05, value: 20, jackpot: 0 }
  ],
  10: [ // Divine
    { rarity: 6, weight: 0.2, value: 1500, jackpot: 0 },
    { rarity: 7, weight: 0.75, value: 200, jackpot: 0 },
    { rarity: 8, weight: 0.05, value: 5, jackpot: 0 }
  ],
  11: [ // Supreme
    { rarity: 7, weight: 0.2, value: 5000, jackpot: 0 },
    { rarity: 8, weight: 0.75, value: 1000, jackpot: 0 },
    { rarity: 9, weight: 0.05, value: 5, jackpot: 0 }
  ],
  12: [ // Omnipotent
    { rarity: 8, weight: 0.1, value: 7000, jackpot: 0 },
    { rarity: 9, weight: 0.85, value: 100, jackpot: 0 },
    { rarity: 10, weight: 0.05, value: 5, jackpot: 0 }
  ],
  13: [ // Astral
    { rarity: 9, weight: 0.1, value: 5000, jackpot: 0 },
    { rarity: 10, weight: 0.85, value: 250, jackpot: 0 },
    { rarity: 11, weight: 0.05, value: 5, jackpot: 0 }
  ],

  14: [ // Celestial (bottom drop is jackpot)
    { rarity: 10, weight: 0.1, value: 2000, jackpot: 0 }, 
    { rarity: 11, weight: 0.85, value: 25, jackpot: 0 }, 
    { rarity: 11, weight: 0.05, value: 50, jackpot: 1 } 
  ],

  15: [ // Seraphic
    { rarity: 10, weight: 0.75, value: 10000, jackpot: 0 },
    { rarity: 11, weight: 0.25, value: 300, jackpot: 0 },
  ],
  16: [ // Transcendent
    { rarity: 11, weight: 0.1, value: 200, jackpot: 0 },
    { rarity: 11, weight: 0.85, value: 600, jackpot: 0 },
    { rarity: 12, weight: 0.05, value: 15, jackpot: 1 }
  ],
  17: [ // Ethereal
    { rarity: 11, weight: 0.1, value: 15000, jackpot: 0 },
    { rarity: 12, weight: 0.85, value: 30, jackpot: 0 },
    { rarity: 12, weight: 0.05, value: 150, jackpot: 1 }
  ],
  18: [ // Galactic
    { rarity: 12, weight: 0.2495, value: 1000, jackpot: 0 },
    { rarity: 12, weight: 0.75, value: 3000, jackpot: 0 },
    { rarity: 13, weight: 0.005, value: 15, jackpot: 0 }
  ],
  19: [ // Eternal
    { rarity: 11, weight: 0.18, value: 50000, jackpot: 0 },
    { rarity: 12, weight: 0.4, value: 5000, jackpot: 0 },
    { rarity: 12, weight: 0.3, value: 10000, jackpot: 0 },
    { rarity: 13, weight: 0.1, value: 30, jackpot: 0 },
    { rarity: 13, weight: 0.02, value: 100, jackpot: 1 }
  ],
  20: [ // Apotheotic
    { rarity: 12, weight: 0.5, value: 10000, jackpot: 0 },
    { rarity: 12, weight: 0.3, value: 50000, jackpot: 0 },
    { rarity: 12, weight: 0.1, value: 100000, jackpot: 0 },
    { rarity: 13, weight: 0.09, value: 60, jackpot: 0 },
    { rarity: 13, weight: 0.01, value: 180, jackpot: 1 }
  ],
  21: [ // Voidbound
    { rarity: 12, weight: 0.5, value: 15000, jackpot: 0 },
    { rarity: 12, weight: 0.3, value: 25000, jackpot: 0 },
    { rarity: 12, weight: 0.1, value: 35000, jackpot: 0 },
    { rarity: 13, weight: 0.05, value: 20, jackpot: 0 },
    { rarity: 13, weight: 0.04, value: 60, jackpot: 0 },
    { rarity: 13, weight: 0.01, value: 100, jackpot: 1 }
  ],
  22: [ // Exalted
    { rarity: 12, weight: 0.5, value: 50000, jackpot: 0 },
    { rarity: 12, weight: 0.3, value: 100000, jackpot: 0 },
    { rarity: 12, weight: 0.1, value: 25000, jackpot: 0 },
    { rarity: 13, weight: 0.05, value: 50, jackpot: 0 },
    { rarity: 13, weight: 0.04, value: 150, jackpot: 1 },
    { rarity: 14, weight: 0.01, value: 3, jackpot: 1 }
  ],
  23: [ // Chaos
    { rarity: 12, weight: 0.5, value: 300000, jackpot: 0 },
    { rarity: 12, weight: 0.3, value: 600000, jackpot: 0 },
    { rarity: 13, weight: 0.1, value: 250, jackpot: 0 },
    { rarity: 13, weight: 0.05, value: 600, jackpot: 0 },
    { rarity: 14, weight: 0.04, value: 3, jackpot: 1 },
    { rarity: 14, weight: 0.01, value: 10, jackpot: 1 }
  ],
  24: [ // Cataclysmic
    { rarity: 13, weight: 0.5, value: 1250, jackpot: 0 },
    { rarity: 13, weight: 0.3, value: 3000, jackpot: 0 },
    { rarity: 13, weight: 0.1, value: 6000, jackpot: 0 },
    { rarity: 14, weight: 0.04, value: 30, jackpot: 0 },
    { rarity: 14, weight: 0.0399, value: 60, jackpot: 1 },
    { rarity: 14, weight: 0.02, value: 120, jackpot: 1 },
    { rarity: 15, weight: 0.001, value: 3, jackpot: 1 }
  ],
  25: [ // Nullborne
    { rarity: 13, weight: 0.5, value: 3000, jackpot: 0 },
    { rarity: 13, weight: 0.3, value: 6000, jackpot: 0 },
    { rarity: 13, weight: 0.1, value: 12000, jackpot: 0 },
    { rarity: 14, weight: 0.04, value: 60, jackpot: 0 },
    { rarity: 14, weight: 0.0398, value: 120, jackpot: 0 },
    { rarity: 14, weight: 0.02, value: 350, jackpot: 1 },
    { rarity: 15, weight: 0.001, value: 6, jackpot: 1 },
    { rarity: 15, weight: 0.001, value: 12, jackpot: 1 }
  ]
};

const rarityDropTable = {
  0: [ // Common
    { rarity: 0, weight: 0.216, value: 1, jackpot: 0 }
  ],
  1: [ // Unusual
    { rarity: 0, weight: 0.59, value: 1, jackpot: 0 },
    { rarity: 1, weight: 0.112, value: 1, jackpot: 0 }
  ],
  2: [ // Rare
    { rarity: 0, weight: 0.431, value: 1, jackpot: 0 },
    { rarity: 1, weight: 0.504, value: 1, jackpot: 0 },
    { rarity: 2, weight: 0.0661, value: 1, jackpot: 0 }
  ],
  3: [ // Epic
    { rarity: 0, weight: 0.00014, value: 1, jackpot: 0 },
    { rarity: 1, weight: 0.455, value: 1, jackpot: 0 },
    { rarity: 2, weight: 0.454, value: 1, jackpot: 0 },
    { rarity: 3, weight: 0.0289, value: 1, jackpot: 0 }
  ],
  4: [ // Legendary
    { rarity: 1, weight: 0.0106, value: 1, jackpot: 0 },
    { rarity: 2, weight: 0.821, value: 1, jackpot: 0 },
    { rarity: 3, weight: 0.155, value: 1, jackpot: 0 },
    { rarity: 4, weight: 0.0151, value: 1, jackpot: 0 }
  ],
  5: [ // Mythic
    { rarity: 2, weight: 0.0189, value: 1, jackpot: 0 },
    { rarity: 3, weight: 0.703, value: 1, jackpot: 0 },
    { rarity: 4, weight: 0.279, value: 1, jackpot: 0 }
  ],
  6: [ // Ultra
    { rarity: 3, weight: 0.0384, value: 1, jackpot: 0 },
    { rarity: 4, weight: 0.904, value: 1, jackpot: 0 },
    { rarity: 5, weight: 0.058, value: 1, jackpot: 0 }
  ],
  7: [ // Super
    { rarity: 4, weight: 0.15, value: 1, jackpot: 0 },
    { rarity: 5, weight: 0.83, value: 1, jackpot: 0 },
    { rarity: 6, weight: 0.0209, value: 1, jackpot: 0 }
  ],
  8: [ // Omega
    { rarity: 5, weight: 0.202, value: 1, jackpot: 0 },
    { rarity: 6, weight: 0.79, value: 1, jackpot: 0 },
    { rarity: 7, weight: 0.0088, value: 1, jackpot: 0 }
  ],
  9: [ // Fabled
    { rarity: 6, weight: 0.278, value: 1, jackpot: 0 },
    { rarity: 7, weight: 0.723, value: 1, jackpot: 0 }
  ],
  10: [ // Divine
    { rarity: 6, weight: 0.00001, value: 1, jackpot: 0 },
    { rarity: 7, weight: 0.394, value: 1, jackpot: 0 },
    { rarity: 8, weight: 0.607, value: 1, jackpot: 0 }
  ],
  11: [ // Supreme
    { rarity: 7, weight: 0.0008, value: 1, jackpot: 0 },
    { rarity: 8, weight: 0.553, value: 1, jackpot: 0 },
    { rarity: 9, weight: 0.448, value: 1, jackpot: 0 }
  ],
  12: [ // Omnipotent
    { rarity: 8, weight: 0.01, value: 1, jackpot: 0 },
    { rarity: 9, weight: 0.876, value: 1, jackpot: 0 },
    { rarity: 10, weight: 0.315, value: 1, jackpot: 0 }
  ],
  13: [ // Astral
    { rarity: 9, weight: 0.0333, value: 1, jackpot: 0 },
    { rarity: 10, weight: 0.723, value: 1, jackpot: 0 },
    { rarity: 11, weight: 0.244, value: 1, jackpot: 0 }
  ],

  14: [ // Celestial (bottom drop is jackpot)
    { rarity: 10, weight: 0.356, value: 3, jackpot: 0 }, 
    { rarity: 11, weight: 0.638, value: 3, jackpot: 0 }, 
    { rarity: 10, weight: 0.007, value: 4000, jackpot: 1 } 
  ],

  15: [ // Seraphic
    { rarity: 10, weight: 0.0612, value: 10, jackpot: 0 },
    { rarity: 11, weight: 0.921, value: 10, jackpot: 0 },
    { rarity: 12, weight: 0.0187, value: 1, jackpot: 0 }
  ],
  16: [ // Transcendent
    { rarity: 11, weight: 0.659, value: 60, jackpot: 0 },
    { rarity: 12, weight: 0.329, value: 1, jackpot: 0 },
    { rarity: 11, weight: 0.0139, value: 1500, jackpot: 1 }
  ],
  17: [ // Ethereal
    { rarity: 11, weight: 0.209, value: 300, jackpot: 0 },
    { rarity: 12, weight: 0.741, value: 4, jackpot: 0 },
    { rarity: 12, weight: 0.0511, value: 40, jackpot: 1 }
  ],
  18: [ // Galactic
    { rarity: 12, weight: 0.0575, value: 4, jackpot: 0 },
    { rarity: 12, weight: 0.926, value: 40, jackpot: 0 },
    { rarity: 13, weight: 0.0173, value: 1, jackpot: 0 }
  ],
  19: [ // Eternal
    { rarity: 12, weight: 0.741, value: 100, jackpot: 0 },
    { rarity: 13, weight: 0.247, value: 2, jackpot: 0 },
    { rarity: 12, weight: 0.01, value: 1500, jackpot: 0 },
    { rarity: 13, weight: 0.0023, value: 12, jackpot: 0 },
    { rarity: 12, weight: 0.0007, value: 9000, jackpot: 1 }
  ],
  20: [ // Apotheotic
    { rarity: 12, weight: 0.302, value: 360, jackpot: 0 },
    { rarity: 12, weight: 0.649, value: 1800, jackpot: 0 },
    { rarity: 13, weight: 0.0388, value: 18, jackpot: 0 },
    { rarity: 12, weight: 0.0089, value: 12000, jackpot: 0 },
    { rarity: 13, weight: 0.0026, value: 100, jackpot: 1 }
  ],
  21: [ // Voidbound
    { rarity: 13, weight: 0.0696, value: 6, jackpot: 0 },
    { rarity: 13, weight: 0.823, value: 24, jackpot: 0 },
    { rarity: 13, weight: 0.0828, value: 96, jackpot: 0 },
    { rarity: 13, weight: 0.0195, value: 192, jackpot: 0 },
    { rarity: 13, weight: 0.0044, value: 384, jackpot: 0 },
    { rarity: 13, weight: 0.0013, value: 768, jackpot: 1 }
  ],
  22: [ // Exalted
    { rarity: 13, weight: 0.0025, value: 24, jackpot: 0 },
    { rarity: 12, weight: 0.771, value: 25000, jackpot: 0 },
    { rarity: 14, weight: 0.171, value: 1, jackpot: 0 },
    { rarity: 14, weight: 0.0431, value: 3, jackpot: 0 },
    { rarity: 12, weight: 0.0099, value: 600000, jackpot: 1 },
    { rarity: 13, weight: 0.0029, value: 4500, jackpot: 1 }
  ],
  23: [ // Chaos
    { rarity: 14, weight: 0.526, value: 1, jackpot: 0 },
    { rarity: 14, weight: 0.341, value: 3, jackpot: 0 },
    { rarity: 13, weight: 0.103, value: 3000, jackpot: 0 },
    { rarity: 13, weight: 0.0243, value: 6000, jackpot: 0 },
    { rarity: 14, weight: 0.0055, value: 40, jackpot: 1 },
    { rarity: 14, weight: 0.0015, value: 80, jackpot: 1 }
  ],
  24: [ // Cataclysmic
    { rarity: 14, weight: 0.0764, value: 3, jackpot: 0 },
    { rarity: 14, weight: 0.487, value: 10, jackpot: 0 },
    { rarity: 14, weight: 0.316, value: 30, jackpot: 0 },
    { rarity: 14, weight: 0.0919, value: 60, jackpot: 0 },
    { rarity: 14, weight: 0.0218, value: 120, jackpot: 1 },
    { rarity: 15, weight: 0.0049, value: 1, jackpot: 1 },
    { rarity: 15, weight: 0.0014, value: 3, jackpot: 1 }
  ],
  25: [ // Nullborne
    { rarity: 13, weight: 0.0181, value: 3000, jackpot: 0 },
    { rarity: 14, weight: 0.39, value: 27, jackpot: 0 },
    { rarity: 13, weight: 0.41, value: 20000, jackpot: 0 },
    { rarity: 15, weight: 0.137, value: 1, jackpot: 0 },
    { rarity: 15, weight: 0.0337, value: 3, jackpot: 0 },
    { rarity: 14, weight: 0.0076, value: 2500, jackpot: 1 },
    { rarity: 15, weight: 0.0017, value: 15, jackpot: 1 },
    { rarity: 14, weight: 0.0005, value: 12000, jackpot: 1 }
  ]
};

function getDropResult(mobRarity, isBoss = false) {
    const table = (isBoss ? bossRarityDropTable : rarityDropTable)[mobRarity];
    if (!table || !table.length) {
        return { rarity: mobRarity, value: 1, jackpot: 0 };
    }


    const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const entry of table) {
        roll -= entry.weight;
        if (roll <= 0) {
            return { 
                rarity: entry.rarity, 
                value: entry.value || 1,
                jackpot: entry.jackpot || 0
            };
        }
    }
    const last = table[table.length - 1];
    return { 
        rarity: last.rarity, 
        value: last.value || 1,
        jackpot: last.jackpot || 0 
    };
}

function getTotalMobsForWave(wave, chosenWave = null) {
    const min = 23;
    const max = 415;
    const scale = 400;
    const growth = 0.92;

    if (wave <= 1) return Math.round(min);

    let total = min + (max - min) * Math.pow(wave / scale, growth);

    if (wave > 400) {
        const extra = wave - 400;
        total = max * Math.pow(1 + extra * 0.002, 0.85);
    }

    if (chosenWave && chosenWave.divider) {
        total = total / chosenWave.divider;
    }

    return Math.round(total);
}


globalThis.card_speed = 2500;
( () => {
    "use strict";
    var t, e, i, s, a = {
        28: (t, e, i) => {
            i.d(e, {
                I7: () => n,
                PW: () => s,
                _O: () => a
            });
            const s = (t, e=0) => t[e] | t[e + 1] << 8
              , a = t => {
                const e = unescape(encodeURIComponent(t))
                  , i = new Uint8Array(e.length + 1);
                for (let t = 0; t < e.length; t++)
                    i[t] = e.charCodeAt(t);
                return i[e.length] = 0,
                i
            }
              , n = (t, e=0) => {
                let i = ""
                  , s = e;
                for (; 0 !== t[s] && s < t.length; )
                    i += String.fromCharCode(t[s]),
                    s++;
                return decodeURIComponent(escape(i))
            }
        }
        ,
        58: (t, e, i) => {
            i.a(t, (async (t, e) => {
                try {
                    var s = i(512)
                      , a = i(110)
                      , n = i(446)
                      , h = i(904)
                      , r = i(111)
                      , o = i(28)
                      , l = i(874);
                    globalThis.gameState = s.A;
                    const gardenTables = [
                    {
                        name: "SpiderWave",
                        weight: 25,
                        divider: 1,
                        mobs: [
                            [n.hs("Spider"), 1],
                        ]
                    },
                    {
                        name: "Anthole Wave",
                        weight: 7,
                        divider: 8, 
                        mobs: [
                            [n.hs("Ant Hole"), 1],
                        ]
                    },
                    {
                        name: "Lady x Bee",
                        weight: 8,
                        divider: 1,
                        mobs: [
                            [n.hs("Ladybug"), 1],
                            [n.hs("Bee"), 1],
                        ]
                    },
                    {
                        name: "Lady x Dark Lady",
                        weight: 10,
                        divider: 1,
                        mobs: [
                            [n.hs("Evil Ladybug"), 1],
                            [n.hs("Ladybug"), 2],
                        ]
                    },
                    {
                        name: "Centis",
                        weight: 10,
                        divider: 2,
                        mobs: [
                            [n.hs("Evil Centipede"), 1],
                            [n.hs("Centipede"), 1],
                        ]
                    },
                    {
                        name: "Centis x Spiders",
                        weight: 10,
                        divider: 1.75,
                        mobs: [
                            [n.hs("Evil Centipede"), 1],
                            [n.hs("Centipede"), 1],
                            [n.hs("Spider"), 3],
                        ]
                    },
                    {
                        name: "Centis x Soil",
                        weight: 5,
                        divider: 1.5,
                        mobs: [
                            [n.hs("Evil Centipede"), 1],
                            [n.hs("Centipede"), 1],
                            [n.hs("Dirt"), 1],
                        ]
                    },
                    {
                        name: "Hornet x Bee",
                        weight: 20,
                        divider: 1,
                        mobs: [
                            [n.hs("Hornet"), 2],
                            [n.hs("Bee"), 1],
                        ]
                    },
                    {
                        name: "Hornet x Dandelion",
                        weight: 25,
                        divider: 1,
                        mobs: [
                            [n.hs("Hornet"), 30],
                            [n.hs("Dandelion"), 10],
                            [n.hs("Evil Centipede"), 5],
                            [n.hs("Centipede"), 5],
                        ]
                    },
                    {
                        name: "Root Wave",
                        weight: 20,
                        divider: 1,
                        mobs: [
                            [n.hs("Hornet"), 2],
                            [n.hs("Spider"), 2],
                            [n.hs("Root"), 3],
                            [n.hs("Evil Ladybug"), 1],
                            [n.hs("Ladybug"), 2],
                        ]
                    },
                    {
                        name: "Rocks x Ants x Soil",
                        weight: 15,
                        divider: 1,
                        mobs: [
                            [n.hs("Rock"), 35],
                            [n.hs("Dirt"), 25],
                            [n.hs("Soldier Ant"), 35],
                            [n.hs("Worker Ant"), 20],
                            [n.hs("Baby Ant"), 10],
                        ]
                    }
                ];
                const desertTables = [
                    {
                        name: "Beetle Wave",
                        weight: 25,
                        divider: 1,
                        mobs: [
                            [n.hs("Beetle"), 1],
                        ]
                    },
                    {
                        name: "Moth x Cactus",
                        weight: 15,
                        divider: 1,
                        mobs: [
                            [n.hs("Desert Moth"), 1],
                            [n.hs("Cactus"), 1],
                        ]
                    },
                    {
                        name: "Moonlit x Sunlit",
                        weight: 10,
                        divider: 1,
                        mobs: [
                            [n.hs("Moonlit Frog"), 100000],
                            [n.hs("Ruby Frog"), 1],
                            [n.hs("Sunlit Frog"), 10000],
                        ]
                    },
                    {
                        name: "Sunlit x Moonlit",
                        weight: 10,
                        divider: 1,
                        mobs: [
                            [n.hs("Moonlit Frog"), 10000],
                            [n.hs("Ruby Frog"), 1],
                            [n.hs("Sunlit Frog"), 100000],
                        ]
                    },
                    {
                        name: "Fire Anthole Wave",
                        weight: 5,
                        divider: 8, 
                        mobs: [
                            [n.hs("Fire Ant Hole"), 1],
                        ]
                    },
                    {
                        name: "Sandstorm",
                        weight: 8,
                        divider: 1,
                        mobs: [
                            [n.hs("Sandstorm"), 1],
                        ]
                    },
                    {
                        name: "Sandstorm x Sandstone",
                        weight: 8,
                        divider: 1,
                        mobs: [
                            [n.hs("Sandstorm"), 1],
                            [n.hs("Sandstone"), 1],
                        ]
                    },
                    {
                        name: "Scorpion",
                        weight: 25,
                        divider: 1,
                        mobs: [
                            [n.hs("Scorpion"), 1],
                        ]
                    },
                    {
                        name: "Ants",
                        weight: 15,
                        divider: 1,
                        mobs: [
                            [n.hs("Soldier Fire Ant"), 4],
                            [n.hs("Worker Fire Ant"), 2],
                            [n.hs("Baby Fire Ant"), 1],
                            [n.hs("Sandstorm"), 1],
                        ]
                    },
                    {
                        name: "Shiny",
                        weight: 5,
                        divider: 1,
                        mobs: [
                            [n.hs("Shiny Ladybug"), 1],
                            [n.hs("Soldier Fire Ant"), 4],
                            [n.hs("Worker Fire Ant"), 2],
                            [n.hs("Baby Fire Ant"), 1],
                            [n.hs("Sandstorm"), 1],
                        ]
                    },
                ];
                const BIOME_GARDEN = "garden";
                const BIOME_DESERT = "desert";
                
                const BIOME_IDS = {
                    1: BIOME_GARDEN,
                    2: BIOME_DESERT
                };
                
                const biomeTables = {
                    [BIOME_GARDEN]: gardenTables,
                    [BIOME_DESERT]: desertTables
                };
                
                const gardenBossWeights = {
                    "Dandelion": 20,
                    "Spider": 50,
                    "Baby Ant": 10,
                    "Dirt": 10,
                };
                
                const desertBossWeights = {
                    "Baby Fire Ant": 5,
                };
                
                function chooseWeightedBoss(weightTable) {
                    let totalWeight = 0;
                    for (const w of Object.values(weightTable)) totalWeight += w;
                
                    let roll = Math.random() * totalWeight;
                    for (const [boss, w] of Object.entries(weightTable)) {
                        if (roll < w) return boss;
                        roll -= w;
                    }
                    return null;
                }
                
                function getBossTableForBiome(biome) {
                    biome = String(biome);
                    switch (biome) {
                        case "1": return gardenBossWeights;
                        case "2": return desertBossWeights;
                        default: return gardenBossWeights;
                    }
                }
                function normalizeWeightedList(list) {
                    if (!Array.isArray(list)) return [];
                    const out = [];
                    for (const entry of list) {
                        if (Array.isArray(entry) && entry.length >= 2) {
                            const item = entry[0];
                            const weight = Number(entry[1]) || 0;
                            if (weight > 0) out.push([item, weight]);
                        } else if (typeof entry === "number" && Number.isFinite(entry)) {
                            out.push([entry, 1]);
                        }
                    }
                    return out;
                }
                
                function setWeighted(list) {
                    const normalized = normalizeWeightedList(list);
                    if (normalized.length === 0) return [];
                    const total = normalized.reduce((sum, entry) => sum + entry[1], 0);
                    if (total <= 0) return [];
                    const cumulative = [];
                    let running = 0;
                    for (let i = 0; i < normalized.length; i++) {
                        running += normalized[i][1] / total;
                        cumulative.push(running);
                    }
                    return cumulative;
                }
                
                function getWeighted(cumulativeList) {
                    if (!Array.isArray(cumulativeList) || cumulativeList.length === 0) return 0;
                    const rand = Math.random();
                    for (let i = 0; i < cumulativeList.length; i++) {
                        if (rand <= cumulativeList[i]) return i;
                    }
                    return cumulativeList.length - 1;
                }
                
                function chooseWave(biomeId) {
                    const biomeKey = BIOME_IDS[biomeId] || BIOME_IDS[s.A.biome] || BIOME_GARDEN;
                    const table = biomeTables[biomeKey] || gardenTables;
                    if (!Array.isArray(table) || table.length === 0) return null;
                
                    const normalized = normalizeWeightedList(table.map(w => [w, w.weight]));
                    const cumulative = setWeighted(normalized);
                    const idx = getWeighted(cumulative);
                    return normalized[idx]?.[0] || table[0];
                }
                
                function d(count, biomeId) {
                    if (!Number.isFinite(count) || count <= 0) return [];
                
                    const biomeKey = BIOME_IDS[biomeId] || BIOME_IDS[s.A.biome] || BIOME_GARDEN;
                    let waveMobs = [];
                
                    if (s.A.isSpecialWave) {
                        if (s.A.specialWave && Array.isArray(s.A.specialWave.mobs) && s.A.specialWave.mobs.length > 0) {
                            waveMobs = s.A.specialWave.mobs;
                        } else {
                            const wave = chooseWave(biomeId);
                            if (wave && Array.isArray(wave.mobs)) waveMobs = wave.mobs;
                        }
                    } else if (Array.isArray(s.A.mobTable) && s.A.mobTable.length > 0) {
                        waveMobs = s.A.mobTable;
                    }
                
                    if (!waveMobs || waveMobs.length === 0) {
                        waveMobs = [[n.hs("Spider"), 1]];
                    }
                
                    const normalized = normalizeWeightedList(waveMobs);
                    const cumulative = setWeighted(normalized);
                    const waveList = [];
                
                    for (let i = 0; i < count; i++) {
                        const chosenIndex = getWeighted(cumulative);
                        const row = normalized[chosenIndex] || normalized[normalized.length - 1];
                        waveList.push(row[0]);
                    }
                
                    return waveList;
                        const e = [];
                        if (mobTable?.length > 0) {
                            for (let i = 0; i < t; i++)
                                e.push(mobTable[Math.random() * mobTable.length | 0]);
                            return e
                        }
                        let i = !1
                          , a = 0
                          , h = 0;
                        for (let s = 0; s < t; s++)
                            for (; ; ) {
                                if (Math.random() > .925 && h < 3) {
                                    h++,
                                    e.push(-1);
                                    break
                                }
                                const s = Math.random() * n.ey.length | 0
                                  , r = n.ey[s].name.toLowerCase();
                                if (!n.ey[s].isSystem) {
                                    if (n.ey[s].tiers[0].antHoleSpawns?.length > 0) {
                                        if (i)
                                            continue;
                                        i = !0
                                    } else if (r.includes("ant") || r.includes("termite") || r.includes("system"))
                                        continue;
                                    if (!(r.includes("queen") && r.includes("egg") || (r.includes("shiny") || r.includes("angelic")) && Math.random() > .01)) {
                                        if (r.includes("demon")) {
                                            if (a >= .125 * t)
                                                continue;
                                            a++
                                        }
                                        e.push(s);
                                        break
                                    }
                                }
                            }
                        return e
                    }
                    function c() {
                        if (s.A.mobTable?.length > 0)
                            return s.A.mobTable[Math.random() * s.A.mobTable.length | 0];
                        let t = 0;
                        for (; t++ < 100; ) {
                            const t = Math.random() * n.ey.length | 0
                              , e = n.ey[t].name.toLowerCase();
                            if (n.ey[t].tiers[0].antHoleSpawns?.length > 0 && Math.random() > .9)
                                return t;
                            if (!((e.includes("ant") || e.includes("termite")) && Math.random() > .2)) {
                                if (e.includes("demon") && Math.random() > .995)
                                    return t;
                                if (!n.ey[t].isSystem)
                                    return t
                            }
                        }
                        return 0
                    }
                    setInterval(( () => {
                        const t = performance.now();
                        switch (s.A.spatialHash.clear(),
                        s.A.viewsSpatialHash.clear(),
                        s.A.entities.forEach((t => {
                            t.update()
                        }
                        )),
                        s.A.entities.forEach((t => {
                            t._AABB && t.collide()
                        }
                        )),
                        s.A.gamemode) {
                        case a.LX.FFA:
                        case a.LX.TDM:
                            {
                                const t = s.A.width
                                  , e = 1024 + 256 * (s.A.clients.size - 1);
                                t !== e && (s.A.width = s.A.height = e,
                                s.A.maxMobs = 10 + 2 * (s.A.clients.size - 1),
                                s.A.clients.forEach((t => t.sendRoom())))
                            }
                            break;
                        case a.LX.WAVES: {
                            s.A.announceRarity = 12;
                        
                            if (!s || !s.A) {
                                console.warn("WAVES handler invoked but s.A is missing");
                                break;
                            }
                        
                            function safeClearWaveTimers(waveID) {
                                try {
                                    if (!s.A._waveTimers) {
                                        s.A._waveTimers = {};
                                        return;
                                    }
                                    if (waveID == null) {
                                        for (const k of Object.keys(s.A._waveTimers)) {
                                            const arr = s.A._waveTimers[k];
                                            if (Array.isArray(arr)) {
                                                for (const t of arr) {
                                                    try { clearTimeout(t); } catch (e) {}
                                                }
                                            }
                                            delete s.A._waveTimers[k];
                                        }
                                        s.A._waveTimers = {};
                                        return;
                                    }
                                    const arr = s.A._waveTimers[waveID];
                                    if (Array.isArray(arr)) {
                                        for (const t of arr) {
                                            try { clearTimeout(t); } catch (e) {}
                                        }
                                    }
                                    delete s.A._waveTimers[waveID];
                                } catch (err) {
                                    console.warn("safeClearWaveTimers error:", err);
                                    s.A._waveTimers = {};
                                }
                            }
                        
                            if (!s.A.started) {
                                s.A.currentWave = 0;
                                s.A.maxMobs = 0;
                                s.A.waveInProgress = false;
                        
                                safeClearWaveTimers(null);
                        
                                s.A.currentWaveID = null;
                        
                                return;
                            }
                        
                            if (!s.A.isWaves || s.A.livingMobCount > 0 || s.A.waveInProgress) break;
                        
                            try {
                                if (s.A.clients && typeof s.A.clients.forEach === "function") {
                                    s.A.clients.forEach(player => {
                                        try {
                                            if (player) {
                                                player.deathID = null;
                                                if (typeof player.talk === "function") player.talk(a.fh.SPAWN);
                                            }
                                        } catch (err) {
                                            console.warn("Failed to notify player in wave start:", err);
                                        }
                                    });
                                }
                            } catch (err) {
                                console.warn("Player notify failed:", err);
                            }
                        
                            try {
                                if (typeof s.A.currentWave !== "number") s.A.currentWave = 0;
                                if (s.A.currentWave > 5) {
                                    if (typeof s.A.specialChance !== "number") s.A.specialChance = 0;
                                    s.A.specialChance += 0.035
                                        ;
                                    s.A.isSpecialWave = Math.random() < s.A.specialChance;
                                    if (s.A.isSpecialWave) {
                                                s.A.clients.forEach(t => t.systemMessage("A Special Wave has begun.", "#3734eb"));
                                        s.A.specialChance = Math.max(0, s.A.specialChance - 0.165);
                                    }
                                } else {
                                    s.A.isSpecialWave = false;
                                }
                            } catch (err) {
                                console.warn("Special wave calc failed:", err);
                                s.A.isSpecialWave = false;
                            }
                            s.A.clients.forEach(t => t.systemMessage(`Special Wave odds: ${Math.floor(s.A.specialChance * 100)}%`, "#6434eb"));
                        
                            s.A.waveInProgress = true;
                        
                            try {
                                if (s.A.entities && typeof s.A.entities.values === "function") {
                                    for (const entity of s.A.entities.values()) {
                                        try {
                                            if (!entity || entity.type !== a.wv.PLAYER) continue;
                                            if (!Array.isArray(entity.petalSlots)) continue;
                        
                                            for (const slot of entity.petalSlots) {
                                                try {
                                                    const petal = slot?.config ?? slot;
                                                    if (!petal) continue;
                                                    if (petal.SOS && Array.isArray(slot.cooldowns)) {
                                                        for (let i = 0; i < slot.cooldowns.length; i++) {
                                                            slot.cooldowns[i] = Number.isFinite(petal.tiers?.[slot.rarity]?.cooldown)
                                                                ? petal.tiers[slot.rarity].cooldown
                                                                : 1;
                                                        }
                                                        slot.reloadTimer = 0;
                                                        slot.cooldown = 0;
                                                    }
                                                } catch (err) {
                                                    console.warn("Error handling petal slot during SOS:", err);
                                                }
                                            }
                                        } catch (err) {
                                            console.warn("Error iterating entity for SOS:", err);
                                        }
                                    }
                                }
                            } catch (err) {
                                console.warn("Force SOS failed:", err);
                            }
                        
                            if (!s.A._waveTimers || typeof s.A._waveTimers !== "object") s.A._waveTimers = {};
                        
                            s.A.currentWave = (typeof s.A.currentWave === "number" ? s.A.currentWave : 0) + 1;
                            const cw = s.A.currentWave;
                        
                            const waveID = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
                            s.A.currentWaveID = waveID;
                            s.A._waveTimers[waveID] = [];
                        
                            let chosenWave = null;
                            if (s.A.isSpecialWave) {
                                try {
                                    chosenWave = chooseWave();
                                    s.A.specialWave = chosenWave;
                                    s.A.specialWaveType = chosenWave?.name ?? null;
                                } catch (err) {
                                    console.warn("chooseWave() failed:", err);
                                    chosenWave = null;
                                    s.A.specialWave = null;
                                    s.A.specialWaveType = null;
                                }
                            } else {
                                s.A.specialWave = null;
                                s.A.specialWaveType = null;
                            }
                        
                            let totalMobs = 0;
                            try {
                                totalMobs = Number(getTotalMobsForWave(cw, chosenWave)) || 0;
                            } catch (err) {
                                console.warn("getTotalMobsForWave error:", err);
                                totalMobs = 0;
                            }
                            s.A.maxMobs = totalMobs;
                        
                            try {
                                const effectiveWave = Math.min(cw, 263);
                                const baseSize = 1024;
                                const mapSize = baseSize * Math.pow(1.0075, effectiveWave);
                                const maxSize = Math.pow(85, 2);
                                s.A.width = s.A.height = Math.min(mapSize, maxSize);
                            } catch (err) {
                                console.warn("map size calc failed:", err);
                            }
                        
                            try {
                                if (s.A.clients && typeof s.A.clients.forEach === "function") {
                                    s.A.clients.forEach(t => {
                                        try {
                                            if (t && typeof t.sendRoom === "function") t.sendRoom();
                                        } catch (err) {
                                            console.warn("sendRoom failed for client:", err);
                                        }
                                    });
                                }
                            } catch (err) {
                                console.warn("sendRoom loop failed:", err);
                            }
                        
                            const rarityDefs = [
                                { name: "Common",       min: 1,   peak: 8,    max: 27,   maxScale: 0.7 },
                                { name: "Unusual",      min: 1,   peak: 13,    max: 34,   maxScale: 0.5 },
                                { name: "Rare",         min: 5,   peak: 17,   max: 55,   maxScale: 0.3 },
                                { name: "Epic",         min: 10,  peak: 26,   max: 73,   maxScale: 0.2 },
                                { name: "Legendary",    min: 20,  peak: 45,   max: 90,   maxScale: 0.15 },
                                { name: "Mythic",       min: 22,  peak: 55,   max: 119,  maxScale: 0.12 },
                                { name: "Ultra",        min: 31,  peak: 70,   max: 139,  maxScale: 0.1 },
                                { name: "Super",        min: 43,  peak: 90,   max: 149,  maxScale: 0.08 },
                                { name: "Omega",        min: 61,  peak: 115,   max: 166,  maxScale: 0.05 },
                                { name: "Fabled",       min: 80,  peak: 140,  max: 196,  maxScale: 0.02 },
                                { name: "Divine",       min: 96,  peak: 160,  max: 201,  maxScale: 0.015 },
                                { name: "Supreme",      min: 115, peak: 170,  max: 276,  maxScale: 0.01 },
                                { name: "Omnipotent",   min: 136, peak: 190,  max: 350,  maxScale: 0.008 },
                                { name: "Astral",       min: 165, peak: 220,  max: 525,  maxScale: 0.005 },
                                { name: "Celestial",    min: 176, peak: 260,  max: 612,  maxScale: 0.004 },
                                { name: "Seraphic",     min: 185, peak: 300,  max: 700,  maxScale: 0.003 },
                                { name: "Transcendent", min: 221, peak: 340,  max: 800,  maxScale: 0.002 },
                                { name: "Ethereal",     min: 251, peak: 400,  max: 1000, maxScale: 0.0015 },
                                { name: "Galactic",     min: 281, peak: 500,  max: 1500, maxScale: 0.001 },
                                { name: "Eternal",      min: 311, peak: 650,  max: 2000, maxScale: 0.0008 },
                                { name: "Apotheotic",   min: 341, peak: 750,  max: 3000, maxScale: 0.0005 },
                                { name: "Voidbound",    min: 400, peak: 900,  max: 5000, maxScale: 0.0003 },
                                { name: "Exalted",      min: 466, peak: 1100,  max: 8000, maxScale: 0.0002 },
                                { name: "Chaos",        min: 521, peak: 1900,  max: 11000,maxScale: 0.00015 },
                                { name: "Cataclysmic",  min: 610, peak: 3000,  max: 18000,maxScale: 0.0001 },
                                { name: "Nullborne",    min: 725, peak: 7000,  max: 24000,maxScale: 0.00005 },
                            ];
                            const bossRarityTable = [
                                { rarity: 6,  min: 40,  max: 59  },
                                { rarity: 7,  min: 60,  max: 79  },
                                { rarity: 8,  min: 80,  max: 99  },
                                { rarity: 9,  min: 100, max: 119 },
                                { rarity: 10, min: 120, max: 139 },
                                { rarity: 11, min: 140, max: 159 },
                                { rarity: 12, min: 160, max: 179 },
                                { rarity: 13, min: 180, max: 199 },
                                { rarity: 14, min: 200, max: 239 },
                                { rarity: 15, min: 240, max: 279 },
                                { rarity: 16, min: 280, max: 319 },
                            ];
                        
                            function cubicChance(wave, min, peak, max, maxScale) {
                                if (!Number.isFinite(wave) || wave < min || wave > max) return 0;
                                let t = wave <= peak
                                    ? (wave - min) / (peak - min)
                                    : (max - wave) / (max - peak);
                                t = t * t * t;
                                return t * maxScale;
                            }
                        
                            function splitIntoBursts(total, burstCount = 24, curve = 1.5) {
                                total = Math.max(0, Math.floor(Number(total) || 0));
                                if (total === 0) return [];
                                burstCount = Math.max(1, Math.floor(burstCount));
                                const weights = [];
                                for (let i = 0; i < burstCount; i++) {
                                    const t = i / (burstCount - 1 || 1);
                                    weights.push(Math.pow(t, curve) + 0.5);
                                }
                                const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
                                let bursts = weights.map(w => Math.floor((w / weightSum) * total));
                                for (let i = 0; i < bursts.length; i++) if (bursts[i] === 0) bursts[i] = 1;
                                let remainder = total - bursts.reduce((a, b) => a + b, 0);
                                for (let i = bursts.length - 1; remainder > 0; i--, remainder--) bursts[i % bursts.length]++;
                                return bursts;
                            }
                        
                            function rollRarityIndependent(wave) {
                                const chances = rarityDefs.map(def => cubicChance(wave, def.min, def.peak, def.max, def.maxScale));
                                const sum = chances.reduce((a, b) => a + b, 0);
                                if (sum === 0) {
                                    for (let i = rarityDefs.length - 1; i >= 0; i--) {
                                        if (wave >= rarityDefs[i].min) return i;
                                    }
                                    return 0;
                                }
                                const roll = Math.random() * sum;
                                let acc = 0;
                                for (let i = 0; i < chances.length; i++) {
                                    acc += chances[i];
                                    if (roll <= acc) return i;
                                }
                                return 0;
                            }
                            function rollBossRarity(wave) {
                            for (const entry of bossRarityTable) {
                                if (wave >= entry.min && wave <= entry.max) {
                                    return entry.rarity;
                                }
                            }
                            
                            return bossRarityTable[0].rarity;
                        }
                        
                        
                        if (typeof s.A.bossChance !== "number") s.A.bossChance = 0.035;
                        s.A.isBossWave = false;
                        
                        if (!s.A.isSpecialWave && s.A.currentWave > 39) {
                            if (Math.random() < s.A.bossChance) {
                                s.A.isBossWave = true;
                                s.A.bossChance = Math.max(0, s.A.bossChance - 0.165);
                            } else {
                                s.A.bossChance += 0.035;
                            }
                        } else {
                            s.A.bossChance += 0.035;
                        }
                        try {
                            totalMobs = Number(getTotalMobsForWave(cw, chosenWave)) || 0;
                        if (s.A.isBossWave) {
                            totalMobs = 1;
                        
                            let biome = s.A.biome || 1;
                            const table = getBossTableForBiome(biome);
                            const bossChoice = chooseWeightedBoss(table);
                        
                            if (!bossChoice) {
                                console.warn("[BOSS] No weighted boss found for biome; using default garden fallback");
                                s.A.nextBoss = chooseWeightedBoss(gardenBossWeights);
                            } else {
                                s.A.nextBoss = bossChoice;
                            }
                        
                            s.A.clients.forEach(t => {
                                if (t && typeof t.systemMessage === "function") {
                                    t.systemMessage(`A Boss Wave has begun!`, "#eb3434");
                                }
                            });
                        }
                        } catch (err) {
                            console.warn("getTotalMobsForWave error:", err);
                            totalMobs = s.A.isBossWave ? 1 : 0;
                        }
                        s.A.maxMobs = totalMobs;
                        
                        const bursts = s.A.isBossWave ? [1] : splitIntoBursts(totalMobs, 24);
                            let spawned = 0;
                        
                            const waveTimersForThisWave = s.A._waveTimers[waveID] = [];
                        
                            const local_sA = s.A;
                            const local_totalMobs = totalMobs;
                            const local_cw = cw;
                            const local_waveID = waveID;
                        
                            bursts.forEach((burstSize, burstIdx) => {
                                const scheduleDelay = Math.max(0, Math.floor(burstIdx * (Number(globalThis.card_speed) || 2500)));
                                const timeoutId = setTimeout(() => {
                                    try {
                                        if (!local_sA || local_sA.currentWaveID !== local_waveID) return;
                                    } catch (err) {
                                        console.warn("Wave sanity check failed:", err);
                                        return;
                                    }
                        
                                    let mobIndexes;
                                    try {
                                        const maybe = typeof d === "function" ? d(burstSize) : null;
                                        if (!Array.isArray(maybe)) {
                                            mobIndexes = new Array(Math.max(0, burstSize)).fill(0);
                                        } else {
                                            mobIndexes = new Array(Math.max(0, burstSize)).fill(0).map((_, i) => maybe[i] ?? maybe[maybe.length - 1] ?? 0);
                                        }
                                    } catch (err) {
                                        console.warn("d(burstSize) failed:", err);
                                        mobIndexes = new Array(Math.max(0, burstSize)).fill(0);
                                    }
                        
                                    for (let j = 0; j < Math.max(0, burstSize); j++) {
                                        try {
                                            if (!local_sA || local_sA.currentWaveID !== local_waveID) break;
                        
                                            const mobSelector = mobIndexes[j];
                                            let rarity;
                                            
                                            if (s.A.isBossWave) {
                                                rarity = rollBossRarity(local_cw);
                                            } else {
                                                rarity = rollRarityIndependent(local_cw);
                                            }
                                            const players = Array.isArray(local_sA.clients?.values ? Array.from(local_sA.clients.values()) : []) ? Array.from(local_sA.clients.values()) : [];
                                            if (!players.length) {
                                                spawned = local_totalMobs;
                                                break;
                                            }
                        
                                            const safeRadius = 10;
                                            const safeRadius2 = safeRadius * safeRadius;
                                            const mapCenter = { x: 0, y: 0 };
                                            const maxRadius = Math.max(1, Math.min(local_sA.width || 1, local_sA.height || 1) * 0.375);
                        
                                            let pos = null;
                                            const validPlayers = players.filter(p => p && typeof p.x === "number" && typeof p.y === "number");
                        
                                            for (let tries = 0; tries < 25; tries++) {
                                                const angle = Math.random() * Math.PI * 2;
                                                const dist = Math.sqrt(Math.random()) * maxRadius;
                                                pos = {
                                                    x: mapCenter.x + Math.cos(angle) * dist,
                                                    y: mapCenter.y + Math.sin(angle) * dist
                                                };
                        
                                                let ok = true;
                                                for (const p of validPlayers) {
                                                    const dx = p.x - pos.x;
                                                    const dy = p.y - pos.y;
                                                    if (dx * dx + dy * dy < safeRadius2) {
                                                        ok = false;
                                                        break;
                                                    }
                                                }
                                                if (ok) break;
                                            }
                        
                                            if (!pos) {
                                                const fallbackPlayer = validPlayers.length ? validPlayers[Math.floor(Math.random() * validPlayers.length)] : null;
                                                const angle = Math.random() * Math.PI * 2;
                                                const dist = safeRadius * 1.25;
                                                pos = fallbackPlayer ? { x: fallbackPlayer.x + Math.cos(angle) * dist, y: fallbackPlayer.y + Math.sin(angle) * dist } : { x: mapCenter.x, y: mapCenter.y };
                                            }
                        
                                            pos.x = Math.max(- (local_sA.width || 1) / 2, Math.min((local_sA.width || 1) / 2, pos.x));
                                            pos.y = Math.max(- (local_sA.height || 1) / 2, Math.min((local_sA.height || 1) / 2, pos.y));
                        
                                            try {
                                                let mobTemplate;
                                            
                                                if (s.A.isBossWave && s.A.nextBoss) {
                                                    mobTemplate = n.ey?.find(t => t.name === s.A.nextBoss)
                                                              ?? n.ey?.find(t => t.name === s.A.nextBoss)
                                                              ?? null;
                                            
                                                    if (!mobTemplate) {
                                                        console.warn("[BOSS] Boss not found in tables:", s.A.nextBoss, "Falling back to normal mob");
                                                        mobTemplate = Array.isArray(n?.ey) ? n.ey[mobSelector] : undefined;
                                                    }
                                                } else {
                                                    mobTemplate = Array.isArray(n?.ey) ? n.ey[mobSelector] : undefined;
                                                }
                                            
                                                if (!mobTemplate) {
                                                    console.warn("Invalid mobTemplate for spawn:", mobSelector);
                                                } else {
                                                    let mob;
                                            
                                                    try {
                                                        mob = new h.Bw(pos);
                                            
                                            if (s.A.isBossWave && s.A.nextBoss && mobTemplate.name === s.A.nextBoss) {
                                                const MAX_LIVING_FOR_BOSS = 24;
                                                if (typeof s.A.livingMobCount === "number" && s.A.livingMobCount > MAX_LIVING_FOR_BOSS) {
                                                    console.warn(`[BOSS] Skipping boss spawn because too many mobs (${s.A.livingMobCount}). nextBoss=${s.A.nextBoss}`);
                                                } else {
                                                    mob.boss = true;
                                                    s.A.currentBoss = s.A.nextBoss;
                                                    s.A.nextBoss = null;
                                                }
                                            }
                                            mob.define(mobTemplate, rarity);
                                        } catch (err) {
                                            console.warn("Mob instantiation failed:", err, "template:", mobTemplate, "rarity:", rarity);
                                        }
                                        try {
                                            if (typeof local_sA.announceRarity === "number" && rarity >= local_sA.announceRarity && local_sA.announceRarity > -1) {
                                                const rarityData = Array.isArray(n?.cK) ? n.cK[rarity] : null;
                                                if (rarityData) {
                                                    const mobName = mobTemplate?.name || "Unknown Mob";
                                                    for (const client of local_sA.clients.values()) {
                                                        try {
                                                            if (client && typeof client.systemMessage === "function") {
                                                                client.systemMessage(
                                                                    (0, l.Br)(rarityData.name, true) + " " + mobName + " has spawned!",
                                                                    rarityData.color
                                                                );
                                                            }
                                                        } catch {}
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            console.warn("Announcement failed:", err);
                                        }
                                    }
                                } catch (err) {
                                    console.warn("Error during safe mob spawn block:", err, "mobSelector:", mobSelector, "pos:", pos, "rarity:", rarity);
                                }
                                            spawned++;
                                        } catch (err) {
                                            console.warn("Error during spawn loop inner:", err);
                                            continue;
                                        }
                                    }
                        
                                    try {
                                        if (spawned >= local_totalMobs || burstIdx === bursts.length - 1) {
                                            safeClearWaveTimers(local_waveID);
                        
                                            if (local_sA && local_sA.currentWaveID === local_waveID) {
                                                local_sA.waveInProgress = false;
                                                local_sA.isSpecialWave = false;
                                            }
                                        }
                                    } catch (err) {
                                        console.warn("Finalize wave failed:", err);
                                    }
                                }, scheduleDelay);
                        
                                try {
                                    if (Array.isArray(s.A._waveTimers[waveID])) s.A._waveTimers[waveID].push(timeoutId);
                                    else s.A._waveTimers[waveID] = [timeoutId];
                                } catch (err) {
                                    console.warn("Failed to register wave timer:", err);
                                }
                            });
                        
                            break;
                        }
                        case a.LX.LINE:
                            {
                                const t = s.A.width
                                  , e = s.A.height;
                                s.A.width = 16384,
                                s.A.height = 4096,
                                s.A.maxMobs = 10 + 2 * (s.A.clients.size - 1),
                                t === s.A.width && e === s.A.height || s.A.clients.forEach((t => t.sendRoom()))
                            }
                            break;
                        case a.LX.MAZE:
                            s.A.maxMobs = s.A.biome === a.VC.ANT_HELL ? 32 + 12 * s.A.clients.size : 24 + 6 * s.A.clients.size
                        }
                        if (!s.A.isWaves && s.A.livingMobCount < s.A.maxMobs && Math.random() > .9)
                            if (Math.random() > .999) {
                                const t = s.A.spawnNearPlayer(n.ey[0]);
                                new h.cS(t.position,t.rarity,Math.max(1, 10 * t.rarity + (6 * Math.random() | -3)))
                            } else if (s.A.gamemode === a.LX.MAZE) {
                                let t = n.ey[c()];
                                const e = s.A.spawnNearPlayer(t);
                                if (void 0 !== e.tile?.spawn) {
                                    const i = s.A.mapData.mobSpawners.find((t => {
                                        t.id,
                                        e.tile
                                    }
                                    ));
                                    if (0 !== i?.availableMobs.length) {
                                        const s = i?.availableMobs[i?.availableMobs.length * Math.random() | 0];
                                        t = n.ey[s[0]],
                                        !0 !== s[1] && (e.rarity = Math.min(s[1], i.maxRarity))
                                    }
                                }
                                new h.Bw(e.position).define(t, e.rarity),
                                e.rarity >= s.A.announceRarity && s.A.announceRarity > -1 && (n.cK[e.rarity] ? s.A.clients.forEach((i => i.systemMessage((0,
                                l.Br)(n.cK[e.rarity].name, !0) + " " + t.name + " has spawned!", n.cK[e.rarity].color))) : console.error(`Rarity returns undefined: ${e.rarity}`))
                            } else if (s.A.isLineMap) {
                                const t = n.ey[c()]
                                  , e = s.A.lineMapMobSpawn(t);
                                new h.Bw(e.position).define(t, e.rarity)
                            }
                        s.A.lag.totalTime += performance.now() - t,
                        s.A.lag.ticks++
                    }
                    ), 1e3 / 22.5);
                    let g = 0;
                    switch (setInterval(( () => {
                        s.A.lag.mspt = s.A.lag.totalTime / Math.max(1, s.A.lag.ticks),
                        s.A.lag.fps = s.A.lag.ticks,
                        s.A.lag.totalTime = 0,
                        s.A.lag.ticks = 0,
                        !r.A.isSandbox && ++g
                    }
                    ), 1e3),
                    setInterval(( () => {
                        s.A.drops.forEach((t => t.update())),
                        s.A.lightning.forEach((t => t.update()))
                    }
                    ), 256),
                    setInterval(( () => s.A.clients.forEach((t => t.worldUpdate()))), 50),
                    s.A.router = new r.A,
                    globalThis.environmentName) {
                    case "browser":
                        self.onmessage = async ({data: t}) => {
                            switch (t[0]) {
                            case 0:
                                s.A.router.addClient((0,
                                o.PW)(t, 1), (0,
                                o.I7)(t, 4), t[3]);
                                break;
                            case 1:
                                s.A.router.pipeMessage((0,
                                o.PW)(t, 1), new DataView(t.buffer,t.byteOffset + 3,t.byteLength - 3));
                                break;
                            case 2:
                                s.A.router.removeClient((0,
                                o.PW)(t, 1));
                                break;
                            case "start":
                                s.A.router.begin(t),
                                t[2] && new m
                            }
                        }
                        ,
                        s.A.router.postMessage = t => self.postMessage(t);
                        break;
                    case "node":
                        throw new Error("Node environment not supported");
                    case "bun":
                        {
                            "true" !== Bun.env.ENV_DONE && (await Bun.write("./.env", ["ENV_DONE=false", "ROUTING_SERVER=wss://routing.floof.supercord.lol", "GAME_NAME=dedicated lobby", "MODDED=false", "GAMEMODE=maze", `SECRET=${Array.from(crypto.getRandomValues(new Uint8Array(24))).map((t => t.toString(16).padStart(2, "0"))).join("")}`, "ADMIN_KEYS=devkey,devkey2", "BIOME=0", "HOST=dedicated.floof.supercord.lol", "PORT=3005", "TLS_DIRECTORY=false"].join("\n")),
                            console.warn("Please fill out the .env file with the correct values. Set ENV_DONE to 'true' when done."),
                            process.exit()),
                            "true" !== Bun.env.MODDED && "false" !== Bun.env.MODDED && (console.error("MODDED must be 'true' or 'false'"),
                            process.exit()),
                            ["ffa", "tdm", "waves", "line", "maze"].includes(Bun.env.GAMEMODE) || (console.error("GAMEMODE must be 'ffa', 'tdm', 'waves', 'line', or 'maze'"),
                            process.exit()),
                            /^[0-9a-f]{48}$/i.test(Bun.env.SECRET) || (console.error("SECRET must be a 48 character hex string"),
                            process.exit()),
                            Bun.env.ADMIN_KEYS.split(",").every((t => "string" == typeof t)) || (console.error("ADMIN_KEYS must be a comma separated list of strings"),
                            process.exit()),
                            -1 == Bun.env.BIOME && (console.log("BIOME is set to -1, selecting random biome"),
                            Bun.env.BIOME = l.Iv ? a.VC.HALLOWEEN : 8 * Math.random() | 0);
                            const y = Bun.env.ADMIN_KEYS.split(",").filter((t => t.length > 3));
                            let f = 1;
                            const A = new Map
                              , w = new Map
                              , b = Bun.serve({
                                fetch(t) {
                                    const e = b.requestIP(t);
                                    if (!e?.address)
                                        return new Response(":(");
                                    return b.upgrade(t, {
                                        data: {
                                            socketID: f++,
                                            searchParams: new URLSearchParams(t.url.split("?").slice(1).join("?")),
                                            begin: performance.now(),
                                            ip: e.address
                                        }
                                    }) ? void 0 : new Response("Hello world")
                                },
                                websocket: {
                                    perMessageDeflate: !0,
                                    async open(t) {
                                        t.binaryType = "arraybuffer";
                                        const e = s.A.router.addClient(t.data.socketID, t.data.searchParams.get("uuid"), y.includes(t.data.searchParams.get("clientKey")));
                                        if (e) {
                                            A.set(t.data.socketID, t);
                                            let i = (w.get(t.data.ip) ?? 0) + 1;
                                            if (i > 100)
                                                return void e.kick("Too many connections from this IP");
                                            w.set(t.data.ip, i);
                                            try {
                                                const t = await fetch(`${Bun.env.ROUTING_SERVER.replace("ws", "http")}/uuid/check?uuid=${e.uuid}&trustedKey=${Bun.env.SECRET}`)
                                                  , i = await t.json();
                                                if (!i.ok || !i.isValid)
                                                    return void e.kick("DAR-6")
                                            } catch (t) {
                                                return console.error(t),
                                                void e.kick("DAR-5")
                                            }
                                        }
                                    },
                                    close(t) {
                                        s.A.router.removeClient(t.data.socketID),
                                        A.delete(t.data.socketID),
                                        x.readyState === WebSocket.OPEN && t.data.searchParams.has("analytics") && x.send(new Uint8Array([a.jU.ANALYTICS_DATA, ...(0,
                                        o._O)(t.data.searchParams.get("analytics")), ...(0,
                                        o._O)((performance.now() - t.data.begin).toFixed(2))]));
                                        let e = (w.get(t.data.ip) ?? 0) - 1;
                                        e <= 0 ? w.delete(t.data.ip) : w.set(t.data.ip, e)
                                    },
                                    message(t, e) {
                                        "string" != typeof e && s.A.router.pipeMessage(t.data.socketID, new DataView(e))
                                    }
                                },
                                port: +Bun.env.DEDICATED_LOBBY_PORT,
                                tls: "false" !== Bun.env.TLS_DIRECTORY ? {
                                    key: Bun.file(`${Bun.env.TLS_DIRECTORY}/privkey.pem`),
                                    cert: Bun.file(`${Bun.env.TLS_DIRECTORY}/fullchain.pem`)
                                } : void 0
                            })
                              , M = -Math.floor((new Date).getTimezoneOffset() / 60)
                              , x = new WebSocket(`${Bun.env.ROUTING_SERVER}/ws/lobby?gameName=${Bun.env.GAME_NAME}&isModded=${"true" == Bun.env.MODDED ? "yes" : "no"}&gamemode=${Bun.env.GAMEMODE}&secretKey=${Bun.env.SECRET}&isPrivate=no&biome=${Bun.env.BIOME}&directConnect=${Bun.env.HOST},${M}&analytics=${ANALYTICS_DATA}`,{
                                origin: Bun.env.HOST,
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
                                }
                            });
                            x.binaryType = "arraybuffer";
                            const S = [];
                            x.onopen = () => {
                                console.log("Connected to server"),
                                s.A.router.begin(["start", Bun.env.GAMEMODE, "true" == Bun.env.MODDED, crypto.randomUUID(), +Bun.env.BIOME]),
                                x.onmessage = t => {
                                    const e = new Uint8Array(t.data);
                                    if (255 !== e[0])
                                        ;
                                    else {
                                        if (!(1 === e[1]))
                                            throw new Error("Request rejected by server");
                                        console.log("Lobby Verified", (new TextDecoder).decode(e.slice(2, -1)))
                                    }
                                }
                                ,
                                S.forEach((t => t()))
                            }
                            ,
                            x.onClose = () => {
                                if (this.verified) {
                                    
                                    console.log(`Client ${this.id} (${this.username}) disconnected`);
                                    if (this.body && !this.body.health.isDead && this.level >= 20) {
                                        new y(this);
                                    } else if (this.body) {
                                        this.body.destroy();
                                    }
                                } else {
                                    console.log(`Client ${this.id} disconnected`);
                                }
                            
                                a.A.clients.delete(this.id);
                            }
                            ,
                            s.A.router.postMessage = t => {
                                switch (t[0]) {
                                case a.jU.PIPE_PACKET:
                                    const e = A.get((0,
                                    o.PW)(t, 1));
                                    null != e && e.readyState === WebSocket.OPEN && e.send(t.slice(3));
                                    break;
                                case a.jU.CLOSE_CLIENT:
                                    A.get((0,
                                    o.PW)(t, 1))?.close();
                                    break;
                                default:
                                    x.readyState === WebSocket.OPEN ? (x.send(t),
                                    console.log(`Lobby ready state: ${x.readyState}`)) : (console.log("Lobby ready state: Closed."),
                                    S.push(( () => x.send(t))))
                                }
                            }
                        }
                        break;
                    default:
                        throw new Error("Invalid environment")
                    }
                    let p = !1;
                    function u() {
                        s.A.router.postMessage(new Uint8Array([2, ...(0,
                        o._O)(JSON.stringify((0,
                        a.Gf)(n.cK, n.GJ, n.ey)))])),
                        p && setTimeout(( () => s.A.clients.forEach((t => t.talk(a.de.UPDATE_ASSETS)))), 250),
                        p = !0
                    }
                    u();
                    class m {
                        static TRANSFERRABLE_TYPES = {
                            PetalConfig: 0,
                            MobConfig: 1
                        };
                        static assignTransferrableType(t, e) {
                            let i;
                            if (e === m.TRANSFERRABLE_TYPES.PetalConfig) {
                                i = Object.assign(new n.lm("",0,0,0), structuredClone(t));
                                for (const e in t) {
                                    const s = structuredClone(t[e]);
                                    switch (e) {
                                    case "drawing":
                                        i.drawing = Object.assign(new a.H1, s);
                                        break;
                                    case "tiers":
                                        for (let t = 0; t < s.length; t++)
                                            i.tiers[t] = Object.assign(new a.z(0,0,0), s[t])
                                    }
                                }
                            }
                            return i
                        }
                        #t = null;
                        constructor() {
                            this.#t = new BroadcastChannel("floofModdingAPI"),
                            this.#t.onmessage = t => this.parseModdingAPICommand(t.data)
                        }
                        floofModdingResponse(t, e, i, s=null, a=null) {
                            this.#t.postMessage([t, {
                                ok: e,
                                message: i,
                                data: s
                            }, a])
                        }
                        validateArg(t, e, i, s, a) {
                            return typeof i !== s ? (this.floofModdingResponse(t, !1, `Argument ${e} must be of type ${s}`),
                            !1) : !a || !(i < a[0] || i > a[1]) || (this.floofModdingResponse(t, !1, `Argument ${e} must be between ${a[0]} and ${a[1]}`),
                            !1)
                        }
                        parseModdingAPICommand(t) {
                            const [e,i,...r] = t;
                            switch (i) {
                            case "spawnMob":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "spawnMob(index, rarity) requires 2 arguments!");
                                    if (!this.validateArg(e, "index", r[0], "number", [0, n.ey.length - 1]) || !this.validateArg(e, "rarity", r[1], "number", [0, n.cK.length - 1]))
                                        return;
                                    const t = new h.Bw(s.A.random());
                                    t.define(n.ey[r[0]], r[1]),
                                    t.boss = true,
                                    this.floofModdingResponse(e, !0, "Mob spawned successfully", {
                                        id: t.id,
                                        index: t.index,
                                        rarity: t.rarity,
                                        indexName: n.ey[t.index].name,
                                        rarityName: n.cK[t.rarity].name,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    })
                                }
                                break;
                            case "setRoomInfo":
                                if (r.length < 1 || r.length > 5)
                                    return void this.floofModdingResponse(e, !1, "setRoomInfo(dynamic, width*, height*, mobCount*, currentWave*) requires 1 argument, has 4 extra optional arguments!");
                                if (!this.validateArg(e, "dynamic", r[0], "boolean"))
                                    return;
                                if (!0 === r[0]) {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setRoomInfo(true) requires no extra arguments!")
                                } else if (!(this.validateArg(e, "width", r[1], "number", [256, 131072]) && this.validateArg(e, "height", r[2], "number", [256, 131072]) && this.validateArg(e, "mobCount", r[3], "number", [0, 4096]) && this.validateArg(e, "currentWave", r[4], "number", [0, 4096])))
                                    return;
                                s.A.dynamicRoom = r[0],
                                s.A.dynamicRoom || (s.A.width = r[1],
                                s.A.height = r[2],
                                s.A.maxMobs = r[3],
                                s.A.currentWave = r[4] - 1,
                                s.A.livingMobCount = 0),
                                s.A.clients.forEach((t => t.sendRoom())),
                                this.floofModdingResponse(e, !0, "Room info set successfully", {
                                    dynamic: s.A.dynamicRoom,
                                    width: s.A.width,
                                    height: s.A.height,
                                    mobCount: s.A.maxMobs,
                                    wave: s.A.currentWave
                                });
                                break;
                            case "getRoomInfo":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getRoomInfo() requires 0 arguments!");
                                this.floofModdingResponse(e, !0, "Room info fetched successfully", {
                                    dynamic: s.A.dynamicRoom,
                                    width: s.A.width,
                                    height: s.A.height,
                                    mobCount: s.A.maxMobs,
                                    wave: s.A.wave
                                });
                                break;
                            case "getPlayers":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getPlayers() requires 0 arguments!");
                                const t = [];
                                s.A.clients.forEach((e => {
                                    t.push({
                                        clientID: e.id,
                                        username: e.username,
                                        slots: {
                                            primary: e.slots.map((t => ({
                                                index: t.id,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.id].name,
                                                rarityName: n.cK[t.rarity].name
                                            }))),
                                            secondary: e.secondarySlots.map((t => t ? {
                                                index: t.id,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.id].name,
                                                rarityName: n.cK[t.rarity].name
                                            } : null)),
                                            highestRarity: e.highestRarity
                                        },
                                        level: {
                                            xp: Math.round(e.xp),
                                            level: e.level,
                                            progress: +e.levelProgress.toFixed(4)
                                        },
                                        body: e.body ? {
                                            id: e.body.id,
                                            position: {
                                                x: e.body.x,
                                                y: e.body.y
                                            }
                                        } : null
                                    })
                                }
                                )),
                                this.floofModdingResponse(e, !0, "Players fetched successfully", t);
                                break;
                            case "getMobs":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getMobs() requires 0 arguments!");
                                const o = [];
                                s.A.entities.forEach((t => {
                                    t.type === a.wv.MOB && o.push({
                                        id: t.id,
                                        index: t.index,
                                        rarity: t.rarity,
                                        indexName: n.ey[t.index].name,
                                        rarityName: n.cK[t.rarity].name,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    })
                                }
                                )),
                                this.floofModdingResponse(e, !0, "Mobs fetched successfully", o);
                                break;
                            case "getPetalInfo":
                                if (1 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getPetalInfo(index) requires 1 argument!");
                                if (!this.validateArg(e, "index", r[0], "number", [0, n.GJ.length - 1]))
                                    return;
                                this.floofModdingResponse(e, !0, "Petal info fetched successfully", n.GJ[r[0]], m.TRANSFERRABLE_TYPES.PetalConfig);
                                break;
                            case "createCustomPetal":
                                {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "createCustomPetal(options) requires 1 argument!");
                                    const t = r[0];
                                    t.drawing && (t.drawing = a.H1.fromString(t.drawing)),
                                    t.id = n.GJ.length,
                                    n.GJ.push(m.assignTransferrableType(t, m.TRANSFERRABLE_TYPES.PetalConfig)),
                                    u(),
                                    this.floofModdingResponse(e, !0, "Custom petal created successfully", t, m.TRANSFERRABLE_TYPES.PetalConfig)
                                }
                                break;
                            case "editPetal":
                                {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "editPetal(options) requires 1 argument!");
                                    if (null == n.GJ[r[0].id])
                                        return void this.floofModdingResponse(e, !1, "Petal does not exist");
                                    const t = r[0];
                                    t.drawing && (t.drawing = a.H1.fromString(t.drawing)),
                                    n.GJ[t.id] = m.assignTransferrableType(t, m.TRANSFERRABLE_TYPES.PetalConfig),
                                    u(),
                                    s.A.entities.forEach((e => {
                                        if (e.type !== a.wv.PLAYER)
                                            return;
                                        e.petalSlots.forEach((e => {
                                            e.config.id === t.id && (e.destroy(),
                                            e.define(n.GJ[t.id], e.rarity))
                                        }
                                        ))
                                    }
                                    )),
                                    this.floofModdingResponse(e, !0, "Petal edited successfully", t, m.TRANSFERRABLE_TYPES.PetalConfig)
                                }
                                break;
                            case "setSlot":
                                {
                                    if (4 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setSlot(clientID, slotID, index, rarity) requires 4 arguments!");
                                    if (!(this.validateArg(e, "clientID", r[0], "number") && this.validateArg(e, "slotID", r[1], "number") && this.validateArg(e, "index", r[2], "number", [0, n.GJ.length - 1]) && this.validateArg(e, "rarity", r[3], "number", [0, n.cK.length - 1])))
                                        return;
                                    const t = s.A.clients.get(r[0]);
                                    if (!t)
                                        return void this.floofModdingResponse(e, !1, "Client not found. Try to fetch the players and find the client ID you need");
                                    if (!t.body)
                                        return void this.floofModdingResponse(e, !1, "Client does not have a body");
                                    if (r[1] < 0 || r[1] >= t.body.petalSlots.length)
                                        return void this.floofModdingResponse(e, !1, `Slot ${r[1]} does not exist`);
                                    t.slots[r[1]].id = r[2],
                                    t.slots[r[1]].rarity = r[3],
                                    t.body.setSlot(r[1], r[2], r[3]),
                                    this.floofModdingResponse(e, !0, "Slot set successfully", {
                                        clientID: t.id,
                                        slotIndex: r[1],
                                        petalIndex: r[2],
                                        rarity: r[3],
                                        indexName: n.GJ[r[2]].name,
                                        rarityName: n.cK[r[3]].name
                                    })
                                }
                                break;
                            case "deletePetal":
                                if (1 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "deletePetal(index) requires 1 argument!");
                                if (!this.validateArg(e, "index", r[0], "number", [0, n.GJ.length - 1]))
                                    return;
                                r[0] < n.vx ? n.GJ[r[0]] = new n.lm("Deleted Petal",0,0,0) : n.GJ.splice(r[0], 1);
                                for (let t = 0; t < n.GJ.length; t++)
                                    n.GJ[t].id = t;
                                n.lm.idAccumulator = n.GJ.length,
                                s.A.entities.forEach((t => {
                                    if (t.type !== a.wv.PLAYER)
                                        return;
                                    t.petalSlots.forEach((t => {
                                        t.config.id === r[0] && (t.destroy(),
                                        t.define(n.GJ[0], t.rarity))
                                    }
                                    ))
                                }
                                )),
                                u(),
                                this.floofModdingResponse(e, !0, "Petal deleted successfully", {
                                    index: r[0]
                                });
                                break;
                            case "setSlotAmount":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setSlotAmount(clientID, amount) requires 2 arguments!");
                                    if (!this.validateArg(e, "clientID", r[0], "number") || !this.validateArg(e, "amount", r[1], "number", [1, 10]))
                                        return;
                                    const t = s.A.clients.get(r[0]);
                                    if (!t)
                                        return void this.floofModdingResponse(e, !1, "Client not found. Try to fetch the players and find the client ID you need");
                                    if (!t.body)
                                        return void this.floofModdingResponse(e, !1, "Client does not have a body");
                                    t.body.initSlots(r[1]),
                                    this.floofModdingResponse(e, !0, "Slot amount set successfully", {
                                        clientID: t.id,
                                        body: {
                                            id: t.body.id,
                                            slots: t.body.petalSlots.map((t => ({
                                                index: t.index,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.index].name,
                                                rarityName: n.cK[t.rarity].name
                                            }))),
                                            position: {
                                                x: t.body.x,
                                                y: t.body.y
                                            }
                                        }
                                    })
                                }
                                break;
                            case "spawnAIPlayer":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "spawnAIPlayer(rarity, level) requires 2 arguments!");
                                    if (!this.validateArg(e, "rarity", r[0], "number", [0, n.cK.length - 1]) || !this.validateArg(e, "amount", r[1] - 1, "number", [1, 999]))
                                        return;
                                    const t = new h.cS(s.A.random(),r[0],r[1] - 1);
                                    this.floofModdingResponse(e, !0, "AI Flower spawned successfully", {
                                        id: t.id,
                                        level: t.client.level,
                                        highestRarity: t.client.highestRarity,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    })
                                }
                            default:
                                this.floofModdingResponse(e, !1, `Function ${i} does not exist!`)
                            }
                        }
                    }
                    e()
                } catch (D) {
                    e(D)
                }
            }
            ), 1)
        }
        ,
        110: (t, e, i) => {
            i.d(e, {
                AU: () => M,
                DQ: () => u,
                E4: () => R,
                F6: () => c,
                Gf: () => D,
                H1: () => w,
                LX: () => P,
                VC: () => f,
                XE: () => o,
                ai: () => T,
                cK: () => s,
                dX: () => v,
                de: () => l,
                fh: () => d,
                hg: () => A,
                jU: () => m,
                lm: () => h,
                mP: () => b,
                rx: () => n,
                so: () => p,
                w6: () => g,
                wv: () => y,
                z: () => a
            });
            const s = [{
                name: "Common",
                color: "#7eef6d"
            }, {
                name: "Unusual",
                color: "#ffe65d"
            }, {
                name: "Rare",
                color: "#4d52e3"
            }, {
                name: "Epic",
                color: "#861fde"
            }, {
                name: "Legendary",
                color: "#de1f1f"
            }, {
                name: "Mythic",
                color: "#1fdbde"
            }, {
                name: "Ultra",
                color: "#ff2b75"
            }, {
                name: "Super",
                color: "#2bffa3"
            }, {
                name: "Omega",
                color: "#494849"
            }, {
                name: "Fabled",
                color: "#ff5500"
            }, {
                name: "Divine",
                color: "#67549c"
            }, {
                name: "Supreme",
                color: "#b25dd9"
            }, {
                name: "Omnipotent",
                color: "#5e004f"
            }, {
                name: "Astral",
                color: "#046307"
            }, {
                name: "Celestial",
                color: "#608efc"
            }, {
                name: "Seraphic",
                color: "#c77e5b"
            }, {
                name: "Transcendent",
                color: "#ffffff"
            }, {
                name: "Ethereal",
                color: "#f6c5de"
            }, {
                name: "Galactic",
                color: "#7f0226"
            }, {
                name: "Eternal",
                color: "#146636"
            }, {
                name: "Apotheotic",
                color: "#b3ab56"
            }, {
                name: "Voidbound",
                color: "#250a3d"
            }, {
                name: "Exalted",
                color: "#18608c"    
            }, {
                name: "Chaos",
                color: "#20258a"  
            }, {
                name: "Cataclysmic",
                color: "#940909"  
            }, {
                name: "Nullborne",
                color: "#434246"  
            }];
class a {
    static HEALTH_SCALE = [
        1, 1.2, 1.5, 1.9, 2.7, 4.3, 8.6, 17.2, 34.4, 68.8,
        137.6, 275.2, 550, 1650, 6600, 26400, 35200, 17600,
        35200, 70400, 140800, 281600, 563200, 1126400, 2252800, 4505600
    ];

    static DAMAGE_SCALE = [
        1, 1.4, 2, 2.9, 4.8, 9.7, 23, 90, 315, 1100,
        3850, 13475, 47163, 264113, 1452621, 4212000, 18954000, 14580000,
        43740000, 153090000, 535815000, 1.87e9, 3.6e9, 7.2e9, 14.4e9, 28.8e9
    ];

    static HEAL_SCALE = [
        1, 1.51, 2.23, 3.17, 4.94, 10.2, 21.45, 40.3, 74, 140.6,
        267.14, 507, 963, 2889, 9625, 26244, 85000, 23831,
        45279, 86030, 160000, 320000, 640000, 1280000, 2560000, 5120000
    ];

        static MOB_HEALTH_SCALE = [
        1, 2, 4, 8*1.72/1.6, 50, 110, 310, 1350, 4941, 18084,
        66188, 242247, 968988, 4844940, 9800000, 20000000, 60000000, 120000000,
        360000000, 720000000, 1440000000, 4.32e9, 8.64e9, 1.728e10, 6e10, 18e10
    ];

    static MOB_DAMAGE_SCALE = [
        1, 1.2, 1.5, 1.9, 2.7, 4.3, 8.6, 17.2, 34.4, 68.8,
        137.6, 275.2, 550, 1100, 1650, 2475, 4950, 7425,
        14850, 21000, 29700, 59400, 89100, 133650, 267300, 534600
    ];

    static MASS_SCALE = [
        1, 1.52, 2.46, 5.7, 18.6, 43, 100, 216, 480, 1100,
        2500, 7000, 20000, 85000, 340000, 1360000, 5440000, 21760000,
        87040000, 4800000, 9600000, 19200000, 38400000, 76800000, 153600000, 460000000
    ];

    constructor(t, baseHealth = 1, baseDamage = 1) {
        this.health = baseHealth * a.HEALTH_SCALE[t];
        this.damage = baseDamage * a.DAMAGE_SCALE[t];
        this.heal   = a.HEAL_SCALE[t];

        this.extraHealth = 0;
        this.healthDivision = 0;
        this.constantHeal = 0;
        this.healing = 0;
        this.count = 1;
        this.clumps = false;
        this.damageReduction = 0;
        this.damageReflection = 0;
        this.finalHit = 0;
        this.oddsDamage = 0;
        this.healingReduction = 0;
        this.speedMultiplier = 1;
        this.extraSize = 0;
        this.scalingExtraSize = 0;
        this.extraRange = 0;
        this.poison = null;
        this.spawnable = null;
        this.pentagramAbility = null;
        this.lightning = null;
        this.extraVision = 0;
        this.extraPickupRange = 0;
        this.density = 1;
        this.deathDefying = 0;
        this.absorbsDamage = null;
        this.shield = 0;
        this.boost = null;
        this.healBack = 0;
            }
        }
class n {
    static HEALTH_SCALE = [
        1, 2, 4, 8*1.72/1.6, 50, 110, 310, 1350, 4941, 18084,
        66188, 242247, 968988, 4844940, 9800000, 20000000, 60000000, 120000000,
        360000000, 720000000, 1440000000, 4.32e9, 8.64e9, 1.728e10, 6e10, 18e10
    ];

    static DAMAGE_SCALE = [
        1, 1.2, 1.5, 1.9, 2.7, 4.3, 8.6, 17.2, 34.4, 68.8,
        137.6, 275.2, 550, 1100, 1650, 2475, 4950, 7425,
        14850, 21000, 29700, 59400, 89100, 133650, 267300, 534600
    ];

    static SIZE_SCALE = [
        1, 1.1, 1.3, 1.72, 3, 5, 7, 9.5, 13, 17.7,
        24.1, 33, 45, 62, 71, 81, 103, 118,
        135, 154, 175, 200, 228, 258, 295, 335
    ];

    constructor(t, e = 1, i = 1, s = 1) {
        if (t >= 0 && t <= 25) {
            this.health = e * n.HEALTH_SCALE[t];
            this.damage = i * n.DAMAGE_SCALE[t];
            this.size   = s * n.SIZE_SCALE[t];
        } else {
            this.health = e * n.HEALTH_SCALE[0];
            this.damage = i * n.DAMAGE_SCALE[0];
            this.size   = s * n.SIZE_SCALE[0];
        }

        this.damageReduction = 0;
        this.projectile = null;
        this.poison = null;
        this.lightning = null;
        this.antHoleSpawns = null;
            }
        }
            class h {
                static idAccumulator = 0;
                #e() {
                    const t = [];
                    for (let e = 0; e < s.length; e++)
                        t.push(new a(e,this.health,this.damage));
                    return t
                }
                constructor(t, e, i, s) {
                    this.id = h.idAccumulator++,
                    this.name = t,
                    this.health = i,
                    this.damage = s,
                    this.launchable = !1,
                    this.launchedSpeed = 0,
                    this.launchedRange = 0,
                    this.wingMovement = !1,
                    this.yinYangMovement = !1,
                    this.wearable = !1,
                    this.enemySpeedDebuff = null,
                    this.splits = null,
                    this.tiers = this.#e(),
                    this.setCooldown(e),
                    this.sizeRatio = this.setSize(1),
                    this.attractsLightning = !1,
                    this.drawing = null,
                    this.shootsOut = -1,
                    this.healsInDefense = !1,
                    this.phases = !1,
                    this.canPlaceDown = !1,
                    this.healWhenUnder = 1,
                    this.huddles = !1,
                    this.ignoreWalls = !1,
                    this.extraLighting = 0,
                    this.description = "Not much is known about this mysterious petal."
                }
                setName(t) {
                    return this.name = t,
                    this
                }
                setHuddles(t) {
                    return this.huddles = Boolean(t),
                    this
                }
                setHoney(t) {
                    return this.honey = t,
                    this
                }
                setCooldown(t) {
                    if (t instanceof Array) {
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].cooldown = t[Math.min(i, t.length - 1)] * 22.5
                    }
                    else
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].cooldown = t
                    return this
                }
                 setHealth(t) {
                if (t instanceof Array) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.HEALTH_SCALE[i] ?? 1;
                        this.tiers[i].health = t[Math.min(i, t.length - 1)] * multiplier
                    }
                }
                else
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.HEALTH_SCALE[i] ?? 1;
                        this.tiers[i].health = t
                    }
                return this
            }
                 setDamage(t) {
                if (t instanceof Array) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                        this.tiers[i].damage = t[Math.min(i, t.length - 1)] * multiplier
                    }
                }
                else
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                        this.tiers[i].damage = t
                    }
                return this
            }
                setMobHealth(t) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const multiplier = a.MOB_HEALTH_SCALE[e] ?? 1;
                        this.tiers[e].health = t * multiplier;
                    }
                    return this;
                }
                setHealingReduction(t) {
                    if (t instanceof Array)
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].healingReduction = t[Math.min(i, t.length - 1)];
                    else
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].healingReduction = t;
                    return this;
                }
                setMobDamage(t) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const multiplier = a.MOB_DAMAGE_SCALE[e] ?? 1;
                        this.tiers[e].damage = t * multiplier;
                    }
                    return this;
                }
                setSelfDamage(t) {
                for (let e = 0; e < this.tiers.length; e++) {
                    const multiplier = a.HEAL_SCALE[e] ?? 1;
                    this.tiers[e].selfDamage = t * multiplier;
                }
                return this;
                }
                setSize(t) {
                if (t instanceof Array) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].sizeRatio = t[Math.min(i, t.length - 1)]
                }
                else
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].sizeRatio = t
                return this
                }
                setMulti(t, e, i) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].count = t instanceof Array ? t[i] ?? t[t.length - 1] : t,
                        this.tiers[i].clumps = Boolean(e);
                    return this
                }
                setDrawing(t) {
                    if (!(t instanceof w))
                        throw new Error("Invalid drawing type");
                    return this.drawing = t,
                    this
                }
                setExtraRadians(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraRadians = t * Math.pow(1.15, e);
                    return this
                }
                setExtraHealth(t) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const multiplier = a.HEAL_SCALE[e] ?? 1;
                        this.tiers[e].extraHealth = t * multiplier;
                    }
                    return this;
                }
                setConstantHeal(t, e=!1, i=1) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const multiplier = a.HEAL_SCALE[e] ?? 1;
                        this.tiers[e].constantHeal = t / 22.5 * multiplier;
                    }
                    return this.healsInDefense = e,
                    this.healWhenUnder = i,
                    this
                }
                setExplodes(t) {
                    return this.explodes = t,
                    this
                }
                setHealthDivision(t) {
                    return this.healthDivision = t,
                    this
                }
                setEOC(t) {
                    return this.EOC = t,
                    this
                }
                setEmeraldAbility(t) {
                    return this.emeraldAbility = t,
                    this
                }
                setRubyAbility(t) {
                    return this.rubyAbility = t,
                    this
                }
                setWingMovement(t) {
                    return this.wingMovement = t,
                    this
                }
                 setDamageReductionPercent(t) {
                    if (t instanceof Array) {
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].damageReductionPercent = t[Math.min(i, t.length - 1)]
                    }
                    else
                        for (let i = 0; i < this.tiers.length; i++)
                            this.tiers[i].damageReductionPercent = t
                    return this
                }
                setDamageReduction(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = a.HEAL_SCALE[i] ?? 1;
                        this.tiers[i].damageReduction = t * multiplier;
                    }
                    return this
                }
                setPetalDamageReduction(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = a.HEALTH_SCALE[i] ?? 1;
                        this.tiers[i].petalDamageReduction = t * multiplier;
                    }
                    return this
                }
                setSpeedMultiplier(t) {
                    if (Array.isArray(t)) {
                        for (let i = 0; i < this.tiers.length; i++) {
                            const val = t[i < t.length ? i : t.length - 1];
                            this.tiers[i].speedMultiplier = Number.isFinite(val) ? val : 1;
                        }
                    } else {
                        const val = Number.isFinite(t) ? t : 1;
                        for (let i = 0; i < this.tiers.length; i++) {
                            this.tiers[i].speedMultiplier = val;
                        }
                    }
                    return this;
                }
                setExtraSize(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraSize = t;
                    return this
                }
                setScalingExtraSize(t) {
                    if (Array.isArray(t)) {
                        for (let i = 0; i < this.tiers.length; i++) {
                            const val = t[i < t.length ? i : t.length - 1];
                            this.tiers[i].scalingExtraSize = Number.isFinite(val) ? val : 1;
                        }
                    } else {
                        const val = Number.isFinite(t) ? t : 1;
                        for (let i = 0; i < this.tiers.length; i++) {
                            this.tiers[i].scalingExtraSize = val;
                        }
                    }
                    return this;
                }
                setDescription(t) {
                    return this.description = t,
                    this
                }
                setLaunchable(t, e) {
                    this.launchable = !0,
                    this.launchedSpeed = t;
                    for (let i = 0; i < this.tiers.length; i++)
                    this.tiers[i].launchedRange = e instanceof Array ? e[i] * 22.5 ?? e[e.length - 1] * 22.5 : e * 22.5
                    return this
                }
                 setHealing(t) {
                if (t instanceof Array) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.HEAL_SCALE[i] ?? 1;
                        this.tiers[i].healing = t[Math.min(i, t.length - 1)] * multiplier
                    }
                }
                else
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.HEAL_SCALE[i] ?? 1;
                        this.tiers[i].healing = t
                    }
                return this
            }
                setYinYang(t) {
                    return this.yinYangMovement = t,
                    this
                }
                setSwitchBiome(Switches) {
                    return this.switchBiome = Switches,
                    this
                }                
                setRevives(revives) {
                    return this.revives = revives,
                    this
                }
                setEnemySpeedMultiplier(t, e) {
                    return this.enemySpeedDebuff = {
                        speedMultiplier: t,
                        duration: 22.5 * e
                    },
                    this
                }
                setPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                        this.tiers[i].poison = {
                            damage: t / 22.5 * multiplier,
                            duration: e * 22.5
                        };
                    }
                    return this
                }
                setMobPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.MOB_DAMAGE_SCALE[i] ?? 1;
                        this.tiers[i].poison = {
                            damage: t / 22.5 * multiplier,
                            duration: e * 22.5
                        };
                    }
                    return this
                }
                setShootOut(t) {
                    return this.shootsOut = t,
                    this
                }
                setExtraRange(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraRange = t * Math.pow(1.15, e);
                    return this
                }
                setWearable(t) {
                    return this.wearable = t,
                    this
                }
                setSpawnable(t, e, i) {
                    for (let s = 0; s < this.tiers.length; s++) {
                        this.tiers[s].spawnable = {
                            index: Array.isArray(t) ? t[Math.min(s, t.length - 1)] : t,
                            rarity: Array.isArray(e) ? e[Math.min(s, e.length - 1)] : e,
                            timer: Array.isArray(i) ? i[Math.min(s, i.length - 1)] * 22.5 : i * 22.5
                        }
                    }
                    return this;
                }
                setExtraVision(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraVision = t * Math.pow(1.5, e);
                    return this
                }
                setSplits(t, e) {
                    return this.splits = {
                        index: t,
                        count: e
                    },
                    this
                }
                setHealSpit(t, e, i) {
                    return this.healSpit = {
                        cooldown: t,
                        range: e,
                        heal: i
                    },
                    this
                }
                setPentagramAbility(t, e, i, s, n) {
                    for (let h = 0; h < this.tiers.length; h++)
                        this.tiers[h].pentagramAbility = {
                            cooldown: t,
                            range: e * Math.pow(1.15, h),
                            damage: i * Math.pow(a.DAMAGE_SCALE, h),
                            poison: {
                                damage: s.damage / 22.5 * Math.pow(a.DAMAGE_SCALE, h),
                                duration: 22.5 * s.duration * Math.pow(1.1, h)
                            },
                            speedDebuff: {
                                multiplier: n.multiplier,
                                duration: 22.5 * n.duration * Math.pow(1.1, h)
                            }
                        };
                    return this
                }
                setLightning(t, e, i, s=1, n=!1) {
                    for (let h = 0; h < this.tiers.length; h++) {
                    const multiplier = a.DAMAGE_SCALE[h] ?? 1;
                        this.tiers[h].lightning = {
                            bounces: t instanceof Array ? t[h] ?? t[t.length - 1] : t,
                            range: e,
                            damage: i * multiplier,
                            charges: s instanceof Array ? s[h] ?? s[s.length - 1] : s,
                            lightningOnParentHit: n
                        };
                    }
                    return this
                }
                setExtraPickupRange(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraPickupRange = t * Math.pow(1.35, e);
                    return this
                }
                setDamageReflection(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].damageReflection = t * Math.pow(4 / 3, e);
                    return this
                }
                setAttractsLightning(t) {
                    return this.attractsLightning = t,
                    this
                }
                setMobPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.MOB_DAMAGE_SCALE[i] ?? 1;
                        this.tiers[i].poison = {
                            damage: t / 22.5 * multiplier,
                            duration: e * 22.5
                        };
                    }
                    return this
                }
                setDensity(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                    const multiplier = a.MASS_SCALE[i] ?? 1;
                        this.tiers[i].density = t * multiplier
                    }
                    return this
                }
                setDeathDefying(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].deathDefying = t * Math.pow(1.1883, e);
                    return this
                }
                setPhases(t) {
                    return this.phases = Boolean(t),
                    this
                }
                setCollisions(collisions) {
                    return this.collisions = collisions,
                    this
                }
                setAbsorbsDamage(t, e) {
                    const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].absorbsDamage = {
                            absorbPercent: 0.9,
                            maxDamage: 0,
                            period: e instanceof Array ? e[i] ?? e[e.length - 1] : e
                        };
                    return this
                }
                setPlaceDown(t) {
                    return this.canPlaceDown = Boolean(t),
                    this
                }
                setShield(t) {
                        const multiplier = a.HEALTH_SCALE[e] ?? 1;
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].shield = t instanceof Array ? t[e] ?? t[t.length - 1] : t * multiplier;
                    return this
                }
                setBoost(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].boost = {
                            length: t instanceof Array ? t[i] ?? t[t.length - 1] : t,
                            delay: e instanceof Array ? e[i] ?? e[e.length - 1] : e
                        };
                    return this
                }
                setHealBack(t) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const multiplier = a.HEAL_SCALE[e] ?? 1;
                        this.tiers[e].healBack = t * multiplier;
                    }
                    return this;
                }
                setAttractsAggro(t) {
                    return this.attractsAggro = Boolean(t),
                    this
                }
                setIgnoreWalls(t) {
                    return this.ignoreWalls = Boolean(t),
                    this
                }
                setLighting(t) {
                    return this.extraLighting = t,
                    this
                }
                setSOS(t) {
                    return this.SOS = t,
                    this
                }
                setFinalHit(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                        const base = typeof t === "number" ? t : t.damage;
                        this.tiers[i].finalHit = { damage: base * multiplier };
                    }
                    return this;
                }
                setOddsDamage(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = a.DAMAGE_SCALE[i] ?? 1;
                        const base = typeof t === "number" ? t : t.damage;
                        this.tiers[i].oddsDamage = { damage: base * multiplier };
                    }
                    return this;
                }
                setExtraDamage(t, e, i) {
                    if (t instanceof Array) {
                        for (let d = 0; d < this.tiers.length; d++) {
                            const multiplier = a.DAMAGE_SCALE[d] ?? 1;
                            this.tiers[d].extraDamage = {
                                minHp: t[Math.min(d, t.length - 1)],
                                maxHp: e,
                                multiplier: i * multiplier
                            };
                        }
                    } else {
                        for (let d = 0; d < this.tiers.length; d++) {
                            const multiplier = a.HEAL_SCALE[d] ?? 1;
                            this.tiers[d].extraDamage = {
                                minHp: t,
                                maxHp: e,
                                multiplier: i * multiplier
                            };
                        }
                    }
                
                    const currentTier = this.tiers[this.rarity ?? 0];
                    if (currentTier?.extraDamage) this.extraDamage = currentTier.extraDamage;
                
                    return this;
                }
            }   
            class r {
                index = 0;
                minRarity = 0;
                chance = 1
            }
            class o {
                static idAccumulator = 0;
                #e() {
                    const t = [];
                    for (let e = 0; e < s.length; e++)
                        t.push(new n(e,this.health,this.damage,this.size));
                    return t
                }
                constructor(t, e, i, s, a) {
                    this.id = o.idAccumulator++,
                    this.name = t,
                    this.health = e,
                    this.damage = i,
                    this.size = s,
                    this.speed = a,
                    this.aggressive = !1,
                    this.henchmen = 0,
                    this.boss = 0,
                    this.neutral = !1,
                    this.destruct = 0,
                    this.emeralded = 0,
                    this.finalHit = 0,
                    this.oddsDamage = 0,
                    this.healingReduction = 0,
                    this.healing = 0,
                    this.spawnable = !0,
                    this.sandstormMovement = !1,
                    this.centiMovement = !1,
                    this.damageReflection = 0,
                    this.tiers = this.#e(),
                    this.drops = [],
                    this.drawing = null,
                    this.hatchables = null,
                    this.poopable = null,
                    this.isSystem = !1,
                    this.movesInBursts = !1,
                    this.moveInSines = !1,
                    this.pushability = 1,
                    this.sizeRand = {
                        min: 1,
                        max: 0
                    }
                }
                setSystem(t) {
                    return this.isSystem = Boolean(t),
                    this
                }
                setMovesInBursts(t) {
                    return this.movesInBursts = Boolean(t),
                    this
                }
                setAggressive(t) {
                    return this.aggressive = Boolean(t),
                    this
                }
                setNeutral(t) {
                    return this.neutral = t,
                    this
                }
                setSandstormMovement(t) {
                    return this.sandstormMovement = Boolean(t),
                    this
                }
                setCentiMovement(t) {
                    return this.centiMovement = Boolean(t),
                    this
                }
                setDecays(t) {
                    return this.decays = t,
                    this
                }
                setFinalHit(t) {
                    return this.finalHit = t,
                    this
                }
                setOddsDamage(t) {
                    return this.oddsDamage = t,
                    this
                }
                setHealingReduction(t) {
                    return this.healingReduction = t,
                    this
                }
                setDamageReduction(t) {
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = a.HEAL_SCALE[i] ?? 1;
                        this.tiers[i].damageReduction = t * multiplier;
                    }
                    return this
                }
                setDamageReflection(t) {
                    return this.damageReflection = t,
                    this
                }
                setProjectile(t = {}) {
                    for (let e = 0; e < this.tiers.length; e++) {
                        const healthMultiplier = n.HEALTH_SCALE[e] ?? 1;
                        const damageMultiplier = n.DAMAGE_SCALE[e] ?? 1;
                        const sizeMultiplier = n.SIZE_SCALE[e] ?? 1;
                        this.tiers[e].projectile = {
                            petalIndex: t.petalIndex ?? 0,
                            cooldown: t.cooldown ?? 10,
                            health: (t.health ?? 1) * healthMultiplier,
                            damage: (t.damage ?? 1) * damageMultiplier,
                            speed: t.speed ?? 5 * sizeMultiplier,
                            range: (t.range ?? 50) * 1,
                            size: t.size ?? 0.35,
                            multiShot: t.multiShot ?? null,
                            runs: t.runs ?? false,
                            nullCollision: t.nullCollision ?? false,
                            aimbot: t.aimbot ?? false
                        };
                    }
                    return this;
                }
                setMOBPetal(petal) {
                    return this.MOBpetal = petal,
                    this;
                }
                addDrop(t, e = 1, minDropRarity = 0, minMobRarity = 0) {
                    if (t < 0 || t > 255)
                        throw new Error("Invalid drop index");
                
                    const s = new r();
                    s.index = t;
                    s.minRarity = minDropRarity;
                    s.minMobRarity = minMobRarity;
                
                    s.tiers = Array.from({ length: this.tiers.length }, (_, a) => {
                        let chance;
                        if (Array.isArray(e)) {
                            chance = e[Math.min(a, e.length - 1)];
                        } else {
                            chance = e;
                        }
                        return { chance }; 
                    });
                
                    this.drops.push(s);
                    return this;
                }
                setPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++) {
                     const multiplier = n.DAMAGE_SCALE[i] ?? 1;

                        this.tiers[i].poison = {
                            damage: t / 22.5 * multiplier,
                            duration: 22.5 * e
                        };
                    }
                    return this
                }
                setLightning(t, e, i, s) {
                    for (let z = 0; n < this.tiers.length; z++) {
                        const multiplier = n.DAMAGE_SCALE[z] ?? 1;
                        this.tiers[z].lightning = {
                            cooldown: t instanceof Array ? t[z] ?? t[t.length - 1] : t,
                            bounces: e instanceof Array ? e[z] ?? e[e.length - 1] : e,
                            range: i * Math.pow(1.15, z),
                            damage: s * multiplier
                        };
                    }
                    return this;
                }
                setSize(t, e=n.SIZE_SCALE, i=1, s=0) {
                    this.size = t;
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].size = t * Math.pow(e, i);
                    return this.sizeRand = {
                        min: i,
                        max: s
                    },
                    this
                }
                setAntHoleSpawns(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].antHoleSpawns = t.map(( ({index: t, count: i, minHealthRatio: s}) => ({
                            index: t,
                            count: i instanceof Array ? i[e] ?? i[i.length - 1] : i,
                            minHealthRatio: s ?? 1
                        })));
                    return this
                }
                setDestruct(t) {
                    return this.destruct = t,
                    this
                }
                setHatchables(t) {
                    if (t instanceof Array) {
                        for (let e = 0; e < t.length; e++)
                            if (t[e].index < 0 || t[e].index > 255)
                                throw new Error("Invalid hatchable index");
                        this.hatchables = t
                    } else {
                        if (t.index < 0 || t.index > 255)
                            throw new Error("Invalid hatchable index");
                        this.hatchables = [t]
                    }
                    return this
                }
                setPoopable(t) {
                    if (t.index < 0 || t.index > 255)
                        throw new Error("Invalid poopable index");
                    return this.poopable = t,
                    this
                }
                segmentWith(t) {
                    return this.segment = t,
                    this
                }
                setMoveInSines(t) {
                    return this.moveInSines = Boolean(t),
                    this
                }
                setSpins(t, e=!1) {
                    return this.spins = {
                        rate: t,
                        constant: Boolean(e)
                    },
                    this
                }
                setFleeAtLowHealth(t) {
                    return this.fleeAtLowHealth = t,
                    this
                }
                setHealing(t) {
                    const base = t ?? this.healing ?? 0;
                    this.healing = base;
                    for (let i = 0; i < this.tiers.length; i++) {
                        const multiplier = n.HEALTH_SCALE[i] ?? 1;
                        this.tiers[i].healing = base * multiplier;
                    }
                    return this;
                }
                setPushability(t) {
                    return this.pushability = t,
                    this
                }
                branchWith(t, e, i) {
                    return this.branch = {
                        index: t,
                        branches: e,
                        branchLength: i
                    },
                    this
                }
                setStrafes(t, e, i) {
                    return this.strafes = {
                        length: t,
                        cooldown: e,
                        speedMult: i
                    },
                    this
                }
            }
            const l = {
                KICK: 0,
                READY: 1,
                MESSAGE: 2,
                WORLD_UPDATE: 3,
                DEATH: 4,
                ROOM_UPDATE: 5,
                UPDATE_ASSETS: 6,
                JSON_MESSAGE: 7,
                PONG: 8,
                TERRAIN: 9,
                CHAT_MESSAGE: 10
            }
              , d = {
                VERIFY: 0,
                SPAWN: 1,
                INPUTS: 2,
                CHANGE_LOADOUT: 3,
                DEV_CHEAT: 4,
                PING: 5,
                CHAT_MESSAGE: 6
            }
              , c = {
                TELEPORT: 0,
                GODMODE: 1,
                CHANGE_TEAM: 2,
                SPAWN_MOB: 3,
                SET_PETAL: 4,
                SET_XP: 5,
                INFO_DUMP: 6
            }
              , g = {
                NEW: 0,
                DIE: 1,
                POSITION: 2,
                SIZE: 4,
                FACING: 8,
                FLAGS: 16,
                HEALTH: 32,
                DISPLAY: 64,
                ROPE_BODIES: 128
            }
              , p = {
                HIT: 1,
                POISON: 2,
                ATTACK: 4,
                DEFEND: 8,
                TDM: 16,
                FRIEND: 32,
                WEARABLES: 64
            }
              , u = {
                ANTENNAE: 1,
                THIRD_EYE: 2,
                CUTTER: 4,
                AMULET: 8,
                AIR: 16,
                ARMOR: 32
            }
              , m = {
                CLOSE_CLIENT: 0,
                PIPE_PACKET: 1,
                ANALYTICS_DATA: 3
            }
              , y = {
                STANDARD: 0,
                PLAYER: 1,
                PETAL: 2,
                MOB: 3,
                PROJECTILE: 4
            }
              , f = {
                DEFAULT: 0,
                GARDEN: 1,
                DESERT: 2,
                OCEAN: 3,
                ANT_HELL: 4,
                HELL: 5,
                SEWERS: 6,
                DARK_FOREST: 7,
                HALLOWEEN: 8
            }
              , A = {
                [f.DEFAULT]: {
                    name: "Default",
                    color: "#718083",
                    tile: "tiles/allMobs.svg"
                },
                [f.GARDEN]: {
                    name: "Garden",
                    color: "#1EA660",
                    tile: "tiles/garden.svg"
                },
                [f.DESERT]: {
                    name: "Desert",
                    color: "#ECDCB8",
                    tile: "tiles/desert.svg"
                },
                [f.OCEAN]: {
                    name: "Ocean",
                    color: "#6D96BE",
                    tile: "tiles/ocean.svg",
                    alt: "tiles/oceanAlt.svg"
                },
                [f.ANT_HELL]: {
                    name: "Ant Hell",
                    color: "#8E603F",
                    tile: "tiles/antHell.svg"
                },
                [f.HELL]: {
                    name: "Hell",
                    color: "#973332",
                    tile: "tiles/hell.svg"
                },
                [f.SEWERS]: {
                    name: "Sewers",
                    color: "#676733",
                    tile: "tiles/sewer.svg"
                },
                [f.DARK_FOREST]: {
                    name: "Dark Forest",
                    color: "#2C5037",
                    tile: "tiles/forest.svg"
                },
                [f.HALLOWEEN]: {
                    name: "Halloween",
                    color: "#CF5704",
                    tile: "tiles/pumpkin.svg"
                }
            };
            class w {
                static actions = {
                    circle: [0, "x", "y", "radius"],
                    rect: [1, "x", "y", "width", "height"],
                    text: [2, "x", "y", "size", "text"],
                    line: [3, "x1", "y1", "x2", "y2"],
                    arc: [4, "x", "y", "radius", "startAngle", "endAngle"],
                    beginPath: [5],
                    closePath: [6],
                    moveTo: [7, "x", "y"],
                    lineTo: [8, "x", "y"],
                    stroke: [9, "color", "lineWidth"],
                    fill: [10, "color"],
                    paint: [11, "color", "lineWidth"],
                    polygon: [12, "sides", "radius", "rotation"],
                    spikeBall: [13, "sides", "radius", "rotation"],
                    dipPolygon: [14, "sides", "radius", "dipMult"],
                    opacity: [15, "opacity"],
                    blur: [16, "color", "strength"],
                    noBlur: [17]
                };
                static reverseActions = Object.fromEntries(Object.keys(w.actions).map((t => [w.actions[t][0], t])));
                static fromString(t) {
                    const e = new w;
                    return e.actions = t.split(";").map((t => {
                        const [e,...i] = t.split(",").map((t => {
                            if ("" !== t)
                                return "#" === t[0] ? t : parseFloat(t)
                        }
                        ));
                        return [e, ...i]
                    }
                    )),
                    e
                }
                constructor() {
                    this.actions = []
                }
                addAction(t, ...e) {
                    const i = w.actions[t];
                    if (!i)
                        throw new Error(`Unknown action: ${t}`);
                    if (e.length !== i.length - 1)
                        throw new Error(`Invalid number of arguments for action ${t}, please provide ${i.slice(1).join(", ")}`);
                    return this.actions.push([i[0], ...e]),
                    this
                }
                getActions(t) {
                    return this.actions.filter((e => e[0] === w.actions[t][0]))
                }
                toString() {
                    return this.actions.map((t => t.join(","))).join(";")
                }
            }
            e.wDrawing = w;
            class b {
                constructor(t, e, i) {
                    this.reader = !0,
                    this._e = i,
                    t && this.repurpose(t, e)
                }
                repurpose(t, e) {
                    this.view = t,
                    this._o = e || 0
                }
                getUint8() {
                    return this.view.getUint8(this._o++, this._e)
                }
                getInt8() {
                    return this.view.getInt8(this._o++, this._e)
                }
                getUint16() {
                    return this.view.getUint16((this._o += 2) - 2, this._e)
                }
                getInt16() {
                    return this.view.getInt16((this._o += 2) - 2, this._e)
                }
                getUint32() {
                    return this.view.getUint32((this._o += 4) - 4, this._e)
                }
                getInt32() {
                    return this.view.getInt32((this._o += 4) - 4, this._e)
                }
                getFloat32() {
                    return this.view.getFloat32((this._o += 4) - 4, this._e)
                }
                getFloat64() {
                    return this.view.getFloat64((this._o += 8) - 8, this._e)
                }
                getStringUTF8() {
                    let t, e = "";
                    for (; 0 !== (t = this.view.getUint8(this._o++)); )
                        e += String.fromCharCode(t);
                    return decodeURIComponent(escape(e))
                }
            }
            class M {
                constructor(t) {
                    return this.writer = !0,
                    this.tmpBuf = new DataView(new ArrayBuffer(8)),
                    this._e = t,
                    this.reset(),
                    this
                }
                reset(t=this._e) {
                    this._e = t,
                    this._b = [],
                    this._o = 0
                }
                setUint8(t) {
                    return t >= 0 && t < 256 && this._b.push(t),
                    this
                }
                setInt8(t) {
                    return t >= -128 && t < 128 && this._b.push(t),
                    this
                }
                setUint16(t) {
                    return this.tmpBuf.setUint16(0, t, this._e),
                    this._move(2),
                    this
                }
                setInt16(t) {
                    return this.tmpBuf.setInt16(0, t, this._e),
                    this._move(2),
                    this
                }
                setUint32(t) {
                    return this.tmpBuf.setUint32(0, t, this._e),
                    this._move(4),
                    this
                }
                setInt32(t) {
                    return this.tmpBuf.setInt32(0, t, this._e),
                    this._move(4),
                    this
                }
                setFloat32(t) {
                    return this.tmpBuf.setFloat32(0, t, this._e),
                    this._move(4),
                    this
                }
                setFloat64(t) {
                    return this.tmpBuf.setFloat64(0, t, this._e),
                    this._move(8),
                    this
                }
                _move(t) {
                    for (let e = 0; e < t; e++)
                        this._b.push(this.tmpBuf.getUint8(e))
                }
                setStringUTF8(t) {
                    const e = unescape(encodeURIComponent(t));
                    for (let t = 0, i = e.length; t < i; t++)
                        this._b.push(e.charCodeAt(t));
                    return this._b.push(0),
                    this
                }
                build() {
                    return new Uint8Array(this._b)
                }
            }
            function x(t) {
                const e = [t.id, t.name, t.description, t.cooldown, 0]
                  , i = e.length - 1;
                return 0 !== t.tiers[0].extraHealth && (e[i] |= 1),
                t.tiers[0].constantHeal > 0 && (e[i] |= 2),
                t.tiers.some((t => t.count > 1)) && (e[i] |= 4),
                t.tiers[0].damageReduction > 0 && (e[i] |= 8),
                1 !== t.tiers[0].speedMultiplier && (e[i] |= 16),
                0 !== t.tiers[0].extraSize && (e[i] |= 32),
                t.tiers[0].healing > 0 && (e[i] |= 64),
                t.tiers[0].extraRadians > 0 && (e[i] |= 128),
                t.tiers[0].poison && (e[i] |= 1024),
                t.tiers[0].extraRange > 0 && (e[i] |= 2048),
                t.tiers[0].spawnable && (e[i] |= 8192),
                t.tiers[0].extraVision > 0 && (e[i] |= 16384),
                t.tiers[0].pentagramAbility && (e[i] |= 32768),
                t.tiers[0].lightning && (e[i] |= 65536),
                t.tiers[0].extraPickupRange > 0 && (e[i] |= 131072),
                t.healSpit?.heal > 0 && (e[i] |= 262144),
                t.tiers[0].damageReflection > 0 && (e[i] |= 524288),
                1 !== t.tiers[0].density && (e[i] |= 1048576),
                t.tiers[0].deathDefying > 0 && (e[i] |= 2097152),
                t.tiers[0].absorbsDamage && (e[i] |= 4194304),
                t.tiers[0].shield > 0 && (e[i] |= 8388608),
                null !== t.tiers[0].boost && (e[i] |= 16777216),
                t.tiers[0].healBack > 0 && (e[i] |= 67108864),
                t.extraLighting > 0 && (e[i] |= 134217728),
                e.push(...t.tiers.flatMap(( (s, n) => {
                    const h = [s.health, s.damage];
                    return 1 & e[i] && h.push(s.extraHealth),
                    2 & e[i] && h.push(s.constantHeal),
                    4 & e[i] && h.push(s.count),
                    8 & e[i] && h.push(s.damageReduction),
                    16 & e[i] && h.push(s.speedMultiplier),
                    32 & e[i] && h.push(s.extraSize),
                    64 & e[i] && h.push(s.healing),
                    128 & e[i] && h.push(s.extraRadians),
                    1024 & e[i] && h.push(s.poison.damage, s.poison.duration),
                    2048 & e[i] && h.push(s.extraRange),
                    8192 & e[i] && h.push(s.spawnable.index, s.spawnable.rarity, s.spawnable.timer),
                    16384 & e[i] && h.push(s.extraVision),
                    32768 & e[i] && h.push(s.pentagramAbility.cooldown, s.pentagramAbility.range, s.pentagramAbility.damage, s.pentagramAbility.poison.damage, s.pentagramAbility.poison.duration, s.pentagramAbility.speedDebuff.multiplier, s.pentagramAbility.speedDebuff.duration),
                    65536 & e[i] && h.push(s.lightning.bounces, s.lightning.range, s.lightning.damage, s.lightning.charges),
                    131072 & e[i] && h.push(s.extraPickupRange),
                    262144 & e[i] && h.push(t.healSpit.heal * Math.pow(a.HEALTH_SCALE, n)),
                    524288 & e[i] && h.push(s.damageReflection),
                    1048576 & e[i] && h.push(s.density),
                    2097152 & e[i] && h.push(s.deathDefying),
                    4194304 & e[i] && h.push(s.absorbsDamage.maxDamage, s.absorbsDamage.period / 22.5),
                    8388608 & e[i] && h.push(s.shield),
                    16777216 & e[i] && h.push(s.boost.length, s.boost.delay / 22.5),
                    67108864 & e[i] && h.push(s.healBack),
                    h
                }
                ))),
                t.drawing?.toString().length > 0 && (e[i] |= 256,
                e.push(t.drawing.toString())),
                t.enemySpeedDebuff && (e[i] |= 512,
                e.push(t.enemySpeedDebuff.speedMultiplier, t.enemySpeedDebuff.duration)),
                t.wearable && (e[i] |= 4096),
                t.healWhenUnder < 1 && (e[i] |= 33554432,
                e.push(t.healWhenUnder)),
                134217728 & e[i] && e.push(t.extraLighting),
                t.extraDamage && (e[i] |= 268435456,
                e.push(t.extraDamage.minHp, t.extraDamage.maxHp, t.extraDamage.multiplier)),
                e.map((t => Number.isFinite(t) ? +t.toFixed(2) : t))
            }
            function S(t) {
                return [t.id, t.name, +t.isSystem]
            }
            function D(t, e, i) {
                const s = [t.length, ...t.flatMap((t => [t.name, t.color]))];
                return s.push(...function(t) {
                    const e = [t.length];
                    for (const i of t) {
                        const t = x(i);
                        e.push(...t)
                    }
                    return e
                }(e)),
                s.push(...function(t) {
                    const e = [t.length];
                    for (const i of t) {
                        const t = S(i);
                        e.push(...t)
                    }
                    return e
                }(i)),
                s
            }
            const E = {};
            async function v() {
                const t = await fetch("/assets/terrains.json")
                  , e = await t.json();
                Object.assign(E, e)
            }
            const R = {
                TOP: 1,
                RIGHT: 2,
                BOTTOM: 4,
                LEFT: 8
            };
            function T(t) {
                const e = E[t];
                if (!e)
                    return {
                        id: [0, 0],
                        terrain: E[0][0]
                    };
                const i = Math.random() * e.length | 0;
                return {
                    id: [t, i],
                    terrain: e[i]
                }
            }
            const P = {
                FFA: 0,
                TDM: 1,
                WAVES: 2,
                LINE: 3,
                MAZE: 4
            }
        }
        ,
        111: (t, e, i) => {
            i.d(e, {
                A: () => B
            });
            var s = i(110)
              , a = i(512)
              , n = i(904)
              , h = i(446)
              , r = i(874);
            const o = [];
            fetch("/profanity.txt").then((t => t.text())).then((t => {
                o.push(...t.replaceAll("\r", "").split("\n").map((t => t.trim()))),
                console.log("Profanity list loaded", o.length, "words")
            }
            ));
            const l = [/\b([sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ][a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ][nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ][dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ])*[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌoÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏІіa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+(l[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+t+|[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]*|n[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0]+[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+|[a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*)*[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /[fḞḟƑƒꞘꞙᵮᶂ]+[aÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ@4]+[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+([ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅiÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[tŤťṪṫŢţṬṭȚțṰṱṮṯŦŧȾⱦƬƭƮʈT̈ẗᵵƫȶ]+([rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+)?)?[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌyÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]([rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+)?[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[tŤťṪṫŢţṬṭȚțṰṱṮṯŦŧȾⱦƬƭƮʈT̈ẗᵵƫȶ]+[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+([aÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ4]+[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+([iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+|[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+|[oÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ]+)|[oÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ]+)[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[cĆćĈĉČčĊċÇçḈḉȻȼꞒꞓꟄꞔƇƈɕ]+[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0]{2,}[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[cĆćĈĉČčĊċÇçḈḉȻȼꞒꞓꟄꞔƇƈɕ]+[hĤĥȞȟḦḧḢḣḨḩḤḥḪḫH̱ẖĦħⱧⱨꞪɦꞕΗНн]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/]
              , d = t => l.some((e => e.test(t)));
            class c {
                id = 0;
                name = "";
                nameColor = "#FFFFFF";
                rarity = 0;
                level = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                flags = 0;
                healthRatio = 1;
                shieldRatio = 0;
                team = 0;
                wearing = 0;
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                updateHealth = !1;
                updateDisplay = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0);
                    let e = 0;
                    t.hit > 0 && (e |= s.so.HIT),
                    t.attack && (e |= s.so.ATTACK),
                    t.defend && (e |= s.so.DEFEND),
                    t.poison.timer > 0 && (e |= s.so.POISON);
                    let i = Math.min(255, Math.max(0, t.team < 0 ? -t.team : 0));
                    i !== this.team && (this.team = i,
                    e |= s.so.TDM);
                    let a = 0;
                    for (const e in s.DQ)
                        t.wearing[s.DQ[e]] > 0 && (a |= s.DQ[e]);
                    a !== this.wearing && (this.wearing = a,
                    e |= s.so.WEARABLES),
                    e !== this.flags && (this.flags = e,
                    this.updateFlags = !0),
                    this.healthRatio === t.health.ratio && this.shieldRatio === t.health.shieldRatio || (this.healthRatio = t.health.ratio,
                    this.shieldRatio = t.health.shieldRatio,
                    this.updateHealth = !0),
                    this.rarity === t.rarity && this.level === t.level && this.name === t.name && this.nameColor === t.nameColor || (this.rarity = t.rarity,
                    this.level = t.level,
                    this.name = t.name,
                    this.nameColor = t.nameColor,
                    this.updateDisplay = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags || this.updateHealth || this.updateDisplay) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setStringUTF8(this.name),
                            t.setStringUTF8(this.nameColor),
                            t.setUint8(this.rarity),
                            t.setUint16(this.level),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            t.setUint8(this.flags),
                            this.flags & s.so.TDM && t.setUint8(this.team),
                            this.flags & s.so.WEARABLES && t.setUint8(this.wearing),
                            t.setUint8(255 * this.healthRatio + .5 | 0),
                            void t.setUint8(255 * this.shieldRatio + .5 | 0);
                        t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0) | (this.updateHealth ? s.w6.HEALTH : 0) | (this.updateDisplay ? s.w6.DISPLAY : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.flags),
                        this.flags & s.so.TDM && t.setUint8(this.team),
                        this.flags & s.so.WEARABLES && t.setUint8(this.wearing)),
                        this.updateHealth && (this.updateHealth = !1,
                        t.setUint8(255 * this.healthRatio + .5 | 0),
                        t.setUint8(255 * this.shieldRatio + .5 | 0)),
                        this.updateDisplay && (this.updateDisplay = !1,
                        t.setStringUTF8(this.name),
                        t.setStringUTF8(this.nameColor),
                        t.setUint8(this.rarity),
                        t.setUint16(this.level))
                    }
                }
            }
            class g {
                id = 0;
                index = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                hit = !1;
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0),
                    this.hit !== t.hit && (this.hit = t.hit > 0,
                    this.updateFlags = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setUint8(this.index),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            void t.setUint8(this.hit ? s.so.HIT : 0);
                        t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.hit ? s.so.HIT : 0))
                    }
                }
            }
            class p {
                id = 0;
                index = 0;
                rarity = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                flags = 0;
                healthRatio = 1;
                ropeBodies = [];
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                updateHealth = !1;
                updateRopeBodies = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0);
                    let e = 0;
                    if (t.hit > 0 && (e |= s.so.HIT),
                    t.ropeBodies?.length > 0) {
                        this.updateRopeBodies = !0,
                        this.ropeBodies = [{
                            x: 0,
                            y: 0
                        }];
                        for (let i = 0; i < t.ropeBodies.length; i++)
                            t.ropeBodies[i].hit > 0 && 0 === (e & s.so.HIT) && (e |= s.so.HIT),
                            this.ropeBodies.push({
                                x: (t.ropeBodies[i].x - this.x) / this.size,
                                y: (t.ropeBodies[i].y - this.y) / this.size
                            })
                    }
                    null !== t.target && (e |= s.so.ATTACK),
                    t.poison.timer > 0 && (e |= s.so.POISON),
                    t.friendly && (e |= s.so.FRIEND),
                    e !== this.flags && (this.flags = e,
                    this.updateFlags = !0),
                    this.healthRatio !== t.health.ratio && (this.healthRatio = t.health.ratio,
                    this.updateHealth = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags || this.updateHealth || this.updateRopeBodies) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setUint8(this.index),
                            t.setUint8(this.rarity),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            t.setUint8(this.flags),
                            void t.setUint8(255 * this.healthRatio + .5 | 0);
                        if (t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0) | (this.updateHealth ? s.w6.HEALTH : 0) | (this.updateRopeBodies ? s.w6.ROPE_BODIES : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.flags)),
                        this.updateHealth && (this.updateHealth = !1,
                        t.setUint8(255 * this.healthRatio + .5 | 0)),
                        this.updateRopeBodies) {
                            this.updateRopeBodies = !1,
                            t.setUint8(this.ropeBodies.length);
                            for (let e = 0; e < this.ropeBodies.length; e++)
                                t.setFloat32(this.ropeBodies[e].x),
                                t.setFloat32(this.ropeBodies[e].y)
                        }
                    }
                }
            }
            class u {
                id = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                creation = 0;
                timer = 0;
                pipe(t) {
                    this.isNew && (this.isNew = !1,
                    t.setUint32(this.id),
                    t.setUint8(s.w6.NEW),
                    t.setFloat32(this.x),
                    t.setFloat32(this.y),
                    t.setFloat32(this.size),
                    t.setStringUTF8(this.creation),
                    t.setUint32(this.timer + .5 | 0))
                }
                kill(t) {
                    t.setUint32(this.id),
                    t.setUint8(s.w6.DIE)
                }
            }
            class m {
                x = 0;
                y = 0;
                fov = 500;
                lightingBoost = 0;
                playerCache = new Map;
                petalCache = new Map;
                mobCache = new Map;
                markerCache = new Map;
                lightningCache = new Set;
                dropsToAdd = [];
                dropsToRemove = [];
                see(t) {
                    const e = a.A.viewsSpatialHash.retrieve({
                        _AABB: {
                            x1: this.x - this.fov / 2,
                            y1: this.y - this.fov / 2,
                            x2: this.x + this.fov / 2,
                            y2: this.y + this.fov / 2
                        }
                    });
                    e.forEach((t => {
                        switch (t.type) {
                        case s.wv.PLAYER:
                            if (!this.playerCache.has(t.id)) {
                                const e = new c;
                                e.id = t.id,
                                e.name = t.name,
                                e.nameColor = t.nameColor,
                                e.isNew = !0,
                                this.playerCache.set(t.id, e)
                            }
                            this.playerCache.get(t.id).update(t);
                            break;
                        case s.wv.PETAL:
                            if (!this.petalCache.has(t.id)) {
                                const e = new g;
                                e.id = t.id,
                                e.index = t.index,
                                e.isNew = !0,
                                this.petalCache.set(t.id, e)
                            }
                            this.petalCache.get(t.id).update(t);
                            break;
                        case s.wv.MOB:
                            if (t.lastSeen = performance.now(),
                            !this.mobCache.has(t.id)) {
                                const e = new p;
                                e.id = t.id,
                                e.index = t.index,
                                e.rarity = t.rarity,
                                e.isNew = !0,
                                this.mobCache.set(t.id, e)
                            }
                            this.mobCache.get(t.id).update(t)
                        }
                    }
                    )),
                    this.playerCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.playerCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.petalCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.petalCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.mobCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.mobCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToAdd.forEach((e => {
                        t.setUint32(e.id),
                        t.setFloat32(e.x),
                        t.setFloat32(e.y),
                        t.setFloat32(e.size),
                        t.setUint8(e.index),
                        t.setUint8(e.rarity)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToRemove.forEach((e => {
                        t.setUint32(e.id)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToAdd.length = 0,
                    this.dropsToRemove.length = 0,
                    a.A.pentagrams.forEach((e => {
                        if (!this.markerCache.has(e.id)) {
                            const i = new u;
                            i.id = e.id,
                            i.isNew = !0,
                            i.x = e.x,
                            i.y = e.y,
                            i.size = e.size,
                            i.creation = e.createdAt,
                            i.timer = e.timer,
                            this.markerCache.set(e.id, i),
                            i.pipe(t)
                        }
                    }
                    )),
                    this.markerCache.forEach((e => {
                        a.A.pentagrams.has(e.id) || (e.kill(t),
                        this.markerCache.delete(e.id))
                    }
                    )),
                    t.setUint32(0),
                    a.A.lightning.forEach((e => {
                        if (!this.lightningCache.has(e.id)) {
                            t.setUint32(e.id),
                            t.setUint16(e.points.length);
                            for (const i of e.points)
                                t.setFloat32(i.x),
                                t.setFloat32(i.y);
                            this.lightningCache.add(e.id)
                        }
                    }
                    )),
                    t.setUint32(0),
                    this.lightningCache.forEach((t => {
                        a.A.lightning.has(t) || this.lightningCache.delete(t)
                    }
                    ))
                }
            }
            class y {
                constructor(t) {
                    this.uuid = t.uuid,
                    this.username = t.username,
                    this.level = t.level,
                    this.xp = t.xp,
                    this.slots = t.slots,
                    this.secondarySlots = t.secondarySlots,
                    this.body = t.body,
                    this.team = t.team,
                    f.disconnects.set(this.uuid, this),
                    this.body && (this.body.client = null),
                    this.timeout = setTimeout(( () => {
                        f.disconnects.delete(this.uuid),
                        this.body && !this.body.health.isDead && this.body.destroy()
                    }
                    ), 864e5)
                }
            }
            class f {
                static clients = new Map;
                static disconnects = new Map;
                constructor(t, e, i=0) {
                    this.id = t,
                    this.verified = !1,
                    this.divergenceUses = 2,
                    this.deathID = null,
                    this.startingWave = 0,
                    this.username = "unknown",
                    this.dontCraft = this.dontCraft || new Set();
                    this.inventory = {};
                    this.uuid = e,
                    this.nameColor = ["#66CCFF", "#D85555"][+i],
                    this.masterPermissions = +i,
                    this.camera = new m,
                    this.body = null,
                    a.A.clients.set(t, this),
                    console.log(`Client ${t} connected`);
                    
                    this.systemMessage("Welcome to SleepyWaves!", "#ff7591");
                    
                    setTimeout(() => {
                        this.systemMessage("Use /help to learn the commands!", "#ca75ff");
                    }, 3000);

                    setTimeout(() => {
                        this.systemMessage("Join the discord: https://discord.gg/bhSbwqyqPB", "#7577ff");
                    }, 6000);
                    this.team = !1,
                    a.A.isTDM && (this.team = 0,
                    a.A.teamCount > 0 && (this.team = (this.id - 1) % a.A.teamCount + 1)),
                    this.slots = new Array(5).fill(null).map(( () => ({
                        id: 0,
                        rarity: 0
                    }))),
                    this.slotRatios = new Array(5).fill(0).map(( () => 0)),
                    this.secondarySlots = new Array(5).fill(null).map(( () => null)),
                    this.level = 1,
                    this.xp = 1,
                    this.levelProgress = 0,
                    this.lastChat = 0,
                    this.frownyMessages = 0
                }
                addXP(t) {
                    if (!Number.isFinite(t)) return;
                
                    this.xp += t;
                
                    const xpForLevel = (lvl) => {
                        return Math.exp(lvl / 11.18213) / 0.000480827337943866 - 2080;
                    };
                
                    for (; this.xp < xpForLevel(this.level - 1); ) {
                        this.level--;
                        if (this.body && !this.body.health.isDead) {
                            this.body.health.set(
                                this.healthAdjustement +
                                this.body.petalSlots.reduce(
                                    (sum, slot) => sum + slot.config.tiers[slot.rarity].extraHealth,
                                    0
                                )
                            );
                            this.body.damage = this.bodyDamageAdjustment;
                        }
                    }
                    for (; this.xp >= xpForLevel(this.level); ) {
                        this.level++;
                        if (this.body && !this.body.health.isDead) {
                            this.body.health.set(
                                this.healthAdjustement +
                                this.body.petalSlots.reduce(
                                    (sum, slot) => sum + slot.config.tiers[slot.rarity].extraHealth,
                                    0
                                )
                            );
                            this.body.damage = this.bodyDamageAdjustment;
                        }
                    }
                
                    let e = 5 + Math.min(5, Math.floor(this.level / 7.5));
                    if (e !== this.slots.length) {
                        if (e > this.slots.length) {
                            for (let i = this.slots.length; i < e; i++) {
                                this.slots.push({ id: 0, rarity: 0 });
                                this.secondarySlots.push(null);
                            }
                        } else if (e < this.slots.length) {
                            for (let i = this.slots.length - 1; i >= e; i--) {
                                this.slots.pop();
                                this.secondarySlots.pop();
                            }
                        }
                        if (this.body && !this.body.health.isDead) {
                            this.body.initSlots(e);
                        }
                    }
                
                    const lowerXp = xpForLevel(this.level - 1);
                    const upperXp = xpForLevel(this.level);
                    this.levelProgress = (this.xp - lowerXp) / (upperXp - lowerXp);
                }          
                get healthAdjustement() {
                        let level = Math.floor(this.level);
                    return (level**3/3600 + level**2/25 + 4 * level) ** 1.33 / 10 + 100;
                }
                get bodyDamageAdjustment() {
                    return 10
                }
                get highestRarity() {
                    let t = 0;
                    for (const e of this.slots)
                        e.rarity > t && (t = e.rarity);
                    for (const e of this.secondarySlots)
                        e && e.rarity > t && (t = e.rarity);
                    return t
                } 
                pickupDrop(t) {
                    const PETALS = [
                        "Basic","Light","Faster","Heavy","Stinger","Rice","Rock","Cactus","Leaf","Wing",
                        "Bone","Dirt","Magnolia","Corn","Sand","Orange","Missile","Pea","Rose","Yin Yang",
                        "Pollen","Honey","Iris","Web","web.mob.launched","Third Eye","Pincer","Beetle Egg",
                        "Antennae","Peas","Stick","scorpion.projectile","Dahlia","Primrose","Fire Spellbook",
                        "Deity","Lightning","Powder","Ant Egg","Yucca","Magnet","Amulet","Jelly","Yggdrasil",
                        "Glass","Dandelion","Sponge","Pearl","Shell","Bubble","Air","Starfish","Fang","Goo",
                        "Maggot Poo","Lightbulb","Battery","Dust","Armor","wasp.projectile","Shrub","projectile.grape",
                        "Grapes","Lantern","web.player.launched","Branch","Leech Egg","Hornet Egg","Candy",
                        "Claw","projectile.diep_bullet","Square Egg","Triangle Egg","Pentagon Egg","Bud",
                        "Fig","Fig.explosion","Amulet of Divergence","Tree","Bloom","Root.mob","Coconut",
                        "husk","Cinderleaf","Cinder.explosion","Root","Emerald","Blood Stinger","Blood Corn",
                        "Blood Light","Ruby","Fire Missile", "fire.projectile", "Sandstone", "missile.projectile",
                        "Moonlit Frog", "SunlitFrog","Ruby Frog","Moth","Mandible"
                    ];         
                    let rarityName = "Common";
                    try {
                        rarityName = s?.[t.rarity]?.name || `Rarity_${t.rarity ?? 0}`;
                    } catch (e) {
                        console.warn("pickupDrop: could not resolve rarity", e, t);
                    }
                
                    let petalName = "Unknown";
                    try {
                        const idx = Number(t.index);
                        if (!Number.isNaN(idx) && idx >= 0 && idx < PETALS.length) {
                            petalName = PETALS[idx];
                        } else {
                            petalName = `Petal_${idx}`;
                        }
                    } catch (e) {
                        console.warn("pickupDrop: could not resolve petal", e, t);
                    }
                
                    if (!this.inventory[rarityName]) {
                        this.inventory[rarityName] = { __total: 0 };
                    } else if (typeof this.inventory[rarityName] === "number") {
                        this.inventory[rarityName] = { __total: this.inventory[rarityName] };
                    }
                
                    const value = (t.value && t.value > 0) ? Number(t.value) : 1;
                
                    this.inventory[rarityName][petalName] =
                        (this.inventory[rarityName][petalName] || 0) + value;
                    this.inventory[rarityName].__total =
                        (this.inventory[rarityName].__total || 0) + value;
                
                    if (t && typeof t.destroy === "function") {
                        t.destroy();
                    } else {
                        console.warn("pickupDrop: no destroy method on drop", t);
                    }
                
                    return true;
                }
                onMessage(t) {
                    switch (t.getUint8()) {
                    case s.fh.PING:
                        this.talk(s.de.PONG);
                        break;
                    case s.fh.VERIFY:
                        if (this.verified)
                            return this.kick("Already verified"),
                            void console.log(`Client ${this.id} kicked for already being verified as ${this.username}`);
                        this.username = `[${this.id}] ${t.getStringUTF8().replace(/[^a-zA-Z0-9_\-]/g, "")}`;
                        const e = this.username.toLowerCase();
                        if (this.username.length > 24 || d(e))
                            return this.kick("Invalid username"),
                            void console.log(`Client ${this.id} kicked for invalid username as ${this.username}`);
                        this.verified = !0,
                        console.log(`Client ${this.id} verified as ${this.username}`),
                        this.talk(s.de.READY),
                        this.sendRoom(),
                        a.A.sendTerrain(this.id),
                        this.uuid === a.A.secretKey && this.masterPermissions < 1 && (this.nameColor = "#60f");
                        const i = f.disconnects.get(this.uuid);
                        i && (this.level = i.level,
                        this.xp = i.xp,
                        this.slots = i.slots,
                        this.secondarySlots = i.secondarySlots,
                        this.team = i.team,
                        this.addXP(0),
                        i.body && (this.body = i.body,
                        this.body.client = this),
                        clearTimeout(i.timeout),
                        f.disconnects.delete(this.uuid),
                        console.log(`Client ${this.id} reconnected as ${this.username}`));
                        break;
                    case s.fh.SPAWN:
                        if (!this.verified)
                            return void this.kick("Not verified");
                        if (this.body && !this.body.health.isDead)
                            return;
                        if (this.deathID !== null)
                            return void this.talk(s.de.DEATH, "You cannot respawn unless another player revives you.");
                        this.body = new n.ai(a.A.getPlayerSpawn(this));
                        this.body.type = s.wv.PLAYER;
                        this.body.team = this.team;
                        this.body.name = this.username;
                        this.body.nameColor = this.nameColor;
                        this.body.client = this;
                        this.body.health.set(this.healthAdjustement);
                        this.body.damage = this.bodyDamageAdjustment;
                        this.body.initSlots(this.slots.length);
                        for (let t = 0; t < this.slots.length; t++)
                            this.body.setSlot(t, this.slots[t].id, this.slots[t].rarity);
                        a.A.isTDM && (this.body.team = -this.team);
                        break;
                    case s.fh.INPUTS:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            if (null === this.body)
                                return;
                            const e = t.getUint8();
                            if (64 & ~e) {
                                let t = -!(2 & ~e) + !(8 & ~e)
                                  , i = -!(1 & ~e) + !(4 & ~e);
                                0 === t && 0 === i ? this.body.moveStrength = 0 : (this.body.moveAngle = Math.atan2(i, t),
                                this.body.moveStrength = this.body.speed)
                            } else
                                this.body.moveAngle = t.getFloat32(),
                                this.body.moveStrength = Math.min(1, Math.max(0, t.getFloat32())) * this.body.speed;
                            this.body.attack = !(16 & ~e),
                            this.body.defend = !(32 & ~e)
                        }
                        break;
                    case s.fh.CHANGE_LOADOUT:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            if (!this.body || this.body.health.isDead)
                                return;
                            const e = t.getUint8()
                              , i = t.getUint8()
                              , s = t.getUint8()
                              , a = t.getUint8();
                            switch (e) {
                            case 0:
                                if (i < 0 || i >= this.slots.length)
                                    return;
                                switch (s) {
                                case 0:
                                    if (a < 0 || a >= this.slots.length)
                                        return;
                                    const t = this.slots[i];
                                    this.slots[i] = this.slots[a],
                                    this.slots[a] = t,
                                    this.body.setSlot(i, this.slots[i].id, this.slots[i].rarity),
                                    this.body.setSlot(a, this.slots[a].id, this.slots[a].rarity);
                                    break;
                                case 1:
                                    if (a < 0 || a >= this.secondarySlots.length || null === this.secondarySlots[a])
                                        return;
                                    const e = this.slots[i];
                                    this.slots[i] = this.secondarySlots[a],
                                    this.secondarySlots[a] = e,
                                    this.body.setSlot(i, this.slots[i].id, this.slots[i].rarity)
                                }
                                break;
                            case 1:
                                if (i < 0 || i >= this.secondarySlots.length || null === this.secondarySlots[i])
                                    return;
                                switch (s) {
                                case 0:
                                    if (a < 0 || a >= this.slots.length)
                                        return;
                                    const t = this.slots[a];
                                    this.slots[a] = this.secondarySlots[i],
                                    this.secondarySlots[i] = t,
                                    this.body.setSlot(a, this.slots[a].id, this.slots[a].rarity);
                                    break;
                                case 1:
                                    if (a < 0 || a >= this.secondarySlots.length || null === this.secondarySlots[a])
                                        return;
                                    const e = this.secondarySlots[i];
                                    this.secondarySlots[i] = this.secondarySlots[a],
                                    this.secondarySlots[a] = e;
                                    break;
                                case 2:
                                    const destroyed = this.secondarySlots[i];
                                    if (destroyed) {
                                
                                        this.pickupDrop({
                                            index: destroyed.id,
                                            rarity: destroyed.rarity,
                                            value: 1,
                                            destroy: () => {}
                                        });
                                    }
                                
                                    this.secondarySlots[i] = null;
                                }
                            }
                        }
                        break;
                    case s.fh.DEV_CHEAT:
                        if (!this.verified)
                            return void this.kick("Not verified");
                        if (this.masterPermissions < 1 || !this.body || this.body.health.isDead)
                            return;
                        switch (t.getUint8()) {
                        case s.F6.TELEPORT:
                            this.body.x += t.getFloat32(),
                            this.body.y += t.getFloat32();
                            break;
                        case s.F6.GODMODE:
                            this.body.health.invulnerable = !this.body.health.invulnerable;
                            break;
                        case s.F6.CHANGE_TEAM:
                            {
                                const e = a.A.entities.get(t.getUint32());
                                e && (this.body.team = e.team)
                            }
                            break;
                        case s.F6.SPAWN_MOB:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint8()
                                  , r = t.getUint8();
                                if (i < 0 || i >= h.GJ.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Index out of range"
                                    });
                                if (r < 0 || r >= h.cK.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Rarity out of range"
                                    });
                                const o = new n.Bw(a.A.random());
                                o.define(h.ey[i], r),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    mob: {
                                        id: o.id,
                                        index: i,
                                        rarity: r,
                                        position: {
                                            x: o.x,
                                            y: o.y
                                        }
                                    }
                                })
                            }
                            break;
                        case s.F6.SET_PETAL:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint32()
                                  , n = t.getUint8()
                                  , r = t.getUint8()
                                  , o = t.getUint8()
                                  , l = a.A.clients.get(i);
                                if (!l)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Client not found"
                                    });
                                if (n < 0 || n >= l.slots.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Slot not found"
                                    });
                                if (r < 0 || r >= h.GJ.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Index out of range"
                                    });
                                if (o < 0 || o >= h.cK.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Rarity out of range"
                                    });
                                l.slots[n] = {
                                    id: r,
                                    rarity: o
                                },
                                l.body && l.body.setSlot(n, r, o),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    message: "Petal set"
                                })
                            }
                            break;
                        case s.F6.SET_XP:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint32()
                                  , n = t.getUint32()
                                  , h = a.A.clients.get(i);
                                if (!h)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Client not found"
                                    });
                                h.addXP(n - h.xp),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    message: "XP set"
                                })
                            }
                            break;
                        case s.F6.INFO_DUMP:
                            this.talk(s.de.JSON_MESSAGE, {
                                promiseID: t.getUint32(),
                                ok: !0,
                                entitiesSize: a.A.entities.size,
                                clients: Array.from(a.A.clients.values()).map((t => ({
                                    id: t.id,
                                    username: t.username,
                                    verified: t.verified,
                                    masterPermissions: t.masterPermissions,
                                    team: t.team,
                                    level: t.level,
                                    xp: t.xp
                                }))),
                                key: a.A.secretKey
                            })
                        }
                        break;
                        case s.fh.CHAT_MESSAGE:
                            try {
                            const msg = t.data || "";
                    
                            if (typeof msg !== "string") break;
                                            {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            const e = t.getStringUTF8();
                            if (!/^[\w\s,.!?'"@#%^&*()_\-+=:;<>\/\\|[\]{}~`\u00A0-\uFFFF]{1,128}$/.test(e))
                                return this.systemMessage("That message is too long or contains invalid characters.", "#CACA22"),
                                this.frownyMessages++,
                                void (this.frownyMessages >= 5 && this.kick("Abusing chat"));
                            if (d(e))
                                return this.systemMessage("Please refrain from saying slurs.", "#CA2222"),
                                this.frownyMessages++,
                                void (this.frownyMessages >= 5 && this.kick("Abusing chat"));
                            if (mutedUsers.has(this.id)) {
                                const endTime = mutedUsers.get(this.id);
                                if (Date.now() < endTime) {
                                    const left = Math.ceil((endTime - Date.now()) / 1000);
                                    return this.systemMessage(`You are muted for ${left}s.`, "#ff7575");
                                } else {
                                    mutedUsers.delete(this.id);
                                }
                            }
                            if (performance.now() - this.lastChat < 1e3)
                                return void this.systemMessage("You're chatting too fast.", "#22CACA");
                            this.lastChat = performance.now(),
                            a.A.clients.forEach((t => t.chatMessage(this.username, e, this.nameColor)))
                            if (e.startsWith("/mute ")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You do not have permission to use this command.", "#ffb375");
                                }
                            
                                const args = e.split(" ");
                                const targetId = parseInt(args[1]);
                                const durationArg = args[2] || "60";
                                const reason = args[3] ? args.slice(3).join(" ") : "No reason given.";
                            
                                const target = a.A.clients.get(targetId);
                                if (!target) {
                                    return this.systemMessage("User not found.", "#ffb375");
                                }
                            
                                function parseDuration(str) {
                                    const regex = /^(\d+(?:\.\d+)?)(s|m|h|d|w|mt|y)?$/i;
                                    const match = str.match(regex);
                                    if (!match) return 60; 
                            
                                    const value = parseFloat(match[1]);
                                    const unit = (match[2] || "s").toLowerCase();
                            
                                    const multipliers = {
                                        s: 1,
                                        m: 60,
                                        h: 60 * 60,
                                        d: 24 * 60 * 60,
                                        w: 7 * 24 * 60 * 60,
                                        mt: 4 * 7 * 24 * 60 * 60,
                                        y: 12 * 4 * 7 * 24 * 60 * 60
                                    };
                            
                                    return value * (multipliers[unit] || 1);
                                }
                            
                                const duration = parseDuration(durationArg);
                            
                                function formatDuration(seconds) {
                                    const units = [
                                        { label: "year", value: 12 * 4 * 7 * 24 * 60 * 60 },
                                        { label: "month", value: 4 * 7 * 24 * 60 * 60 },
                                        { label: "week", value: 7 * 24 * 60 * 60 },
                                        { label: "day", value: 24 * 60 * 60 },
                                        { label: "hour", value: 60 * 60 },
                                        { label: "minute", value: 60 },
                                        { label: "second", value: 1 }
                                    ];
                            
                                    for (const u of units) {
                                        if (seconds >= u.value) {
                                            const val = Math.floor(seconds / u.value);
                                            return `${val} ${u.label}${val !== 1 ? "s" : ""}`;
                                        }
                                    }
                                    return "0 seconds";
                                }
                            
                                const formattedDuration = formatDuration(duration);
                            
                                mutedUsers.set(target.id, Date.now() + duration * 1000);
                            
                                        a.A.clients.forEach(t => t.systemMessage(`${target.username} has been muted for ${formattedDuration}. Reason: ${reason}`,"#ffb375"));
                            
                                return;
                            }
                            
                            if (e.startsWith("/kick")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const args = e.trim().split(/\s+/);
                                const targetArg = args[1];
                            
                                if (!targetArg) {
                                    return this.systemMessage("Usage: /kick <id|name>", "#ffb375");
                                }
                            
                                const A = globalThis.gameState;
                                let target = null;
                            
                                A.clients.forEach(client => {
                                    if (target) return;
                                    if (String(client.id) === targetArg) target = client;
                                    else if (client.username && client.username.toLowerCase() === targetArg.toLowerCase()) target = client;
                                });
                            
                                if (!target) {
                                    return this.systemMessage(`No player found with ID or name "${targetArg}".`, "#ffb375");
                                }
                            
                                if (target.id === this.id) {
                                    return this.systemMessage("You cannot kick yourself.", "#ffb375");
                                }
                            
                                if (typeof target.kick === "function") {
                                    target.kick("You have been kicked by the host.");
                                    this.systemMessage(`Kicked ${target.username || "Player " + target.id}.`, "#ff6b6b");
                                } else {
                                    if (target.connection && typeof target.connection.close === "function") {
                                        target.connection.close();
                                        this.systemMessage(`Kicked ${target.username || "Player " + target.id}.`, "#ff6b6b");
                                    } else {
                                        this.systemMessage(`Could not kick ${target.username || "Player " + target.id}.`, "#ffb375");
                                    }
                                }
                            }
                            if (e.startsWith("/biome")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const args = e.trim().split(/\s+/);
                                const biomeArg = args[1]?.toLowerCase();
                            
                                if (!biomeArg) {
                                    return this.systemMessage("Usage: /biome <desert|ocean|garden>", "#ffb375");
                                }
                            
                                const biomeMap = {
                                    "desert": s.VC.DESERT,
                                    "ocean": s.VC.OCEAN,
                                    "garden": s.VC.GARDEN
                                };
                            
                                const biomeId = biomeMap[biomeArg];
                            
                                if (!biomeId) {
                                    return this.systemMessage("Invalid biome. Options: desert, ocean, garden", "#ffb375");
                                }
                            
                            const A = globalThis.gameState;
                            
                            A.clients.forEach(client => {
                                client.talk(s.de.ROOM_UPDATE, {
                                    width: A.width,
                                    height: A.height,
                                    isRadial: true,
                                    biome: biomeId
                                });
                            });
                            
                            A.mobTable = A.defaultMobTables[biomeId];
                            A.biome = biomeId;
                            
                            a.A.clients.forEach(t => t.systemMessage(`Biome set to ${biomeArg}.`, "#75ffa3"));
                            
                            }
                            if (e.startsWith("/skip")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const args = e.trim().split(/\s+/);
                                const wave = parseInt(args[1]);
                            
                                if (isNaN(wave) || wave < 0) {
                                    return this.systemMessage("Usage: /skip <waveNumber>", "#ffb375");
                                }
                            
                                const A = globalThis.gameState;
                            
                                if (Array.isArray(A._waveTimers) && A._waveTimers.length) {
                                    A._waveTimers.forEach(clearTimeout);
                                }
                                A._waveTimers = [];
                            
                            A.entities.forEach(ent => {
                                if (ent.type === s.wv.MOB) {
                                    ent.destroy({skipDrops: true});
                                }
                                });
                            
                                A.currentWave = wave - 1;
                                A.waveInProgress = false;
                                A.specialChance = 0;
                                A.livingMobCount = 0;
                                A.clients.forEach(c => c.sendRoom());
                            setTimeout(() => {
                                A.entities.forEach(ent => {
                                    if (ent.type === s.wv.MOB) {
                                        ent.destroy({ skipDrops: true });
                                    }
                                });
                                A.currentWave = wave - 1;
                                A.waveInProgress = false;
                                A.livingMobCount = 0;
                                A.clients.forEach(c => c.sendRoom());
                            }, 10);
                                this.systemMessage(`Wave set to ${wave}.`, "#75ffa3");
                            }
                            if (e.startsWith("/ws ")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const parts = e.trim().split(/\s+/);
                                const speedValue = Number(parts[1]);
                            
                                if (!Number.isFinite(speedValue)) {
                                    return this.systemMessage("Usage: /ws [number] - provide a valid number", "#ffb375");
                                }
                            
                                globalThis.card_speed = speedValue;
                                this.systemMessage(`Wave speed set to ${globalThis.card_speed}`, "#75ffa3");
                            }
                            if (e.startsWith("/kill")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const args = e.trim().split(/\s+/);
                                const targetArg = args[1];
                            
                                if (!targetArg) {
                                    return this.systemMessage("Usage: /kill <id|name>", "#ffb375");
                                }
                            
                                const A = globalThis.gameState;
                                let target = null;
                            
                                A.clients.forEach(client => {
                                    if (target) return;
                                    if (String(client.id) === targetArg) target = client;
                                    else if (client.username && client.username.toLowerCase() === targetArg.toLowerCase()) target = client;
                                });
                            
                                if (!target) {
                                    return this.systemMessage(`No player found with ID or name "${targetArg}".`, "#ffb375");
                                }
                            
                                if (target.body && typeof target.body.destroy === "function") {
                                    target.body.destroy({ skipDrops: true });
                                    this.systemMessage(`Killed ${target.username || "Player " + target.id}.`, "#ff6b6b");
                                }
                            }
                            
                            if (e.startsWith("/start")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                const A = globalThis.gameState;
                                A.started = true;
                                A.livingMobCount = 0;
                                A.specialChance = 0;
                                A.waveInProgress = false;
                            
                                const startingWaves = [];
                                a.A.clients.forEach(client => {
                                    const player = client.player || client;
                            
                                    if (!player.startingWaveBase && player.startingWave != null) {
                                        player.startingWaveBase = player.startingWave;
                                    }
                            
                                    const baseWave = player.startingWaveBase ?? 1;
                                    startingWaves.push(baseWave);
                                });
                            
                                const minWave = startingWaves.length > 0 ? Math.min(...startingWaves) : 1;
                            
                                A.currentWave = minWave > 9 ? minWave - 9 : minWave;
                            
                                this.systemMessage(`Waves started! Starting at wave ${A.currentWave}`, "#75ffa3");
                            }  
                            if (e.startsWith("/vote")) {
                                const A = globalThis.gameState;
                            
                                if (A.started) {
                                    if (A.votesToStart) A.votesToStart.clear();
                                    return this.systemMessage("The waves have already started.", "#ffb375");
                                }
                            
                                if (this.id === 1) return this.systemMessage("Host cannot vote.", "#ffb375");
                            
                                if (!A.votesToStart) A.votesToStart = new Set();
                            
                                const playerId = this.id;
                                if (A.votesToStart.has(playerId)) {
                                    return this.systemMessage("You have already voted to start the game.", "#ffb375");
                                }
                            
                                A.votesToStart.add(playerId);
                            
                                let totalPlayers = 0;
                                A.clients.forEach(client => {
                                    const player = client.player || client;
                                    if (player && player.id !== 1) totalPlayers++;
                                });
                            
                                this.systemMessage(
                                    `You voted to start the game. (${A.votesToStart.size}/${totalPlayers})`,
                                    "#75ffa3"
                                );
                            
                                const requiredVotes = Math.ceil(totalPlayers / 2);
                                if (A.votesToStart.size >= requiredVotes) {
                                    A.votesToStart.clear();
                            
                                    A.started = true;
                                    A.livingMobCount = 0;
                                    A.waveInProgress = false;
                            
                                    const startingWaves = [];
                                    A.clients.forEach(client => {
                                        const player = client.player || client;
                            
                                        if (!player.startingWaveBase && player.startingWave != null) {
                                            player.startingWaveBase = player.startingWave;
                                        }
                            
                                        const baseWave = player.startingWaveBase ?? 1;
                                        startingWaves.push(baseWave);
                                    });
                            
                                    const minWave = startingWaves.length > 0 ? Math.min(...startingWaves) : 1;
                                    A.currentWave = minWave > 9 ? minWave - 9 : minWave;
                            
                                    A.clients.forEach(client => {
                                        const player = client.player || client;
                                        player.systemMessage(
                                            `Majority has voted to start! ${A.currentWave}`,
                                            "#75ffa3"
                                        );
                                    });
                                }
                            }
                            const RARITIES = [
                                { name: "Common", short: "c", color: "#7eef6d" },
                                { name: "Unusual", short: "un", color: "#ffe65d" },
                                { name: "Rare", short: "r", color: "#4d52e3" },
                                { name: "Epic", short: "e", color: "#861fde" },
                                { name: "Legendary", short: "l", color: "#de1f1f" },
                                { name: "Mythic", short: "m", color: "#1fdbde" },
                                { name: "Ultra", short: "ul", color: "#ff2b75" },
                                { name: "Super", short: "s", color: "#2bffa3" },
                                { name: "Omega", short: "o", color: "#494849" },
                                { name: "Fabled", short: "f", color: "#ff5500" },
                                { name: "Divine", short: "d", color: "#67549c" },
                                { name: "Supreme", short: "sp", color: "#b25dd9" },
                                { name: "Omnipotent", short: "omni", color: "#5e004f" },
                                { name: "Astral", short: "ast", color: "#046307" },
                                { name: "Celestial", short: "cele", color: "#608efc" },
                                { name: "Seraphic", short: "sera", color: "#c77e5b" },
                                { name: "Transcendent", short: "trans", color: "#ffffff" },
                                { name: "Ethereal", short: "eth", color: "#f6c5de" },
                                { name: "Galactic", short: "gala", color: "#7f0226" },
                                { name: "Eternal", short: "et", color: "#146636" },
                                { name: "Apotheotic", short: "apo", color: "#b3ab56" },
                                { name: "Voidbound", short: "void", color: "#250a3d" },
                                { name: "Exalted", short: "ex", color: "#18608c" },
                                { name: "Chaos", short: "ch", color: "#20258a" },
                                { name: "Cataclysmic", short: "cata", color: "#940909" },
                                { name: "Nullborne", short: "null", color: "#434246" }
                            ];
                            const PETALS = [
                                "Basic","Light","Faster","Heavy","Stinger","Rice","Rock","Cactus","Leaf","Wing",
                                "Bone","Dirt","Magnolia","Corn","Sand","Orange","Missile","Pea","Rose","Yin Yang",
                                "Pollen","Honey","Iris","Web","web.mob.launched","Third Eye","Pincer","Beetle Egg",
                                "Antennae","Peas","Stick","scorpion.projectile","Dahlia","Primrose","Fire Spellbook",
                                "Deity","Lightning","Powder","Ant Egg","Yucca","Magnet","Amulet","Jelly","Yggdrasil",
                                "Glass","Dandelion","Sponge","Pearl","Shell","Bubble","Air","Starfish","Fang","Goo",
                                "Maggot Poo","Lightbulb","Battery","Dust","Armor","wasp.projectile","Shrub","projectile.grape",
                                "Grapes","Lantern","web.player.launched","Branch","Leech Egg","Hornet Egg","Candy",
                                "Claw","projectile.diep_bullet","Square Egg","Triangle Egg","Pentagon Egg","Bud",
                                "Fig","Fig.explosion","Amulet of Divergence","Tree","Bloom","Root.mob","Coconut",
                                "husk","Cinderleaf","Cinder.explosion","Root","Emerald","Blood Stinger","Blood Corn",
                                "Blood Light","Ruby","Fire Missile", "fire.projectile", "Sandstone", "missile.projectile",
                                "Moonlit Frog", "SunlitFrog","Ruby Frog","Moth","Mandible"
                            ];
                            if (e.startsWith("/inv") || e.startsWith("/inventory")) {
                                const parts = e.trim().split(/\s+/);
                            
                                const filterRaw = parts.slice(1).join(" ").trim().toLowerCase();
                            
                                const delayStep = 250;
                            
                                function formatNumber(num) {
                                    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
                                    if (num >= 1_000) return (num / 1_000).toFixed(2) + "k";
                                    return String(num);
                                }
                            
                                const RARITY_LIST = (typeof RARITIES !== "undefined" && Array.isArray(RARITIES) && RARITIES.length)
                                    ? RARITIES
                                    : null;
                            
                                const totals = {};
                                const itemsByRarity = {};
                                const inv = this.inventory || {};
                            
                                Object.keys(inv).forEach((rarityKey) => {
                                    const petalCounts = inv[rarityKey];
                                    if (!petalCounts || typeof petalCounts !== "object") return;
                            
                                    let rarityName = rarityKey;
                                    const m = rarityKey.match(/^Rarity_(\d+)$/i);
                                    if (m && RARITY_LIST) {
                                        const idx = parseInt(m[1], 10);
                                        if (!Number.isNaN(idx) && RARITY_LIST[idx]) {
                                            rarityName = RARITY_LIST[idx].name;
                                        }
                                    }
                            
                                    itemsByRarity[rarityName] = itemsByRarity[rarityName] || {};
                            
                                    Object.keys(petalCounts).forEach((petalKey) => {
                                        if (petalKey === "__total") return;
                            
                                        const cnt = Number(petalCounts[petalKey]) || 0;
                                        if (cnt <= 0) return;
                            
                                        let petalName;
                                        if (!Number.isNaN(Number(petalKey))) {
                                            const idx = Number(petalKey);
                                            petalName = PETALS[idx] || `Petal_${idx}`;
                                        } else {
                                            petalName = petalKey;
                                        }
                            
                                        itemsByRarity[rarityName][petalName] =
                                            (itemsByRarity[rarityName][petalName] || 0) + cnt;
                            
                                        totals[rarityName] = (totals[rarityName] || 0) + cnt;
                                    });
                                });
                            
                                if (Object.keys(totals).length === 0 && Object.keys(itemsByRarity).length === 0) {
                                    return this.systemMessage("Your inventory is empty.", "#ffb375");
                                }
                            
                                let requestedRarityName = null;
                                if (filterRaw) {
                                    if (/^\d+$/.test(filterRaw)) {
                                        const idx = parseInt(filterRaw, 10);
                                        if (RARITY_LIST && RARITY_LIST[idx]) {
                                            requestedRarityName = RARITY_LIST[idx].name;
                                        } else {
                                            requestedRarityName = `Rarity_${idx}`;
                                        }
                                    } else {
                                        if (RARITY_LIST) {
                                            const match = RARITY_LIST.find(r => r.name.toLowerCase() === filterRaw);
                                            if (match) requestedRarityName = match.name;
                                        }
                                        if (!requestedRarityName && inv[filterRaw]) requestedRarityName = filterRaw;
                                    }
                                }
                            
                                function rarityColor(name) {
                                    if (!name) return "#CACA22";
                                    if (!RARITY_LIST) return "#CACA22";
                                    const idx = RARITY_LIST.findIndex(r => r.name === name);
                                    return (idx !== -1 && RARITY_LIST[idx].color) ? RARITY_LIST[idx].color : "#CACA22";
                                }
                            
                                let delay = 0;
                                let requestedPetalName = null;
                                if (filterRaw && !requestedRarityName) {
                                    const match = PETALS.find(p => p.toLowerCase() === filterRaw);
                                    if (match) {
                                        requestedPetalName = match;
                                    } else {
                                        const match2 = PETALS.find(p => p.toLowerCase().includes(filterRaw));
                                        if (match2) requestedPetalName = match2;
                                    }
                                }
                            
                                if (requestedPetalName) {
                                    const perRarityCounts = {};
                            
                                    Object.keys(inv).forEach((rarityKey) => {
                                        const petalCounts = inv[rarityKey];
                                        if (!petalCounts || typeof petalCounts !== "object") return;
                            
                                        let rarityName = rarityKey;
                                        const m = rarityKey.match(/^Rarity_(\d+)$/i);
                                        if (m && RARITY_LIST) {
                                            const idx = parseInt(m[1], 10);
                                            if (!Number.isNaN(idx) && RARITY_LIST[idx]) {
                                                rarityName = RARITY_LIST[idx].name;
                                            }
                                        }
                            
                                        Object.keys(petalCounts).forEach((petalKey) => {
                                            if (petalKey === "__total") return;
                                            const cnt = Number(petalCounts[petalKey]) || 0;
                                            if (cnt <= 0) return;
                            
                                            let petalName;
                                            if (!Number.isNaN(Number(petalKey))) {
                                                const idx = Number(petalKey);
                                                petalName = PETALS[idx] || `Petal_${idx}`;
                                            } else {
                                                petalName = petalKey;
                                            }
                            
                                            if (petalName.toLowerCase() === requestedPetalName.toLowerCase()) {
                                                perRarityCounts[rarityName] = (perRarityCounts[rarityName] || 0) + cnt;
                                            }
                                        });
                                    });
                            
                                    if (Object.keys(perRarityCounts).length === 0) {
                                        return this.systemMessage(
                                            `You have no ${requestedPetalName} petals.`,
                                            "#ffb375"
                                        );
                                    }
                            
                                    setTimeout(() =>
                                        this.systemMessage(`inventory - ${requestedPetalName}:`, "#ff7591"),
                                        delay
                                    );
                                    delay += delayStep;
                            
                                    const sortedByRarity = Object.entries(perRarityCounts).sort((a, b) => {
                                        const idxA = RARITY_LIST.findIndex(r => r.name === a[0]);
                                        const idxB = RARITY_LIST.findIndex(r => r.name === b[0]);
                                        return idxA - idxB;
                                    });
                            
                                    for (const [rarityName, amt] of sortedByRarity) {
                                        setTimeout(() =>
                                            this.systemMessage(`${rarityName}: ${formatNumber(amt)}`, rarityColor(rarityName)),
                                            delay
                                        );
                                        delay += delayStep;
                                    }
                                    return;
                                }
                            
                                if (requestedRarityName) {
                                    const items = itemsByRarity[requestedRarityName] || {};
                                    const total = totals[requestedRarityName] || 0;
                            
                                    if ((!items || Object.keys(items).length === 0) && total === 0) {
                                        return this.systemMessage(
                                            `You have no ${requestedRarityName} items.`,
                                            rarityColor(requestedRarityName)
                                        );
                                    }
                            
                                    setTimeout(() =>
                                        this.systemMessage(`inventory - ${requestedRarityName.toLowerCase()}:`, rarityColor(requestedRarityName)),
                                        delay
                                    );
                                    delay += delayStep;
                            
                                    const sortedItems = Object.entries(items).sort((a, b) => a[1] - b[1]);
                            
                                    for (const [itemName, amt] of sortedItems) {
                                        setTimeout(() =>
                                            this.systemMessage(`${itemName}: ${formatNumber(amt)}`, rarityColor(requestedRarityName)),
                                            delay
                                        );
                                        delay += delayStep;
                                    }
                                    return;
                                }
                            
                                const orderedRarityNames = [];
                                if (RARITY_LIST) {
                                    for (let i = 0; i < RARITY_LIST.length; i++) {
                                        const rn = RARITY_LIST[i].name;
                                        if ((totals[rn] || 0) > 0) orderedRarityNames.push(rn);
                                    }
                                }
                                Object.keys(totals).forEach(rn => {
                                    if (!orderedRarityNames.includes(rn)) orderedRarityNames.push(rn);
                                });
                            
                                setTimeout(() => this.systemMessage("Inventory: ", "#ff7591"), delay);
                                delay += delayStep;
                            
                                for (const rn of orderedRarityNames) {
                                    const amt = totals[rn] || 0;
                                    setTimeout(() =>
                                        this.systemMessage(`${rn}: ${formatNumber(amt)}`, rarityColor(rn)),
                                        delay
                                    );
                                    delay += delayStep;
                                }
                            
                                return;
                            }
                            if (e.startsWith("/dc ") || e.startsWith("/dontcraft ")) {
                                const args = e.trim().split(/\s+/);
                            
                                if (args.length < 3) {
                                    return this.systemMessage("Usage: /dc [petal name] [add/r or remove/a]", "#ffb375");
                                }
                            
                                const action = args[args.length - 1].toLowerCase();
                            
                                const petalName = args.slice(1, -1).join(" ");
                            
                                if (!petalName || !action) {
                                    return this.systemMessage("Usage: /dc [petal name] [add/r or remove/a]", "#ffb375");
                                }
                            
                                this.dontCraft = this.dontCraft || new Set();
                            
                                if (action === "add" || action === "a") {
                                    this.dontCraft.add(petalName);
                                    return this.systemMessage(`Added "${petalName}" to your dont-craft list.`, "#75ff83");
                                } else if (action === "remove" || action === "r") {
                                    this.dontCraft.delete(petalName);
                                    return this.systemMessage(`Removed "${petalName}" from your dont-craft list.`, "#75ff83");
                                } else {
                                    return this.systemMessage("Invalid action. Use add/a or remove/r.", "#ffb375");
                                }
                            }
                            function calculateChance(attempt, rarity){
                                if (rarity == 0){
                                  //Common to Unusual
                                  let chance = 30 + attempt * 9;
                                  if (attempt > 6){
                                    chance += (attempt - 6)**2 / 2;
                                    if (chance > 100){
                                      chance = 100;
                                    }
                                  }
                                  return chance;
                                }
                                else if (rarity == 1){
                                  //Unusual to Rare
                                  let chance = 15 + attempt * 1.5;
                                  if (attempt > 12){
                                    chance += (attempt - 12)**2 / 2;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 2){
                                  //Rare to Epic
                                  let chance = 8 + attempt / 1.4;
                                  if (attempt > 18){
                                    chance += (attempt - 18)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 3){
                                  //Epic to Legendary
                                  let chance = 5 + attempt / 5.6;
                                  if (attempt > 35){
                                    chance += (attempt - 35)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 4){
                                  //Legendary to Mythic
                                  let chance = 3 + attempt / 22.5;
                                  if (attempt > 60){
                                    chance += (attempt - 60)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 5){
                                  //Mythic to Ultra
                                  let chance = 2 + attempt / 33;
                                  if (attempt > 70){
                                    chance += (attempt - 70)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 6){
                                  //Ultra to Super
                                  let chance = 1 + attempt / 43;
                                  if (attempt > 95){
                                    chance += (attempt - 95)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 7){
                                  //Super to Omega
                                  let chance = 0.9 + attempt / 45;
                                  if (attempt > 95){
                                    chance += (attempt - 95)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 8){
                                  //Omega to Fabled
                                  let chance = 0.8 + attempt / 48;
                                  if (attempt > 95){
                                    chance += (attempt - 95)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 9){
                                  //Fabled to Divine
                                  let chance = 0.7 + attempt / 51;
                                  if (attempt > 100){
                                    chance += (attempt - 100)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 10){
                                  //Divine to Supreme
                                  let chance = 0.6 + attempt / 53;
                                  if (attempt > 105){
                                    chance += (attempt - 105)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 11){
                                  //Supreme to Omnipotent
                                  let chance = 0.5 + attempt / 55;
                                  if (attempt > 110){
                                    chance += (attempt - 110)**2 / 5;
                                  }
                                  if (chance > 100){
                                    chance = 100;
                                  }
                                  return chance;
                                }
                                else if (rarity == 12){
                                    //Omnipotent to Astral
                                    let chance = 0;
                            
                                    if (attempt <= 9){
                                        // Linear scale from 0.1% to 0.5%
                                        chance = 0.1 + (attempt / 9) * (0.5 - 0.1);
                                    } else if (attempt <= 200){
                                        // Linear scale from 0.5% to 1.5%
                                        chance = 0.5 + ((attempt - 10) / (200 - 10)) * (1.5 - 0.5);
                                    } else {
                                        // Rapidly increasing using quadratic growth
                                        chance = 1.5 + ((attempt - 200) ** 2) / 10;
                                    }
                                
                                    if (chance > 100){
                                        chance = 100;
                                    }
                                
                                    return chance;
                                }
                                else if (rarity == 13){
                                    let chance = 0;
                            
                                    if (attempt <= 14){
                                        // Linear scale from 0.08% to 0.4%
                                        chance = 0.08 + (attempt / 14) * (0.4 - 0.08);
                                    } else if (attempt <= 240){
                                        // Linear scale from 0.4% to 1.4%
                                        chance = 0.4 + ((attempt - 15) / (240 - 15)) * (1.4 - 0.4);
                                    } else {
                                        // Quadratic growth, reduced by 2x
                                        chance = 1.4 + ((attempt - 240) ** 2) / 20;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                else if (rarity == 14){
                                    let chance = 0;
                            
                                    if (attempt <= 14){
                                        // Linear scale from 0.07% to 0.35%
                                        chance = 0.06 + (attempt / 14) * (0.35 - 0.07);
                                    } else if (attempt <= 275){
                                        // Linear scale from 0.35% to 1.35%
                                        chance = 0.35 + ((attempt - 15) / (275 - 15)) * (1.35 - 0.35);
                                    } else {
                                        // Quadratic growth, reduced by 3x
                                        chance = 1.35 + ((attempt - 275) ** 2) / 30;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                else if (rarity == 15){
                                    let chance = 0;
                            
                                    if (attempt <= 9){
                                        // Linear scale from 0.02% to 0.1%
                                        chance = 0.02 + (attempt / 9) * (0.1 - 0.02);
                                    } else if (attempt <= 500){
                                        // Linear scale from 0.1% to 0.5%
                                        chance = 0.1 + ((attempt - 10) / (500 - 10)) * (0.5 - 0.1);
                                    } else {
                                        // Quadratic growth, reduced by 4x
                                        chance = 0.5 + ((attempt - 500) ** 2) / 40;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                else if (rarity == 16){
                                    let chance = 0;
                            
                                    if (attempt <= 9){
                                        // Linear scale from 0.01% to 0.07%
                                        chance = 0.01 + (attempt / 9) * (0.07 - 0.01);
                                    } else if (attempt <= 700){
                                        // Linear scale from 0.07% to 0.3%
                                        chance = 0.07 + ((attempt - 10) / (700 - 10)) * (0.3 - 0.07);
                                    } else {
                                        // Quadratic growth, reduced by 5x
                                        chance = 0.3 + ((attempt - 700) ** 2) / 50;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                else if (rarity == 17){
                                    let chance = 0;
                            
                                    if (attempt <= 9){
                                        // Linear scale from 0.001% to 0.005%
                                        chance = 0.001 + (attempt / 9) * (0.005 - 0.001);
                                    } else if (attempt <= 10000){
                                        // Linear scale from 0.005% to 0.02%
                                        chance = 0.005 + ((attempt - 10) / (10000 - 10)) * (0.02 - 0.005);
                                    } else {
                                        // Quadratic growth, reduced by 50x
                                        chance = 0.02 + ((attempt - 10000) ** 2) / 500;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                else if (rarity == 18){
                                    let chance = 0;
                            
                                    if (attempt <= 9){
                                        // Linear scale from 0.0005% to 0.001%
                                        chance = 0.0005 + (attempt / 9) * (0.001 - 0.0005);
                                    } else if (attempt <= 100000){
                                        // Linear scale from 0.005% to 0.02%
                                        chance = 0.001 + ((attempt - 10) / (100000 - 10)) * (0.005 - 0.001);
                                    } else {
                                        // Quadratic growth, reduced by 500x
                                        chance = 0.005 + ((attempt - 100000) ** 2) / 5000;
                                    }
                            
                                    if (chance > 100){
                                        chance = 100;
                                    }
                            
                                    return chance;
                                }
                                
                              }
                                                        
                            function findPetalKey(rarityInv, rawName) {
                                if (!rarityInv || !rawName) return null;
                                const want = rawName.toLowerCase();
                            
                                for (const k of Object.keys(rarityInv)) {
                                    if (k === "__total") continue;
                                    if (k.toLowerCase() === want) return k;
                                }
                            
                                if (want.endsWith("s")) {
                                    const singular = want.slice(0, -1);
                                    for (const k of Object.keys(rarityInv)) {
                                        if (k.toLowerCase() === singular) return k;
                                    }
                                } else {
                                    const plural = want + "s";
                                    for (const k of Object.keys(rarityInv)) {
                                        if (k.toLowerCase() === plural) return k;
                                    }
                                }
                            
                                return null;
                            }
                            
                            function getPetalId(key) {
                                if (key === null || key === undefined) return null;
                                const maybeNum = Number(key);
                                if (!Number.isNaN(maybeNum) && Number.isFinite(maybeNum)) return maybeNum;
                                const idx = PETALS.indexOf(key);
                                return idx >= 0 ? idx : null;
                            }
                            
                            function simulateCraft(ctx, rarityIdx, petalKeyOrId, startAmount) {
                                const petalId = getPetalId(petalKeyOrId);
                                if (petalId === null) {
                                    return { attempts: 0, successes: 0, consumed: 0, lost: 0, nextRarityIdx: rarityIdx + 1 };
                                }
                            
                                ctx.inventory = ctx.inventory || {};
                                const rarityKey = "Rarity_" + rarityIdx;
                                ctx.inventory[rarityKey] = ctx.inventory[rarityKey] || {};
                            
                                let sourceKey = null;
                                const rarityInv = ctx.inventory[rarityKey] || {};
                                if (rarityInv[petalId] != null) sourceKey = petalId;
                                else {
                                    const nameKey = PETALS[petalId];
                                    if (nameKey != null && rarityInv[nameKey] != null) sourceKey = nameKey;
                                    else {
                                        const found = findPetalKey(rarityInv, PETALS[petalId] || String(petalId));
                                        if (found) sourceKey = found;
                                    }
                                }
                                if (sourceKey == null) {
                                    return { attempts: 0, successes: 0, consumed: 0, lost: 0, nextRarityIdx: rarityIdx + 1 };
                                }
                            
                                let petals = Math.floor(Number(startAmount) || 0);
                                if (petals < 5) return { attempts: 0, successes: 0, consumed: 0, lost: 0, nextRarityIdx: rarityIdx + 1 };
                            
                                const nextRarityIdx = rarityIdx + 1;
                                const nextRarityKey = "Rarity_" + nextRarityIdx;
                            
                                ctx.craftingStatsPerPetal = ctx.craftingStatsPerPetal || {};
                                const startAttempt = ctx.craftingStatsPerPetal?.[nextRarityIdx]?.[petalId]?.A || 0;
                                let attempt = startAttempt;
                                
                                let totalAttempts = 0, successes = 0, totalLost = 0;
                            
                                while (petals >= 5) {
                                    attempt++;
                                    totalAttempts++;
                            
                                    const chance = calculateChance(attempt, rarityIdx);
                                    const roll = Math.random() * 100;
                            
                                    if (roll < chance) {
                                        successes++;
                                        petals -= 5;
                                        attempt = 0;
                            
                                        ctx.inventory[nextRarityKey] = ctx.inventory[nextRarityKey] || {};
                            const petalKey = PETALS[petalId];
                            ctx.inventory[nextRarityKey][petalKey] = (ctx.inventory[nextRarityKey][petalKey] || 0) + 1;
                            ctx.inventory[nextRarityKey].__total = (ctx.inventory[nextRarityKey].__total || 0) + 1;
                            
                                    } else {
                                        const loss = Math.min(1 + Math.floor(Math.random() * 4), petals);
                                        petals -= loss;
                                        totalLost += loss;
                                    }
                                }
                            
                                const consumed = startAmount - petals;
                            
                                ctx.inventory[rarityKey][sourceKey] = Math.max(0, (ctx.inventory[rarityKey][sourceKey] || 0) - consumed);
                                if (ctx.inventory[rarityKey][sourceKey] === 0) delete ctx.inventory[rarityKey][sourceKey];
                            
                                const newTotal = Object.entries(ctx.inventory[rarityKey] || {})
                                    .filter(([k]) => k !== "__total")
                                    .reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
                            
                                if (newTotal > 0) {
                                    ctx.inventory[rarityKey].__total = newTotal;
                                } else {
                                    delete ctx.inventory[rarityKey];
                                }
                            
                                ctx.craftingStats = ctx.craftingStats || {};
                                ctx.craftingStats[nextRarityIdx] = ctx.craftingStats[nextRarityIdx] || { A: 0, S: 0, C: 0, L: 0 };
                            
                                ctx.craftingStatsPerPetal = ctx.craftingStatsPerPetal || {};
                                ctx.craftingStatsPerPetal[rarityIdx] = ctx.craftingStatsPerPetal[rarityIdx] || {};
                                ctx.craftingStatsPerPetal[rarityIdx][petalId] = ctx.craftingStatsPerPetal[rarityIdx][petalId] || { A: 0 };
                            
                                ctx.craftingStatsPerPetal[nextRarityIdx] = ctx.craftingStatsPerPetal[nextRarityIdx] || {};
                                ctx.craftingStatsPerPetal[nextRarityIdx][petalId] = ctx.craftingStatsPerPetal[nextRarityIdx][petalId] || { A: 0 };
                            
                                ctx.craftingStatsPerPetal[nextRarityIdx][petalId].A = attempt;
                            
                                ctx.craftingStats[nextRarityIdx].A += totalAttempts;
                                ctx.craftingStats[nextRarityIdx].S = (ctx.craftingStats[nextRarityIdx].S ?? 0) + successes;
                                ctx.craftingStats[nextRarityIdx].C = (ctx.craftingStats[nextRarityIdx].C ?? 0) + consumed;
                                ctx.craftingStats[nextRarityIdx].L = (ctx.craftingStats[nextRarityIdx].L ?? 0) + totalLost;
                            
                            return {
                                attempts: totalAttempts,
                                successes,
                                consumed: consumed,
                                lost: totalLost,
                                nextRarityIdx,
                                attemptStreakStart: startAttempt,
                                attemptStreakEnd: attempt
                            };
                            }
                            
                            if (e.startsWith("/craft") || e.startsWith("/c ")) {
                                const parts = e.trim().split(/\s+/);
                                const subCmd = parts[1]?.toLowerCase?.();
                            
                                function findRarityIndexByName(input) {
                                    if (!input) return -1;
                                    const low = input.toLowerCase();
                                    return RARITIES.findIndex(r => r.name.toLowerCase() === low || r.short?.toLowerCase() === low);
                                }
                            
                                if (subCmd === "all") {
                                    const rarityIdx = findRarityIndexByName(parts[2]);
                                    if (rarityIdx === -1) return this.systemMessage("Unknown rarity: " + parts[2], "#ffb375");
                                    const rarityKey = "Rarity_" + rarityIdx;
                                    const rarityInv = (this.inventory || {})[rarityKey];
                                    if (!rarityInv || (rarityInv.__total || 0) <= 0) return this.systemMessage(`No ${RARITIES[rarityIdx].name} petals.`, "#ffb375");
                            
                                    let totalAttempts = 0, totalSuccesses = 0, totalConsumed = 0, totalLost = 0;
                                    let lastNextRarity = null;
                                    const username = this.username || this.name || `Player#${this.id}`;
                            
                                    for (const key of Object.keys(rarityInv)) {
                                        if (key === "__total") continue;
                                        if (this.dontCraft?.has(key.toLowerCase())) continue;
                            
                                        const petalId = getPetalId(key);
                                        if (petalId === null) continue;
                                        const amount = rarityInv[key];
                                        if (amount < 5) continue;
                            
                                        const result = simulateCraft(this, rarityIdx, key, amount);
                                        totalAttempts += result.attempts;
                                        totalSuccesses += result.successes;
                                        totalConsumed += result.consumed;
                                        totalLost += result.lost;
                                        lastNextRarity = RARITIES[result.nextRarityIdx];
                            
                                        if (rarityIdx > 9) {
                                            const attemptMsg = `${username} is attempting ${RARITIES[rarityIdx].name} ${key}${amount > 1 ? "s" : ""}`;
                                            a.A.clients.forEach(t => t.systemMessage(attemptMsg, RARITIES[rarityIdx].color));
                                        }
                            
                            setTimeout(() => {
                                if (rarityIdx > 8) {
                                    if (result.successes > 0 && lastNextRarity) {
                                        const msg = `${username} crafted ${result.successes} ${lastNextRarity.name} ${key}${result.successes > 1 ? "s" : ""}`;
                                        a.A.clients.forEach(t => t.systemMessage(msg, lastNextRarity.color));
                                    } else if (rarityIdx > 9) {
                                        const msg = `${username} failed to craft ${lastNextRarity?.name || "?"} ${key}${amount > 1 ? "s" : ""}`;
                                        a.A.clients.forEach(t => t.systemMessage(msg, RARITIES[rarityIdx].color));
                                    }
                                }
                            }, 2000);
                            
                                }
                                        if (!totalAttempts) return this.systemMessage(`None of your ${RARITIES[rarityIdx].name} petals are craftable.`, "#ffb375");
                                setTimeout(() => {
                                    this.systemMessage(`Crafted ALL ${RARITIES[rarityIdx].name} petals → ${totalSuccesses} successes, ${totalAttempts} attempts, ${totalLost} lost.`, lastNextRarity?.color || "#da75ff");
                                    return;
                                    }, 3000);
                                return;
                            }
                            
                                let rarityNameRaw, petalNameRaw, amount;
                                if (!Number.isNaN(parseInt(parts[1], 10))) {
                                    amount = parseInt(parts[1], 10);
                                    rarityNameRaw = parts[2];
                                    petalNameRaw = parts.slice(3).join(" ");
                                } else {
                                    rarityNameRaw = parts[1];
                                    amount = parseInt(parts[parts.length - 1], 10);
                                    petalNameRaw = parts.slice(2, -1).join(" ");
                                }
                            
                                if (!rarityNameRaw || !petalNameRaw || Number.isNaN(amount)) return this.systemMessage("Usage: /c <rarity> <petal> <amount> OR /c <amount> <rarity> <petal>", "#ffb375");
                                if (amount < 5) return this.systemMessage("You need at least 5 petals to attempt crafting.", "#ffb375");
                            
                                const rarityIdx = findRarityIndexByName(rarityNameRaw);
                                if (rarityIdx === -1) return this.systemMessage("Unknown rarity: " + rarityNameRaw, "#ffb375");
                                const rarityKey = "Rarity_" + rarityIdx;
                                const rarityInv = (this.inventory || {})[rarityKey];
                                if (!rarityInv) return this.systemMessage(`No ${RARITIES[rarityIdx].name} petals.`, "#ffb375");
                            
                                let sourceKey = findPetalKey(rarityInv, petalNameRaw);
                                let sourcePetalId = null;
                                if (sourceKey != null) {
                                    sourcePetalId = getPetalId(sourceKey);
                                } else {
                                    const maybeId = getPetalId(petalNameRaw);
                                    if (maybeId !== null) {
                                        if ((rarityInv[maybeId] || 0) >= amount) {
                                            sourceKey = maybeId;
                                            sourcePetalId = maybeId;
                                        } else {
                                            return this.systemMessage(`Not enough ${petalNameRaw} petals.`, "#ffb375");
                                        }
                                    } else {
                                        return this.systemMessage(`Not enough ${petalNameRaw} petals.`, "#ffb375");
                                    }
                                }
                            
                                const result = simulateCraft(this, rarityIdx, sourceKey, amount);
                                const nextRarity = RARITIES[result.nextRarityIdx];
                            
                                if (rarityIdx > 9) {
                                    const username = this.username || this.name || `Player#${this.id}`;
                                    const attemptMsg = `${username} is attempting ${nextRarity.name} ${PETALS[getPetalId(sourceKey)]}${amount > 1 ? "s" : ""}`;
                                    a.A.clients.forEach(t => t.systemMessage(attemptMsg, RARITIES[rarityIdx].color));
                                }
                            
                            setTimeout(() => {
                                if (rarityIdx > 8) {
                                    const username = this.username || this.name || `Player#${this.id}`;
                                    const petalName = PETALS[getPetalId(sourceKey)];
                                    
                                    if (result.successes > 0 && nextRarity) {
                                        const msg = `${username} crafted ${result.successes} ${nextRarity.name} ${petalName}${result.successes > 1 ? "s" : ""}`;
                                        a.A.clients.forEach(t => t.systemMessage(msg, nextRarity.color));
                                    } else if (rarityIdx > 9 && result.successes === 0) {
                                        const msg = `${username} failed to craft ${nextRarity?.name || "?"} ${petalName}${amount > 1 ? "s" : ""}`;
                                        a.A.clients.forEach(t => t.systemMessage(msg, RARITIES[rarityIdx].color));
                                    }
                                }
                            }, 2000);
                            
                            const finalPetalId = getPetalId(sourceKey);
                            
                            const streakBefore = (this.craftingStatsPerPetal?.[result.nextRarityIdx]?.[finalPetalId]?.A) ?? 0;
                            
                            const nextChance = calculateChance(streakBefore, result.nextRarityIdx - 1).toFixed(2);
                            
                            this.systemMessage(
                                `Crafted ${PETALS[finalPetalId]} (${RARITIES[rarityIdx].name}) → ` +
                                `${result.successes} successes, ${result.attempts} attempts, ${result.lost} lost ` +
                                `(Next attempt odds: ${nextChance + "%"})`,
                                nextRarity?.color || "#da75ff"
                            );
                            
                            }
                            if (e.startsWith("/stats")) {
                                const parts = e.trim().split(/\s+/);
                            
                                if (parts.length >= 3) {
                                    const rarityNameRaw = parts[1];
                                    const petalNameRaw = parts.slice(2).join(" ");
                            
                                    function findRarityIndexByName(input) {
                                        if (!input) return -1;
                                        const low = input.toLowerCase();
                                        return RARITIES.findIndex(r => r.name.toLowerCase() === low || r.short?.toLowerCase() === low);
                                    }
                            
                                    const rarityIdx = findRarityIndexByName(rarityNameRaw);
                                    if (rarityIdx === -1) return this.systemMessage("Unknown rarity: " + rarityNameRaw, "#ffb375");
                            
                                    let petalId = null;
                            
                                    const exact = PETALS.findIndex(p => p.toLowerCase() === petalNameRaw.toLowerCase());
                                    if (exact >= 0) petalId = exact;
                            
                                    if (petalId === null) {
                                        const singular = petalNameRaw.toLowerCase().endsWith("s")
                                            ? petalNameRaw.slice(0, -1)
                                            : null;
                                        const plural = !petalNameRaw.toLowerCase().endsWith("s")
                                            ? petalNameRaw + "s"
                                            : null;
                            
                                        for (let i = 0; i < PETALS.length; i++) {
                                            const p = PETALS[i].toLowerCase();
                                            if (singular && p === singular) { petalId = i; break; }
                                            if (plural && p === plural) { petalId = i; break; }
                                        }
                                    }
                            
                                    if (petalId === null) return this.systemMessage(`Could not find petal: ${petalNameRaw}`, "#ffb375");
                            
                                    const attemptStreak = this.craftingStatsPerPetal?.[rarityIdx]?.[petalId]?.A || 0;
                                    const chance = calculateChance(attemptStreak, rarityIdx - 1);
                            
                                    this.systemMessage(
                                        `${PETALS[petalId]} (${RARITIES[rarityIdx].name}) → Current chance: ${chance.toFixed(2)}%` +
                                        ` (Attempts: ${attemptStreak})`,
                                        RARITIES[rarityIdx]?.color || "#da75ff"
                                    );
                            
                                } else {
                                    const stats = this.craftingStats || {};
                                    let hasAny = false;
                            
                                    for (let i = 0; i < RARITIES.length; i++) {
                                        const s = stats[i] || { A: 0, S: 0, C: 0, L: 0 };
                                        if (s.A === 0 && s.S === 0 && s.C === 0 && s.L === 0) continue;
                            
                                        hasAny = true;
                                        const color = RARITIES[i]?.color || "#ffffff";
                                        this.systemMessage(
                                            `${RARITIES[i]?.name}: successes: ${s.S}, attempts: ${s.A}, lost: ${s.L}.`,
                                            color
                                        );
                                    }
                            
                                    if (!hasAny) this.systemMessage("No crafting stats yet.", "#ffb375");
                                }
                            }
                            
                            if (e.startsWith("/login ")) {
                                const parts = e.trim().split(/\s+/);
                                const username = parts[1]?.trim();
                                const password = parts[2]?.trim();
                            
                                if (!username || !password)
                                    return this.systemMessage("Usage: /login [username] [password]", "#ffb375");
                            
                                const player = this.player || this.client || this;
                                if (!player)
                                    return this.systemMessage("Player object not found.", "#ffb375");
                            
                                Current_Player_Accounts.set(username, player);
                                const account = PLAYER_ACCOUNTS[username];
                            
                            const getPetalId = key => {
                                if (typeof key === "number") return key;
                                const id = Number(key);
                                if (!isNaN(id)) return id;
                                const idx = PETALS.indexOf(key);
                                return idx >= 0 ? idx : null;
                            };
                            
                                if (account && account.password === password) {
                                    const data = account.data || {};
                                    player.accountName = data.aN ?? username;
                                    player.accountPassword = data.aP ?? password;
                                    player.level = data.L ?? 0;
                                    player.xp = data.XP ?? 0;
                                    player.startingWave = data.sW ?? 0;
                            
                                    const TSP = data.TSP ?? [];
                                    const TSR = data.TSR ?? [];
                                    const BSP = data.BSP ?? [];
                                    const BSR = data.BSR ?? [];
                            
                                    const levelUnlocked = 5 + Math.min(5, Math.floor((player.level || 0) / 15));
                                    const unlockedSlots = Math.max(levelUnlocked, TSP.length, BSP.length);
                            
                                    player.maxSlots = unlockedSlots;
                                    player.unlockedSlots = unlockedSlots;
                            
                                    player.slots = [];
                                    for (let i = 0; i < unlockedSlots; i++) {
                                        player.slots.push({ id: TSP[i] ?? 0, rarity: TSR[i] ?? 0 });
                                    }
                            
                                    if (player.body?.initSlots) try { player.body.initSlots(unlockedSlots); } catch {}
                                    if (player.body?.setSlot) {
                                        for (let i = 0; i < player.slots.length; i++) {
                                            const s = player.slots[i];
                                            try { if (s.id >= 0) player.body.setSlot(i, s.id, s.rarity); } catch {}
                                        }
                                    }
                            
                                    player.secondarySlots = [];
                                    for (let i = 0; i < unlockedSlots; i++) {
                                        const id = BSP[i] ?? null;
                                        const rarity = BSR[i] ?? null;
                                        player.secondarySlots.push(id === null ? null : { id, rarity });
                                    }
                            
                                    if (player.body?.setSlot) {
                                        for (let i = 0; i < player.secondarySlots.length; i++) {
                                            const s = player.secondarySlots[i];
                                            if (!s) continue;
                                            try { if (s.id >= 0) player.body.setSlot(i, s.id, s.rarity); } catch {}
                                        }
                                    }
                            
                                    player.inventory = data.I ?? {};
                            
                                    player.craftingStats = data.CPR ?? {};
                            
                            player.craftingStatsPerPetal = {};
                            const savedCPP = data.CPP ?? {};
                            
                            for (const [rarity, petals] of Object.entries(savedCPP)) {
                                const r = Number(rarity);
                            
                                for (const [key, stats] of Object.entries(petals)) {
                                    const attempts = stats?.A ?? 0;
                                    if (attempts <= 0) continue;
                            
                                    const pid = getPetalId(key);
                                    if (pid === null) continue;
                            
                                    const nextRarity = r;
                                    player.craftingStatsPerPetal[nextRarity] =
                                        player.craftingStatsPerPetal[nextRarity] || {};
                            
                                    player.craftingStatsPerPetal[nextRarity][pid] = { A: attempts };
                                }
                            }
                            
                            
                                    this.systemMessage(`Logged in as ${username}. Stats loaded!`, "#8375ff");
                                    return;
                                }
                            
                                player.accountName = username;
                                player.accountPassword = password;
                                this.systemMessage(`No account found. Creating new account for ${username}.`, "#8375ff");
                            
                                const unlockedSlots = 5;
                                player.slots = Array.from({ length: unlockedSlots }, () => ({ id: 0, rarity: 0 }));
                                player.secondarySlots = Array.from({ length: unlockedSlots }, () => null);
                            
                            player.craftingStats = player.craftingStats || {};
                            player.craftingStatsPerPetal = player.craftingStatsPerPetal || {};
                            for (let i = 0; i < RARITIES.length; i++) {
                                player.craftingStats[i] = player.craftingStats[i] || { A: 0, S: 0, C: 0, L: 0 };
                                player.craftingStatsPerPetal[i] = player.craftingStatsPerPetal[i] || {};
                            }
                            
                            const CPR = {};
                            const CPP = {};
                            for (let i = 0; i < RARITIES.length; i++) {
                                CPR[i] = {
                                    A: player.craftingStats[i].A,
                                    S: player.craftingStats[i].S,
                                    C: player.craftingStats[i].C,
                                    L: player.craftingStats[i].L
                                };
                                CPP[i] = {};
                            }
                            
                            PLAYER_ACCOUNTS[username] = {
                                username,
                                password,
                                data: {
                                    aN: username,
                                    aP: password,
                                    sW: player.startingWave || 0,
                                    L: player.level || 0,
                                    XP: player.xp || 0,
                                    TSP: player.slots.map(s => s.id),
                                    TSR: player.slots.map(s => s.rarity),
                                    BSP: player.secondarySlots.map(s => s?.id ?? null),
                                    BSR: player.secondarySlots.map(s => s?.rarity ?? null),
                                    I: player.inventory || {},
                                    CPR,
                                    CPP
                                }
                            };
                            
                            this.systemMessage(`New account created for ${username}!`, "#8375ff");
                            console.log("[SAVE DATA] " + JSON.stringify(PLAYER_ACCOUNTS[username].data));
                            }
                            if (e.startsWith("/currentusers") || e.startsWith("/cu")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                if (Current_Player_Accounts.size === 0) {
                                    return this.systemMessage("No users have logged in yet.", "#ff7575");
                                }
                            
                                const usernames = Array.from(Current_Player_Accounts.keys()).join(", ");
                                this.systemMessage(`Current logged-in users: ${usernames}`, "#75ff83");
                            }
                            if (e.startsWith("/equip")) {
                                const parts = e.trim().split(/\s+/);
                            
                                if (parts.length < 3) {
                                    return this.systemMessage(
                                        "Usage: /equip [amount] <rarity> <petal>",
                                        "#ffb375"
                                    );
                                }
                            
                                let amount;
                                let rarityNameRaw;
                                let petalNameRaw;
                            
                                if (!Number.isNaN(parseInt(parts[1], 10))) {
                                    amount = parseInt(parts[1], 10);
                                    rarityNameRaw = parts[2];
                                    petalNameRaw = parts.slice(3).join(" ");
                                }
                                else {
                                    amount = 1;
                                    rarityNameRaw = parts[1];
                                    petalNameRaw = parts.slice(2).join(" ");
                                }
                            
                                if (!rarityNameRaw || !petalNameRaw) {
                                    return this.systemMessage(
                                        "Usage: /equip [amount] <rarity> <petal>",
                                        "#ffb375"
                                    );
                                }
                            
                                if (amount <= 0) {
                                    return this.systemMessage("Invalid amount.", "#ffb375");
                                }
                            
                                const rarityIdx = RARITIES.findIndex(
                                    r => r.name.toLowerCase() === rarityNameRaw.toLowerCase()
                                );
                                if (rarityIdx === -1) {
                                    return this.systemMessage("Unknown rarity: " + rarityNameRaw, "#ffb375");
                                }
                            
                                const rarityKey = "Rarity_" + rarityIdx;
                                const inv = this.inventory || {};
                                const rarityInv = inv[rarityKey];
                                if (!rarityInv) {
                                    return this.systemMessage(`You have no ${RARITIES[rarityIdx].name} petals.`, "#ffb375");
                                }
                            
                                const petalKey = findPetalKey(rarityInv, petalNameRaw);
                                if (!petalKey) {
                                    return this.systemMessage(
                                        `You have no '${petalNameRaw}' petals in ${RARITIES[rarityIdx].name}.`,
                                        "#ffb375"
                                    );
                                }
                            
                                const have = Number(rarityInv[petalKey] || 0);
                                if (have <= 0) {
                                    return this.systemMessage(`You have no '${petalKey}' petals left.`, "#ffb375");
                                }
                            
                                if (!Array.isArray(this.secondarySlots)) {
                                    this.secondarySlots = new Array(this.slots?.length ?? 5).fill(null);
                                }
                            
                                const freeSlots = this.secondarySlots.filter(s => s === null).length;
                                if (freeSlots <= 0) {
                                    return this.systemMessage("Your bottom slots are full.", "#ffb375");
                                }
                            
                                const toEquip = Math.min(amount, have, freeSlots);
                            
                                let petalId = Number(petalKey);
                                if (!Number.isFinite(petalId)) {
                                    petalId = PETALS.findIndex(p => p.toLowerCase() === petalKey.toLowerCase());
                                    if (petalId === -1) {
                                        petalId = PETALS.findIndex(p => p.toLowerCase().includes(petalKey.toLowerCase()));
                                    }
                                }
                                if (petalId === -1) {
                                    return this.systemMessage(
                                        `Couldn't map petal name '${petalKey}' to an index.`,
                                        "#ffb375"
                                    );
                                }
                            
                                rarityInv[petalKey] -= toEquip;
                                rarityInv.__total = (rarityInv.__total || 0) - toEquip;
                                if (rarityInv[petalKey] <= 0) delete rarityInv[petalKey];
                                if (!rarityInv.__total || rarityInv.__total <= 0) delete inv[rarityKey];
                            
                                let equipped = 0;
                                for (let i = 0; i < this.secondarySlots.length && equipped < toEquip; i++) {
                                    if (this.secondarySlots[i] === null) {
                                        this.secondarySlots[i] = { id: petalId, rarity: rarityIdx };
                                        equipped++;
                                    }
                                }
                            
                                try { this.worldUpdate(); } catch (err) {}
                            
                                return this.systemMessage(
                                    `Equipped ${equipped} ${RARITIES[rarityIdx].name} ${PETALS[petalId] ?? petalKey}.`,
                                    RARITIES[rarityIdx].color
                                );
                            }
                            if (e.startsWith("/help")) {
                                const messages = [
                                    "Saving/loading/creating accounts: /login [user] [password]",
                                    " ",
                                    "Inventory: /inv or /inv [rarity] or /inv [petal]",
                                    " ",
                                    "Crafting: /craft [amount] [rarity] [petal] or /c(raft) all [rarity]",
                                    " ",
                                    "Equiping: /equip [amount] [rarity] [petal], Unequiping: K [diget 1-0] (not in chat)",
                                    " ",
                                    "DontCraft: /dc or /dontcraft [petal] [add/remove or a/r] (stops petals from getting crafted by /c all [rarity])",
                                    " ",
                                    "Stats: /stats"
                                ];
                            
                                messages.forEach((msg, index) => {
                                    setTimeout(() => {
                                        this.systemMessage(msg, "#a875ff");
                                    }, index * 500);
                                });
                            }
                            if (e.startsWith("/saveall") || e.startsWith("/sa")) {
                                if (this.id !== 1) {
                                    return this.systemMessage("You are not the host.", "#ffb375");
                                }
                            
                                let savedCount = 0;
                            
                                for (const player of a.A.clients.values()) {
                                    try {
                                        if (!player || !player.accountName || !player.accountPassword) continue;
                            
                                        if (!PLAYER_ACCOUNTS[player.accountName]) {
                                            PLAYER_ACCOUNTS[player.accountName] = {
                                                username: player.accountName,
                                                password: player.accountPassword,
                                                data: {}
                                            };
                                        }
                            
                                        const CPR = {};
                                        for (let i = 0; i < RARITIES.length; i++) {
                                            const stats = player.craftingStats?.[i] || {};
                                            CPR[i] = {
                                                A: stats.A ?? 0,
                                                S: stats.S ?? 0,
                                                C: stats.C ?? 0,
                                                L: stats.L ?? 0
                                            };
                                        }
                            
                                        const CPP = {};
                                        if (player.craftingStatsPerPetal) {
                                            for (const [rarityIdx, petals] of Object.entries(player.craftingStatsPerPetal)) {
                                                CPP[rarityIdx] = {};
                                                for (const [petalId, stats] of Object.entries(petals)) {
                                                    const attempts = stats?.A ?? 0;
                                                    if (attempts > 0) {
                                                        CPP[rarityIdx][petalId] = { A: attempts };
                                                    }
                                                }
                                                if (Object.keys(CPP[rarityIdx]).length === 0) {
                                                    delete CPP[rarityIdx];
                                                            }
                                                        }
                                                    }
                                        
                                                    PLAYER_ACCOUNTS[player.accountName].data = {
                                                        aN: player.accountName,
                                                        aP: player.accountPassword,
                                                        L: player.level ?? 0,
                                                        XP: player.xp ?? 0,
                                                        sW: player.startingWave ?? 0,
                                                        TSP: (player.slots || []).map(s => s?.id ?? 0),
                                                        TSR: (player.slots || []).map(s => s?.rarity ?? 0),
                                                        BSP: (player.secondarySlots || []).map(s => s ? s.id : null),
                                                        BSR: (player.secondarySlots || []).map(s => s ? s.rarity : null),
                                                        I: player.inventory || {},
                                                        CPR,
                                                        CPP
                                                    };
                                        
                                                    savedCount++;
                                                    console.log(
                                                          "%c[SAVE DATA]%c" + `${JSON.stringify(PLAYER_ACCOUNTS[player.accountName].data)}`,
                                                      "color: purple; font-weight: bold;",
                                                      "color: magenta;"
                                                    );
                                                } catch (err) {
                                                    console.warn(`[SAVE FAIL] ${player?.accountName ?? "unknown"}:`, err);
                                                }
                                            }
                                        
                                            a.A.clients.forEach(c =>
                                                c.systemMessage(
                                                    `All accounts saved (${savedCount} player${savedCount === 1 ? "" : "s"}).`,
                                                    "#ff75ef"
                                                )
                                            );
                                        }
                                        if (["/give", "/remove"].some(cmd => e.startsWith(cmd))) {
                                            if (this.id !== 1) return this.systemMessage("You are not allowed to use this command.", "#ffb375");
                                        
                                            const parts = e.trim().split(/\s+/);
                                            const cmd = parts[0].toLowerCase();
                                        
                                            if (parts.length < 5) {
                                                return this.systemMessage(`Usage: ${cmd} <amount> <rarity> <petal> <userId|username>`, "#ffb375");
                                            }
                                        
                                            const amount = parseInt(parts[1], 10);
                                            if (Number.isNaN(amount) || amount <= 0) return this.systemMessage("Invalid amount.", "#ffb375");
                                        
                                            const rarityNameRaw = parts[2];
                                            const petalNameRaw = parts.slice(3, -1).join(" ");
                                            const targetRaw = parts[parts.length - 1];
                                        
                                            const rarityIdx = (typeof findRarityIndexByName === "function")
                                                ? findRarityIndexByName(rarityNameRaw)
                                                : RARITIES.findIndex(r => r.name.toLowerCase() === rarityNameRaw.toLowerCase());
                                        
                                            if (rarityIdx === -1) return this.systemMessage("Unknown rarity: " + rarityNameRaw, "#ffb375");
                                        
                                            const clientsCollection = (typeof s !== "undefined" && s.A && s.A.clients) ||
                                                                      (globalThis.gameState && globalThis.gameState.clients) || null;
                                        
                                            if (!clientsCollection) return this.systemMessage("Server clients collection not available.", "#ffb375");
                                        
                                            let target = null;
                                            const maybeId = parseInt(targetRaw, 10);
                                            if (!Number.isNaN(maybeId)) {
                                                if (typeof clientsCollection.get === "function") {
                                                    target = clientsCollection.get(maybeId);
                                                } else if (Array.isArray(clientsCollection)) {
                                                    target = clientsCollection.find(c => c && c.id === maybeId);
                                                }
                                            }
                                        
                                            if (!target) {
                                                const want = String(targetRaw).toLowerCase();
                                                if (typeof clientsCollection.values === "function") {
                                                    for (const c of clientsCollection.values()) {
                                                        if (c && String(c.username).toLowerCase() === want) { target = c; break; }
                                                    }
                                                } else if (Array.isArray(clientsCollection)) {
                                                    target = clientsCollection.find(c => c && String(c.username).toLowerCase() === want);
                                                }
                                            }
                                        
                                            if (!target) return this.systemMessage(`No user '${targetRaw}' found.`, "#ffb375");
                                        
                                            let petalId = PETALS.findIndex(p => p.toLowerCase() === petalNameRaw.toLowerCase());
                                            if (petalId === -1) petalId = PETALS.findIndex(p => p.toLowerCase().includes(petalNameRaw.toLowerCase()));
                                            if (petalId === -1) return this.systemMessage("Unknown petal: " + petalNameRaw, "#ffb375");
                                        
                                            const petalKey = PETALS[petalId];
                                        
                                            target.inventory = target.inventory || {};
                                            const tRarityKey = "Rarity_" + rarityIdx;
                                            target.inventory[tRarityKey] = target.inventory[tRarityKey] || {};
                                            const tInv = target.inventory[tRarityKey];
                                        
                                            if (cmd === "/give" || cmd === "/add") {
                                                tInv[petalKey] = (tInv[petalKey] || 0) + amount;
                                                tInv.__total = (tInv.__total || 0) + amount;
                                        
                                                this.systemMessage(
                                                    `Granted ${amount} ${petalKey} (${RARITIES[rarityIdx].name}) to ${target.username ?? target.id}.`,
                                                    RARITIES[rarityIdx].color
                                                );
                                                try {
                                                    target.systemMessage(
                                                        `You received ${amount} ${petalKey} (${RARITIES[rarityIdx].name}) from the host.`,
                                                        RARITIES[rarityIdx].color
                                                    );
                                                } catch {}
                                            } else if (cmd === "/remove") {
                                                if (!tInv[petalKey] || tInv[petalKey] <= 0) {
                                                    return this.systemMessage(`${target.username ?? target.id} has no ${petalKey} (${RARITIES[rarityIdx].name}) to remove.`, "#ffb375");
                                                }
                                        
                                                const removedAmount = Math.min(amount, tInv[petalKey]);
                                                tInv[petalKey] -= removedAmount;
                                                tInv.__total -= removedAmount;
                                        
                                                if (tInv[petalKey] <= 0) delete tInv[petalKey];
                                                if (tInv.__total <= 0) delete target.inventory[tRarityKey];
                                        
                                                this.systemMessage(
                                                    `Removed ${removedAmount} ${petalKey} (${RARITIES[rarityIdx].name}) from ${target.username ?? target.id}.`,
                                                    RARITIES[rarityIdx].color
                                                );
                                                try {
                                                    target.systemMessage(
                                                        `${removedAmount} ${petalKey} (${RARITIES[rarityIdx].name}) has been removed from your inventory.`,
                                                        RARITIES[rarityIdx].color
                                                    );
                                                } catch {}
                                            }
                                        }
                                    }
                                } catch (err) {
                                console.error("[CHAT CRASH PREVENTED]", err);
                                console.error("Message that caused error:", t.data);
                            }
                        break;
                        }   
                    }
                            
                chatMessage(username, message, color) {
                    if (!message.startsWith("/")) {
                        this.talk(s.de.CHAT_MESSAGE, {
                            type: 0,
                            username: username,
                            message: message,
                            color: color
                        });
                    }
                    if (message.startsWith("/")) {
                    }
                }
                
                systemMessage(message, color) {
                    if (!message.startsWith("/")) {
                        this.talk(s.de.CHAT_MESSAGE, {
                            type: 1,
                            message: message,
                            color: color
                        });
                    }
                }
                talk(t, e) {
                    const i = new s.AU(!0);
                    switch (i.setUint8(s.jU.PIPE_PACKET),
                    i.setUint16(this.id),
                    i.setUint8(t),
                    t) {
                    case s.de.KICK:
                    case s.de.DEATH:
                        i.setStringUTF8(e);
                        break;
                    case s.de.ROOM_UPDATE:
                        i.setFloat32(e.width),
                        i.setFloat32(e.height),
                        i.setUint8(e.isRadial ? 1 : 0),
                        i.setUint8(e.biome);
                        break;
                    case s.de.JSON_MESSAGE:
                        i.setStringUTF8(JSON.stringify(e));
                        break;
                    case s.de.CHAT_MESSAGE:
                        i.setUint8(e.type),
                        0 === e.type && i.setStringUTF8(e.username),
                        i.setStringUTF8(e.message),
                        i.setStringUTF8(e.color)
                    }
                    a.A.router.postMessage(i.build())
                }
                onClose() {
                    const player = this.player || this;
                    const accountName = player.accountName || `guest_${this.id}`;
                
                    console.log(`Client ${this.id} (${this.username || accountName}) disconnected`);
                
                    const RARITIES = [
                        { name: "Common", color: "#7eef6d" },
                        { name: "Unusual", color: "#ffe65d" },
                        { name: "Rare", color: "#4d52e3" },
                        { name: "Epic", color: "#861fde" },
                        { name: "Legendary", color: "#de1f1f" },
                        { name: "Mythic", color: "#1fdbde" },
                        { name: "Ultra", color: "#ff2b75" },
                        { name: "Super", color: "#2bffa3" },
                        { name: "Omega", color: "#494849" },
                        { name: "Fabled", color: "#ff5500" },
                        { name: "Divine", color: "#67549c" },
                        { name: "Supreme", color: "#b25dd9" },
                        { name: "Omnipotent", color: "#5e004f" },
                        { name: "Astral", color: "#046307" },
                        { name: "Celestial", color: "#608efc" },
                        { name: "Seraphic", color: "#c77e5b" },
                        { name: "Transcendent", color: "#ffffff" },
                        { name: "Ethereal", color: "#f6c5de" },
                        { name: "Galactic", color: "#7f0226" },
                        { name: "Eternal", color: "#146636" },
                        { name: "Apotheotic", color: "#b3ab56" },
                        { name: "Voidbound", color: "#250a3d" },
                        { name: "Exalted", color: "#18608c" },
                        { name: "Chaos", color: "#20258a" },
                        { name: "Cataclysmic", color: "#940909" },
                        { name: "Nullborne", color: "#434246" }
                    ];
                
                    const craftingStatsPerRarity = {};
                    for (let i = 0; i < RARITIES.length; i++) {
                        const src = player.craftingStats?.[i] || {};
                        craftingStatsPerRarity[i] = {
                            A: src.A ?? 0,
                            S: src.S ?? 0,
                            C: src.C ?? 0,
                            L: src.L ?? 0
                        };
                    }

                    const craftingStatsPerPetal = {};
                    if (player.craftingStatsPerPetal) {
                        for (const [rarityIdx, petals] of Object.entries(player.craftingStatsPerPetal)) {
                            const tier = {};
                            for (const [petalId, stats] of Object.entries(petals)) {
                                const attempts = stats?.A ?? 0;
                                if (attempts > 0) {
                                    tier[petalId] = { A: attempts };
                                }
                            }
                    
                            if (Object.keys(tier).length > 0) {
                                craftingStatsPerPetal[rarityIdx] = tier;
                            }
                        }
                    }
                    
                    
                    try {
                        if (!player || !player.accountName || !player.accountPassword) return;
                    
                        if (!PLAYER_ACCOUNTS[player.accountName]) {
                            PLAYER_ACCOUNTS[player.accountName] = {
                                username: player.accountName,
                                password: player.accountPassword,
                                data: {}
                            };
                        }
                    
                        PLAYER_ACCOUNTS[player.accountName].data = {
                            aN: player.accountName,
                            aP: player.accountPassword,
                            sW: player.startingWave,
                            L: player.level,
                            XP: player.xp,
                            TSP: (player.slots || []).map(s => s?.id ?? 0),
                            TSR: (player.slots || []).map(s => s?.rarity ?? 0),
                            BSP: (player.secondarySlots || []).map(s => s ? s.id : null),
                            BSR: (player.secondarySlots || []).map(s => s ? s.rarity : null),
                            I: player.inventory || {},
                            CPR: player.craftingStats || {},
                            CPP: player.craftingStatsPerPetal || {}
                        };
                    console.log(
      "%c[SAVE DATA]%c" + `${JSON.stringify(PLAYER_ACCOUNTS[player.accountName].data)}`,
  "color: black; font-weight: bold;",
  "color: white;"
);
                        player.systemMessage && player.systemMessage("Your account has been saved.", "#ff75ef");
                    } catch (err) {
                        console.warn(`[AUTO SAVE FAIL] ${player?.accountName ?? "unknown"}:`, err);
                    }                       
                    if (this.body) {
                        this.body.destroy();
                    }
                
                    a.A.clients.delete(this.id);
                }
                terminate() {
                    a.A.router.postMessage(new Uint8Array([s.jU.CLOSE_CLIENT, this.id]))
                }
                kick(t="Unknown Reason") {
                    this.talk(s.de.KICK, t),
                    this.body?.destroy(),
                    this.terminate()
                }
                worldUpdate() {
                    if (!this.verified)
                        return;
                    if (null !== this.body) {
                        this.camera.x = this.body.x,
                        this.camera.y = this.body.y,
                        this.camera.fov = 1256 + this.body.extraVision,
                        this.slotRatios = [];
                        for (let t = 0; t < this.body.petalSlots.length; t++)
                            this.slotRatios.push(this.body.petalSlots[t].displayRatio)
                    }
                    const t = new s.AU(!0);
                    t.setUint8(s.jU.PIPE_PACKET),
                    t.setUint16(this.id),
                    t.setUint8(s.de.WORLD_UPDATE),
                    t.setFloat32(this.camera.x),
                    t.setFloat32(this.camera.y),
                    t.setFloat32(this.camera.fov),
                    t.setUint8(this.camera.lightingBoost),
                    t.setUint32(this.body ? this.body.id : 0),
                    this.camera.see(t),
                    t.setUint8(this.slots.length);
                    for (let e = 0; e < this.slots.length; e++) {
                        const i = this.slots[e];
                        t.setUint8(i.id),
                        t.setUint8(i.rarity),
                        t.setFloat32(this.slotRatios[e] ?? 0)
                    }
                    t.setUint8(this.secondarySlots.length);
                    for (let e = 0; e < this.secondarySlots.length; e++) {
                        const i = this.secondarySlots[e];
                        t.setUint8(i ? 1 : 0),
                        i && (t.setUint8(i.id),
                        t.setUint8(i.rarity))
                    }
                    a.A.isWaves ? (t.setUint8(1),
                    t.setUint16(a.A.currentWave),
                    t.setUint16(a.A.livingMobCount),
                    t.setUint16(a.A.maxMobs)) : t.setUint8(0),
                    t.setUint16(this.level),
                    t.setFloat32(this.levelProgress),
                    a.A.router.postMessage(t.build())
                }
                sendRoom() {
                    this.talk(s.de.ROOM_UPDATE, a.A)
                }
                addDrop(t) {
                    this.camera.dropsToAdd.push(t)
                }
                removeDrop(t) {
                    this.camera.dropsToRemove.push(t)
                }
            }
            class A {
                constructor(t, e) {
                    this.width = t,
                    this.height = e,
                    this.grid = new Array(t * e).fill(0),
                    this.spacing = 4,
                    this.gridChance = 1,
                    this.toPlaceAmount = .4,
                    this.maxNeighbors = 4,
                    this.maxDiagonalNeighbors = 0,
                    this.removeSingles = !1,
                    this.removeBlocks = !1
                }
                get(t, e) {
                    return this.grid[e * this.width + t]
                }
                set(t, e, i) {
                    this.grid[e * this.width + t] = i
                }
                get toPlace() {
                    return this.width * this.height * this.toPlaceAmount
                }
                getOnes() {
                    return this.grid.reduce(( (t, e) => t + e), 0)
                }
                getNeighbors(t, e) {
                    const i = e > 0 ? this.get(t, e - 1) : 0
                      , s = e < this.height - 1 ? this.get(t, e + 1) : 0
                      , a = t < this.width - 1 ? this.get(t + 1, e) : 0
                      , n = t > 0 ? this.get(t - 1, e) : 0
                      , h = e > 0 && t < this.width - 1 ? this.get(t + 1, e - 1) : 0
                      , r = e > 0 && t > 0 ? this.get(t - 1, e - 1) : 0
                      , o = e < this.height - 1 && t < this.width - 1 ? this.get(t + 1, e + 1) : 0
                      , l = e < this.height - 1 && t > 0 ? this.get(t - 1, e + 1) : 0;
                    return {
                        cardinal: [i, s, a, n],
                        diagonal: [h, r, o, l],
                        north: i,
                        south: s,
                        east: a,
                        west: n,
                        northEast: h,
                        northWest: r,
                        southEast: o,
                        southWest: l
                    }
                }
                stepOne() {
                    for (let t = 1; t < this.width - 1; t += this.spacing)
                        for (let e = 1; e < this.height - 1; e += this.spacing)
                            Math.random() < this.gridChance && this.set(t, e, 1)
                }
                stepTwo() {
                    let t = 0;
                    for (; this.getOnes() < this.toPlace && t++ < 1048576; ) {
                        const t = Math.floor(Math.random() * this.width)
                          , e = Math.floor(Math.random() * this.height)
                          , i = this.getNeighbors(t, e)
                          , s = i.cardinal.filter((t => !!t)).length
                          , a = i.diagonal.filter((t => !!t)).length;
                        0 === this.get(t, e) && (0 === s || s > 0) && s <= this.maxNeighbors && a <= this.maxDiagonalNeighbors && this.set(t, e, 1)
                    }
                }
                stepThree() {
                    for (let t = 0; t < this.width; t++)
                        this.set(t, 0, 0),
                        this.set(t, this.height - 1, 0);
                    for (let t = 0; t < this.height; t++)
                        this.set(0, t, 0),
                        this.set(this.width - 1, t, 0);
                    const t = [];
                    (function e(i, s) {
                        if (t.some(( ({x: t, y: e}) => t === i && e === s)))
                            return;
                        t.push({
                            x: i,
                            y: s
                        });
                        const a = this.getNeighbors(i, s);
                        i > 0 && 0 === a.west && e.call(this, i - 1, s),
                        i < this.width - 1 && 0 === a.east && e.call(this, i + 1, s),
                        s > 0 && 0 === a.north && e.call(this, i, s - 1),
                        s < this.height - 1 && 0 === a.south && e.call(this, i, s + 1)
                    }
                    ).call(this, 0, 0);
                    const e = [];
                    for (let i = 1; i < this.width - 1; i++)
                        for (let s = 1; s < this.height - 1; s++)
                            0 !== this.get(i, s) || t.some(( ({x: t, y: e}) => t === i && e === s)) || e.push({
                                x: i,
                                y: s
                            });
                    for (const {x: t, y: i} of e)
                        this.set(t, i, 1)
                }
                stepFour() {
                    for (let t = 1; t < this.width - 1; t++)
                        for (let e = 1; e < this.height - 1; e++)
                            if (1 === this.get(t, e)) {
                                0 === this.getNeighbors(t, e).cardinal.filter((t => !!t)).length && this.set(t, e, 0)
                            }
                }
                stepFive() {
                    let t;
                    for (; (t = this.findATwoByTwo()) && null !== t && t.width >= 2 && t.height >= 2; )
                        for (let e = t.x; e < t.x + t.width; e++)
                            for (let i = t.y; i < t.y + t.height; i++)
                                this.set(e, i, 0)
                }
                findATwoByTwo() {
                    let t = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                    for (let e = 0; e < this.width - 1; e++)
                        for (let i = 0; i < this.height - 1; i++)
                            if (1 === this.get(e, i) && 1 === this.get(e + 1, i) && 1 === this.get(e, i + 1) && 1 === this.get(e + 1, i + 1))
                                return t.x = e,
                                t.y = i,
                                t.width = 2,
                                t.height = 2,
                                t;
                    return t
                }
                reset() {
                    for (let t = 0; t < this.width; t++)
                        for (let e = 0; e < this.height; e++)
                            this.set(t, e, 0)
                }
                generate() {
                    this.stepOne();
                    let t = 0;
                    for (; this.getOnes() < this.toPlace && t++ < 8; )
                        this.stepTwo(),
                        this.stepThree(),
                        this.removeSingles && this.stepFour(),
                        this.removeBlocks && this.stepFive();
                    this.removeSingles && this.stepFour()
                }
                getBlocks() {
                    const t = []
                      , e = this.to2DArray();
                    function i() {
                        let t = {
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        };
                        function i(t, i) {
                            let s = 0
                              , n = 0
                              , h = 0;
                            for (let r = 1; t + r <= e.length; r++) {
                                let o = 0;
                                for (; i + o < e[t].length && a(t, i, r, o + 1); )
                                    o++;
                                if (r * o > s && (s = r * o,
                                n = r,
                                h = o),
                                0 === o)
                                    break
                            }
                            return {
                                width: n,
                                height: h
                            }
                        }
                        function s(t, i) {
                            let s = 0
                              , n = 0
                              , h = 0;
                            for (let r = 1; i + r <= e[t].length; r++) {
                                let o = 0;
                                for (; t + o < e.length && a(t, i, o + 1, r); )
                                    o++;
                                if (o * r > s && (s = o * r,
                                n = o,
                                h = r),
                                0 === o)
                                    break
                            }
                            return {
                                width: n,
                                height: h
                            }
                        }
                        function a(t, i, s, a) {
                            for (let n = t; n < t + s; n++)
                                for (let t = i; t < i + a; t++)
                                    if (1 !== e[n][t])
                                        return !1;
                            return !0
                        }
                        for (let a = 0; a < e.length; a++)
                            for (let n = 0; n < e[a].length; n++)
                                if (1 === e[a][n]) {
                                    let e = 0
                                      , h = 0
                                      , r = 0;
                                    const o = i(a, n)
                                      , l = s(a, n);
                                    o.width * o.height > e && (e = o.width * o.height,
                                    h = o.width,
                                    r = o.height),
                                    l.width * l.height > e && (e = l.width * l.height,
                                    h = l.width,
                                    r = l.height),
                                    e > t.width * t.height && (t = {
                                        x: a,
                                        y: n,
                                        width: h,
                                        height: r
                                    })
                                }
                        return t
                    }
                    for (; e.reduce(( (t, e) => t + e.reduce(( (t, e) => t + e), 0)), 0) > 0; ) {
                        const s = i();
                        if (s.width * s.height > 0) {
                            t.push({
                                x: s.x,
                                y: s.y,
                                width: s.width,
                                height: s.height
                            });
                            for (let t = s.x; t < s.x + s.width; t++)
                                for (let i = s.y; i < s.y + s.height; i++)
                                    e[t][i] = 0
                        }
                    }
                    return t
                }
                to2DArray() {
                    const t = [];
                    for (let e = 0; e < this.width; e++) {
                        t.push([]);
                        for (let i = 0; i < this.height; i++) {
                            let s = this.get(e, i);
                            1 == s && (s = {
                                type: -1
                            }),
                            2 == s && (s = {
                                type: 1,
                                rarity: 0
                            }),
                            s >= 3 && (s = {
                                type: 2,
                                rarity: s - 3
                            }),
                            t[e].push(s)
                        }
                    }
                    return t
                }
            }
            class w {
                constructor(t) {
                    this.maze = t,
                    this.grid = []
                }
                reset() {
                    for (let t = 0; t < this.maze.height; t++) {
                        this.grid[t] = [];
                        for (let e = 0; e < this.maze.width; e++)
                            this.grid[t][e] = this.maze.get(e, t)
                    }
                }
                heuristicCostEstimate(t, e, i, s) {
                    return Math.abs(t - i) + Math.abs(e - s)
                }
                findPath(t, e, i, s) {
                    this.reset();
                    const a = []
                      , n = []
                      , h = {
                        x: t,
                        y: e,
                        g: 0,
                        h: this.heuristicCostEstimate(t, e, i, s),
                        parent: null
                    };
                    for (a.push(h); a.length > 0; ) {
                        let t = a[0];
                        for (let e = 1; e < a.length; e++)
                            a[e].g + a[e].h < t.g + t.h && (t = a[e]);
                        if (t.x === i && t.y === s) {
                            let e = [];
                            for (; t.parent; )
                                e.push([t.x, t.y]),
                                t = t.parent;
                            return e.reverse()
                        }
                        a.splice(a.indexOf(t), 1),
                        n.push(t);
                        const e = this.getNeighbors(t);
                        for (const h of e) {
                            if (n.find((t => t.x === h.x && t.y === h.y)))
                                continue;
                            const e = t.g + 1;
                            let r = !1;
                            a.find((t => t.x === h.x && t.y === h.y)) ? e < h.g && (r = !0) : (a.push(h),
                            r = !0),
                            r && (h.parent = t,
                            h.g = e,
                            h.h = this.heuristicCostEstimate(h.x, h.y, i, s))
                        }
                    }
                    return []
                }
                getNeighbors(t) {
                    const e = []
                      , {x: i, y: s} = t;
                    return i > 0 && 1 !== this.grid[s][i - 1] && e.push({
                        x: i - 1,
                        y: s,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    i < this.maze.width - 1 && 1 !== this.grid[s][i + 1] && e.push({
                        x: i + 1,
                        y: s,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    s > 0 && 1 !== this.grid[s - 1][i] && e.push({
                        x: i,
                        y: s - 1,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    s < this.maze.height - 1 && 1 !== this.grid[s + 1][i] && e.push({
                        x: i,
                        y: s + 1,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    e
                }
            }
            const b = "/server/maps/antHell.json"
              , M = "/server/maps/desert.json"
              , x = "/server/maps/ocean.json"
              , S = "/server/maps/hell.json"
              , D = "/server/maps/sewers.json"
              , E = "/server/maps/darkForest.json"
              , v = "/server/maps/sleepyMaze.json"
              , R = "/server/maps/sleepyMazeOmega.json";
            let T = "/server/maps/standard.json"
              , P = [];
            async function k(t) {
                if (r.Iv && t === s.VC.HALLOWEEN || Math.random() > 1)
                    P = function(t, e, i=!1) {
                        const s = new A(t,e);
                        if (s.spacing = 4,
                        s.gridChance = 1,
                        s.toPlaceAmount = .425,
                        s.maxNeighbors = 4,
                        s.maxDiagonalNeighbors = 2,
                        s.removeSingles = !0,
                        s.removeBlocks = !1,
                        s.generate(),
                        i) {
                            for (let i = 0; i < t; i++)
                                s.set(i, 0, 1),
                                s.set(i, e - 1, 1);
                            for (let i = 0; i < e; i++)
                                s.set(0, i, 1),
                                s.set(t - 1, i, 1)
                        }
                        let a = 0
                          , n = 0;
                        do {
                            a = Math.floor(Math.random() * t),
                            n = Math.floor(Math.random() * e)
                        } while (0 !== s.get(a, n));
                        s.set(a, n, 2);
                        const h = new w(s);
                        let r = 0;
                        for (let t = 0; t < s.width; t++)
                            for (let e = 0; e < s.height; e++)
                                if (0 === s.get(t, e)) {
                                    const i = h.findPath(a, n, t, e);
                                    s.set(t, e, i.length + 10),
                                    r = Math.max(r, i.length)
                                }
                        for (let t = 0; t < s.width; t++)
                            for (let e = 0; e < s.height; e++)
                                s.get(t, e) > 10 && s.set(t, e, Math.floor((s.get(t, e) - 10) / r * 9) + 3);
                        return s.to2DArray()
                    }(56, 56, !1);
                else {
                    switch (t) {
                    case s.VC.DEFAULT:
                        T = v;
                        break;
                    case s.VC.GARDEN:
                        T = R;
                        break;
                    case s.VC.DESERT:
                        T = M;
                        break;
                    case s.VC.OCEAN:
                        T = x;
                        break;
                    case s.VC.ANT_HELL:
                        T = b;
                        break;
                    case s.VC.HELL:
                        T = S;
                        break;
                    case s.VC.SEWERS:
                        T = D;
                        break;
                    case s.VC.DARK_FOREST:
                        T = E;
                        break;
                    default:
                        throw new Error("Invalid biome type")
                    }
                    if ("string" == typeof T) {
                        const t = await fetch(T);
                        P = await t.json()
                    } else
                        P = T
                }
                const e = {
                    width: P.width,
                    height: P.height,
                    mobSpawners: P.mobSpawners,
                    maxRarity: P.maxRarity,
                    cells: P.cells,
                    get: (t, e) => P.cells.filter((i => {
                        if (i.x == t && i.y == e)
                            return !0
                    }
                    ))[0]
                };
                a.A.terrainGridWidth = e.width,
                a.A.terrainGridHeight = e.height;
                const i = a.A.width / a.A.terrainGridWidth / 2
                  , h = {
                    [s.wv.PLAYER]: [],
                    [s.wv.MOB]: []
                };
                for (let t = 0; t < e.width; t++)
                    for (let r = 0; r < e.height; r++)
                        if (0 === e.get(t, r).type) {
                            let h = r <= 0 || 0 === e.get(t, r - 1).type
                              , o = t >= e.width - 1 || 0 === e.get(t + 1, r).type
                              , l = r >= e.height - 1 || 0 === e.get(t, r + 1).type
                              , d = t <= 0 || 0 === e.get(t - 1, r).type
                              , c = 0;
                            h || (c |= s.E4.TOP),
                            o || (c |= s.E4.RIGHT),
                            l || (c |= s.E4.BOTTOM),
                            d || (c |= s.E4.LEFT);
                            const g = new n.M_({
                                x: (t - a.A.terrainGridWidth / 2 + .5) * i * 2,
                                y: (r - a.A.terrainGridWidth / 2 + .5) * i * 2
                            },i,c);
                            g.gridX = t,
                            g.gridY = r
                        } else {
                            const i = {
                                x: t / a.A.terrainGridWidth - .5,
                                y: r / a.A.terrainGridHeight - .5,
                                rarity: Math.round(e.get(t, r).score * e.maxRarity)
                            };
                            h[s.wv[1 === e.get(t, r).type || 2 === e.get(t, r).type ? "PLAYER" : "MOB"]].push(i),
                            a.A.maxMapDistFromSpawn = Math.max(a.A.maxMapDistFromSpawn, i.dist)
                        }
                a.A.mapSpawns = h,
                a.A.mapData = P,
                a.A.updateTerrain()
            }
                    const defaultMobTables = {
                            [s.VC.GARDEN]: I({
                                [(0,
                                h.hs)("Ladybug")]: 15,
                                [(0,
                                h.hs)("Evil Ladybug")]: 5,
                                [(0,
                                h.hs)("Bee")]: 10,
                                [(0,
                                h.hs)("Rock")]: 15,
                                [(0,
                                h.hs)("Dirt")]: 7,
                                [(0,
                                h.hs)("Hornet")]: 50,
                                [(0,
                                h.hs)("Baby Ant")]: 5,
                                [(0,
                                h.hs)("Worker Ant")]: 15,
                                [(0,
                                h.hs)("Soldier Ant")]: 25,
                                [(0,
                                h.hs)("Tree")]: 7,
                                [(0,
                                h.hs)("Dandelion")]: 7,
                                [(0,
                                h.hs)("Spider")]: 50,
                                [(0,
                                h.hs)("Centipede")]: 2,
                                [(0,
                                h.hs)("Evil Centipede")]: 1,
                                [(0,
                                h.hs)("Ant Hole")]: 4
                            }),
                            [s.VC.DESERT]: I({
                                [(0,
                                h.hs)("Beetle")]: 100,
                                [(0,
                                h.hs)("Scorpion")]: 120,
                                [(0,
                                h.hs)("Sandstorm")]: 25,
                                [(0,
                                h.hs)("Sandstone")]: 25,
                                [(0,
                                h.hs)("Cactus")]: 45,
                                [(0,
                                h.hs)("Sunlit Frog")]: 45,
                                [(0,
                                h.hs)("Desert Moth")]: 45,
                                [(0,
                                h.hs)("Moonlit Frog")]: 35,
                                [(0,
                                h.hs)("Desert Centipede")]: 20,
                                [(0,
                                h.hs)("Fire Ant Hole")]: 10,
                                [(0,
                                h.hs)("Soldier Fire Ant")]: 30,
                                [(0,
                                h.hs)("Worker Fire Ant")]: 25,
                                [(0,
                                h.hs)("Baby Fire Ant")]: 10,
                                [(0,
                                h.hs)("Shiny Ladybug")]: 1
                            }),
                            [s.VC.OCEAN]: I({
                                [(0,
                                h.hs)("Jellyfish")]: 5,
                                [(0,
                                h.hs)("Sponge")]: 5,
                                [(0,
                                h.hs)("Bubble")]: 4,
                                [(0,
                                h.hs)("Shell")]: 4,
                                [(0,
                                h.hs)("Starfish")]: 3,
                                [(0,
                                h.hs)("Leech")]: 3,
                                [(0,
                                h.hs)("Crab")]: 2.5
                            }),
                            [s.VC.SEWERS]: I({
                                [(0,
                                h.hs)("Fly")]: 5,
                                [(0,
                                h.hs)("Moth")]: 4,
                                [(0,
                                h.hs)("Firefly")]: 4,
                                [(0,
                                h.hs)("Maggot")]: 3,
                                [(0,
                                h.hs)("Roach")]: 3,
                                [(0,
                                h.hs)("Spider")]: 3,
                                [(0,
                                h.hs)("Rock")]: 2,
                                [(0,
                                h.hs)("Evil Ladybug")]: 2,
                                [(0,
                                h.hs)("Evil Centipede")]: 1
                            }),
                            [s.VC.ANT_HELL]: I({
                                [(0,
                                h.hs)("Baby Ant")]: 5,
                                [(0,
                                h.hs)("Worker Ant")]: 5,
                                [(0,
                                h.hs)("Soldier Ant")]: 5,
                                [(0,
                                h.hs)("Queen Ant")]: 1,
                                [(0,
                                h.hs)("Ant Egg")]: 2,
                                [(0,
                                h.hs)("Baby Fire Ant")]: 5,
                                [(0,
                                h.hs)("Worker Fire Ant")]: 5,
                                [(0,
                                h.hs)("Soldier Fire Ant")]: 5,
                                [(0,
                                h.hs)("Queen Fire Ant")]: 1,
                                [(0,
                                h.hs)("Fire Ant Egg")]: 2,
                                [(0,
                                h.hs)("Baby Termite")]: 5,
                                [(0,
                                h.hs)("Worker Termite")]: 5,
                                [(0,
                                h.hs)("Soldier Termite")]: 5,
                                [(0,
                                h.hs)("Termite Overmind")]: 1,
                                [(0,
                                h.hs)("Termite Egg")]: 2
                            }),
                            [s.VC.HELL]: I({
                                [(0,
                                h.hs)("Hell Beetle")]: 25,
                                [(0,
                                h.hs)("Hell Spider")]: 25,
                                [(0,
                                h.hs)("Hell Yellowjacket")]: 20,
                                [(0,
                                h.hs)("Hell Centipede")]: 5,
                                [(0,
                                h.hs)("Demon")]: 2,
                                [(0,
                                h.hs)("Angelic Ladybug")]: 1
                            }),
                            [s.VC.HALLOWEEN]: I({
                                [(0,
                                h.hs)("Hell Beetle")]: 5,
                                [(0,
                                h.hs)("Hell Spider")]: 5,
                                [(0,
                                h.hs)("Hell Yellowjacket")]: 5,
                                [(0,
                                h.hs)("Hell Centipede")]: 5,
                                [(0,
                                h.hs)("Spider")]: 5,
                                [(0,
                                h.hs)("Pumpkin")]: 5,
                                [(0,
                                h.hs)("Jack O' Lantern")]: 5,
                                [(0,
                                h.hs)("Spirit")]: 4,
                                [(0,
                                h.hs)("Wilt")]: 3,
                                [(0,
                                h.hs)("Demon")]: 2,
                                [(0,
                                h.hs)("Termite Mound")]: 1
                            }),
                            [s.VC.DARK_FOREST]: I({
                                [(0,
                                h.hs)("Evil Centipede")]: 2,
                                [(0,
                                h.hs)("Evil Ladybug")]: 12.5,
                                [(0,
                                h.hs)("Termite Mound")]: 2,
                                [(0,
                                h.hs)("Soldier Termite")]: 16,
                                [(0,
                                h.hs)("Worker Termite")]: 8,
                                [(0,
                                h.hs)("Baby Termite")]: 8,
                                [(0,
                                h.hs)("Termite Egg")]: 1,
                                [(0,
                                h.hs)("Termite Overmind")]: 1,
                                [(0,
                                h.hs)("Wasp")]: 32.5,
                                [(0,
                                h.hs)("Spider")]: 25,
                                [(0,
                                h.hs)("Fly")]: 12.5,
                                [(0,
                                h.hs)("Stickbug")]: 8,
                                [(0,
                                h.hs)("Shrub")]: 15
                            })
                        };
            a.A.defaultMobTables = defaultMobTables;
            function I(t) {
                const e = [];
                for (const i in t)
                    for (let s = 0; s < t[i]; s++)
                        e.push(+i);
                return e
            }
            function C(t) {
                const e = {};
                for (const i of t)
                    e[i] = (e[i] || 0) + 1;
                const i = [];
                for (const s in e)
                    i.push({
                        id: s,
                        chance: e[s] / t.length
                    });
                return i.sort(( (t, e) => e.chance - t.chance)),
                i.map((t => h.ey[t.id].name + ": " + (100 * t.chance).toFixed(2) + "%")).join(", ")
            }
            globalThis.environmentName ??= "browser";
            class B {
                static encoder = new TextEncoder;
                static decoder = new TextDecoder;
                static isSandbox = "node" !== globalThis.environmentName && "bun" !== globalThis.environmentName && "localhost" !== location.hostname;
                static u16ToU8 = t => [255 & t, t >> 8];
                static u8ToU16 = (t, e=0) => t[e] | t[e + 1] << 8;
                static getText = (t, e, i) => B.decoder.decode(t.slice(e, e + i));
                static setText = t => B.encoder.encode(t);
                addClient(t, e, i) {
                    let s = !1;
                    if (!i)
                        for (const t of a.A.clients.values())
                            if (t.uuid === e) {
                                s = "DAR-7";
                                break
                            }
                    const n = new f(t,e,i);
                    return a.A.clients.size > 35 ? (n.kick("Lobby is full, create another one"),
                    null) : !1 !== s ? (n.kick(s),
                    null) : n
                }
                pipeMessage(t, e) {
                    const i = a.A.clients.get(t);
                    i && i.onMessage(new s.mP(e,0,!0))
                }
                removeClient(t) {
                    const e = a.A.clients.get(t);
                    e && e.onClose()
                }
                async begin(t) {
                    switch (await (0,
                    s.dX)(),
                    function(t) {
                        if (null == s.hg[t])
                            throw new Error("Invalid biome");
                        a.A.biome = t;
                            const e = defaultMobTables[t];
                        if (e) {
                            if (e.some((t => t < 0)))
                                throw new Error("Invalid mob table for " + s.hg[t].name);
                            a.A.mobTable = e
                        }
                    }(t[4]),
                    B.isSandbox && "maze" === t[1] && (t[1] = "ffa",
                    console.warn("Maze is not supported in sandbox")),
                    t[1]) {
                    case "maze":
                        a.A.isTDM = !0,
                        a.A.width = a.A.height = 12288,
                        a.A.gamemode = s.LX.MAZE,
                        a.A.mobsExpire = !0,
                        a.A.teamCount = 0,
                        a.A.announceRarity = 8,
                        await k(a.A.biome);
                        break;
                    case "ffa":
                        a.A.isTDM = !1,
                        a.A.gamemode = s.LX.FFA;
                        break;
                    case "tdm":
                        a.A.isTDM = !0,
                        a.A.gamemode = s.LX.TDM;
                        break;
                    case "waves":
                        a.A.isTDM = !0,
                        a.A.teamCount = 0,
                        a.A.isWaves = !0,
                        a.A.isRadial = !0,
                        a.A.gamemode = s.LX.WAVES;
                        break;
                    case "line":
                        a.A.isTDM = !0,
                        a.A.teamCount = 0,
                        a.A.isLineMap = !0,
                        a.A.gamemode = s.LX.LINE,
                        a.A.mobsExpire = !0;
                        break;
                    default:
                        throw new Error("Invalid gamemode")
                    }
                    a.A.secretKey = t[3],
                    console.log(["Lobby Created:", "  - Gamemode: " + t[1], "  - Biome: " + s.hg[t[4]].name, "  - Modded: " + (t[2] ? "Yes" : "No"), "  - Admin UUID: " + a.A.secretKey, "  - Spawn Table: " + (a.A.mobTable ? C(a.A.mobTable) : "None")].join("\n"))
                }
                postMessage(t) {}
            }
        }
        ,
        
        446: (t, e, i) => {
            i.d(e, {
                GJ: () => n,
                cK: () => a,
                ey: () => r,
                hf: () => c,
                hs: () => o,
                lm: () => s.lm,
                vx: () => d,
                zw: () => h
            });
            var s = i(110);
            const a = structuredClone(s.cK)
              , n = [new s.lm("Basic",56.25,10,10).setDescription("A simple petal. Not too strong, not too weak."), new s.lm("Light",13.5,1,27).setDamage([27,13.5,13.5,9,9,5.4,5.4,5.4,5.4,5.4,5.4,5.4,4.242732650594746]).setMulti([1, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 7, 9, 11], 0).setSize([.6,.6,.6,.6,.8,.8,.8,1.2,1.5,1.5,1.5,1.5,2,2.2,2.5]).setDescription("Very weak, but recharges very quickly."), new s.lm("Faster",22.5,10,14.5).setDamage([14.5,14.5,14.5,14.5,14.5,14.5,14.5,4.833,4.833,4.833,4.833,4.833,4.833,0.85]).setSize([.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,2.1]).setMulti([1,1,1,1,1,1,1,3,3,3,3,3,3,5], 1).setCooldown(1,1,1,1,1,1,1,1,0.7).setExtraRadians(.05).setDescription("It makes your petals spin faster."), new s.lm("Heavy",99,590,7).setSize([2,2,2,2,2,2,2,2,2.5,2.5,2.5,2.5,2.5,4.5,13,17.5]).setDensity(3).setDescription("It's so heavy, nothing gets in the way."), new s.lm("Stinger",112.5,5,325).setDamage([325,325,325,325,325,108.2474226804124,64.78260869565217]).setMulti([1, 1, 1, 1, 1, 3, 5, 5, 5, 5, 5, 5, 5, 6, 7], 1).setSize([.7, .7, .7, .7, .7, .7, .9, .9, 1.5, 1.5, 1.5, 1.9, 3.8, 3.8, 4.8]).setDescription("It hurts a lot, but it takes a while to recharge."), new s.lm("Rice",0,1,13.5).setSize([1.2,1.2,1.2,1.2,1.2,1.6,1.6,2,2.4,2.8,2.8,3.4,4.9,7.5]).setDescription("A bit weak, but recharges instantly."), new s.lm("Rock",72,232,28.5).setSize(1.3).setDescription("It's a rock, not much to say about it."), new s.lm("Cactus",45,12,60).setDamage([60,60,60,60,60,60,60,60,60,60,60,60,44.95049085087887]).setSize(1.2).setMulti([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5, 6], 1).setExtraHealth(110).setHuddles(1).setDescription("A petal that gives you extra health. Pretty magical if you ask me."), new s.lm("Leaf",22.5,12,35).setSize([1,1,1,1,1,1.4,1.4,1.7,1.7,1.8,1.8,1.8,2.4,3,4.5]).setMulti([1,1,1,1,1,1,1,1,1,3,3,3,3,5,6,7], 0).setConstantHeal(7).setDescription("A petal that heals you over time by the power of photosynthesis."), new s.lm("Wing",33.75,10,45.1).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,2,2,4,5], 0).setSize(1.4,1.4,1.4,1.4,1.4,1.4,1.4,2.8,2.8,2.8,2.8,2.8,4,5.5).setWingMovement(!0).setDescription("It comes and it goes."), new s.lm("Bone",51.75,4.25,23.5).setSize(1.6).setPetalDamageReduction(12).setDescription("A petal that reduces incoming damage."), new s.lm("Dirt",45,60,6).setSize(1.3).setExtraHealth(200).setExtraSize(5).setHuddles(1).setDescription("The extra soil gives your flower more mass, but it does slow you down a bit..."), new s.lm("Magnolia",44,8,8).setConstantHeal(2).setExtraHealth(12).setSize(1.5).setDescription("A purely magical petal that heals you over time while simultaneously making you tougher."), new s.lm("Corn",202.5,30000,8).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.7,1.7,1.7,3.9,6.6,8.8]).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3], 0).setDescription("It's a piece of corn. They say ants like to snack on it."), new s.lm("Sand",27,1,15.5).setSize(.7).setMulti([4,4,4,4,4,4,4,4,4,4,4,4,5,6], !0).setDescription("Some fine grains of sand. They recharge quickly and can pack a punch."), new s.lm("Orange",51.525,30,18.5).setDamage([18.5,18.5,18.5,18.5,18.5,18.5,18.5,18.5,13.77777777777778]).setMulti([3,3,3,3,3,3,3,4,4,4,4,4,5,5,6,7], 1).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.3,1.3,1.3,1.3,1.3,1.5,4.5,6]).setDescription("A bunch of oranges. They're pretty juicy."), new s.lm("Missile",21.375,31,20).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.7,2.4,3.2,3.2,3.2,4,8,10]).setLaunchable(2, 7).setDescription("You can actually shoot this one!"), new s.lm("projectile.pea",1e3,400,6.1).setSize([.8,.8,.8,.8,.8,.8,.8,.8,1.2,1.6,1.6,1.6,2.2,3,3.6]).setDescription("[object null object]"), new s.lm("Rose",22.5,5,1).setHealing([17.3]).setDescription("Not great at combat, but it's healing properties are amazing."), new s.lm("Yin Yang",22.5,10,36).setYinYang(1).setDescription("The mysterious petal of balance."), new s.lm("Pollen",22.5,9,17.5).setDamage([17.5,17.5,17.5,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,13.31034482758621,9.599686194686513]).setSize([.8,.8,.8,.8,.8,.8,.8,2,3,4]).setPetalDamageReduction(10).setLaunchable(0, 5).setMulti([2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 6, 7, 8], !1).setDescription("It makes you sneeze. Don't drop it!"), new s.lm("Honey",135,27000,0).setSize([1,1,1,1,1,1,1,1,1.5,2,2.5,3,3.5,4,4.5,5]).setSize(1.1).setHoney(1).setLaunchable(2.5, 6).setDescription("A decoy that attracts mobs away from flowers."), new s.lm("Iris",27,70,1).setSize([.6,.6,.6,.6,.6,.6,.6,.6,.6,.7,.8,1.6,2.4,5.2,7.2]).setPoison(90, 1.43).setDescription("Packs an unexpected punch in its secret weapon: poison."), new s.lm("Web",56.25,5,8).setDescription("Sticky!"), new s.lm("web.mob.launched",1024,1e5,0).setSize(30).setEnemySpeedMultiplier(.334, .05).setIgnoreWalls(1).setDescription("[object null object]"), new s.lm("Third Eye",22.5,10,18).setSize([1,1,1,1,1,1,1,1,1,1,1,1,1,1.8,4]).setExtraRange(1.1).setDescription("Through the eye of the beholder comes extra range."), new s.lm("Pincer",33.75,250,1).setSize(1.2).setPoison(25, 3).setEnemySpeedMultiplier(.75, 7.5).setDescription("Poisonous, and it slows down your enemies. A perfect double whammy."), new s.lm("Beetle Egg",157.5,35,1).setSize(1.5).setCooldown(3,3,3,3,3,3,3,3,2,2,2.8,3.6,4.4,5.2,7,).setHuddles(1).setDescription("Something might pop out of this!"), new s.lm("Antennae",99999,0,0).setExtraVision(50).setWearable(s.DQ.ANTENNAE).setDescription("These feelers give you some extra vision."), new s.lm("Peas",67.5,40,6.1).setSize([.8,.8,.8,.8,.8,.8,.8,.8,1.2,1.6,1.6,1.6,2.2,3,3.6]).setDescription("A pod of peas. They'll explode if you're not careful."), new s.lm("Stick",67.5,1000,0.1).setSize(1.2).setHuddles(1).setCooldown([12,12,12,12,25,25,25,25,25,25,25,25,25,32,48,48,48,48,0.1]).setMulti([2,2,3,3,3,3,3,3,3,3,3,3,4,4,3,3,10,13], 1).setDescription("A bundle of sticks... I wonder what'll happen if you spin them around in the desert..."), new s.lm("scorpion.projectile",1024,3,5).setMobPoison(15, 3).setMobDamage(5).setMobHealth(3).setDescription("[object null object]"), new s.lm("Dahlia",78.75,100,1).setCooldown([3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,0.1]).setHealing([10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7,1.18]).setSize([.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.7,.8]).setHuddles(1).setMulti([3,3,3,3,3,3,3,3,3,3,3,3,5], 1).setDescription("A very consistent trickle heal."), new s.lm("Primrose",25,12,4).setSize(1.3).setHuddles(1).setHealSpit(77, 125, 3).setDescription("Said to be from a mystical covenant of witches who specialized in healing nature."), new s.lm("Fire Spellbook",35,9,8).setSize(1.2).setPentagramAbility(200, 150, 2, {
                damage: 1,
                duration: 4
            }, {
                multiplier: .4,
                duration: 4
            }).setHuddles(1).setDescription("A tome of ancient spells. It's said to be able to focus the power of a fallen Demon."), new s.lm("Deity",1,50,50).setSize(1.15).setMulti(3, !0).setHealSpit(10, 1e3, 5).setConstantHeal(1e3).setExtraHealth(1e4).setEnemySpeedMultiplier(.1, 10).setDamageReduction(.2).setExtraRadians(.01).setExtraRange(1.05).setExtraVision(5).setPoison(5, 10).setSpeedMultiplier(1.05).setWingMovement(1).setLightning([5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10], 512, 128).setDescription("A petal that channels the power of all that came before."), new s.lm("Lightning",40.5,1e-100,0).setLightning([5, 5, 5, 5, 5, 6, 6, 7, 7, 8, 8, 11, 13, 15, 17, 18], 1e3, 22).setDescription("Shockingly shocking!"), new s.lm("Powder",22.5,24,16).setSize(1.65).setSpeedMultiplier([1.09,1.1,1.11,1.13,1.16,1.22,1.3,1.38,1.42,1.47,1.52,1.6,2,2.2,2.4]).setHuddles(1).setDescription("This special cocaine will make you go fast!"), new s.lm("Ant Egg",85.5,140,1).setCooldown([3.8,3.8,3.8,3.8,12.6,10.6,8.6,3.6,2.8,2.8,5.4,7,8.6,10.2,14.5]).setSize(1.1).setMulti([4,4,4,4,4,4,4,4,4,4,5,5,5,6], !1).setHuddles(1).setDescription("A petal that spawns ants. They'll help you out!"), new s.lm("Yucca",22.5,170,4.5).setSize(1.2).setConstantHeal(14, !0).setDescription("A strange leaf that heals you but only when you're in defensive mode."), new s.lm("Magnet",49.5,180,1).setSize(1.55).setMulti([1,1,1,1,1,1,1,1,1,2,2,2,3], 0).setExtraPickupRange(125).setAttractsLightning(1).setHuddles(1).setDescription("This petal's magnetic field will attract nearby items. Does not stack."), new s.lm("Amulet",0,0,0).setMulti(0, !1).setWearable(s.DQ.AMULET).setDamageReflection(.175).setDescription("What an oddity! It's said to reflect a portion of incoming conventional damage."), new s.lm("Jelly",38.25,175,8).setDensity(3).setDescription("Super bouncy! Knocks all your enemies around. Very fun to use and cause problems with."), new s.lm("Yggdrasil",1012.5,1e-10,0).setDeathDefying(.15).setHuddles(1).setPhases(1).setDescription("The tree of life. If you were to die with this petal alive, you'd be revived with a portion of your health."), new s.lm("Glass",45,1e-10,2).setPhases(1).setDescription("A shard of glass that phases through enemies."), new s.lm("Dandelion",22.5,5,10).setMulti([1,1,1,1,1,2,3,3,5,5,5,5,7,8,9,10], !1).setSize([1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3]).setLaunchable(1, 7).setHealingReduction([30,48,96,192,420,1180,3480,10200,26800,79200,272000,934000,3210000,25930800,200000000,1600000000]).setDescription("Reduces healing effects on its target (reduces heal/s by effect). It's shootable."), new s.lm("Sponge",171,50000,1).setSize(1.5).setHuddles(1).setCooldown([7.6,7.2,6.8,6.4,6,5.6,5.2,4.8,4.4,4,3.6,3.2,2.8,1.5,1.3,1.15]).setAbsorbsDamage(0, [22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 135, 247.5, 292.5, 337.5, 450, 562.5, 630]).setDescription("Absorbs 90% of incoming damage and deals it over time. Does not stack. If all sponges equipped die, all absorbed damage is instantly dealt."), new s.lm("Pearl",8100,911,220).setSize(2).setSOS(1).setPetalDamageReduction(-14.1).setCooldown(8100).setDescription("Recharges at the start of waves if equipped (excluding spawn wave). Deals 50% less damage to bosses."), new s.lm("Shell",38.25,5,5).setSize(1.5).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,3,5,6,7]).setShield(22).setHuddles(1).setDescription("Grants a shield, giving additional HP. Shield slowly decays while active."), new s.lm("Bubble",15,1,1).setSize(1.3).setCooldown([5,4,2,1.5,1,0.6,0.2,0.12,0.05,0.05,0,0.5]).setBoost([5, 6, 8, 10, 15, 20, 25, 30, 32, 35, 37, 40, 50, 60, 70].map((t => 2 * t | 0)), [.45, .4, .35, .3, .25, .2, .15, .15, .15, .12, .07, .07, .6].map((t => 2.5 * t | 0))).setDescription("Propels the flower in the opposite direction while in defense mode"), new s.lm("Air",0,0,0).setHealthDivision(0.05).setScalingExtraSize([12,24,36,48,60,72,84,96,108,120,150,180,240,300,360,400,440,480,520]).setDescription("It's just air. Inflates you but makes you lose much of your max health, relative to the inflation. Unstackable."), new s.lm("Starfish",45,11,30).setSize([2,2,2,2,2,2,2,2,2,2,2,2,2,3]).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,1,3,5], 1).setConstantHeal(12, !1, .7).setDescription("Heals the flower but only when it's under 70% health"), new s.lm("Fang",22.5,100,11).setSize([1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,3.6]).setHealBack(5.5).setDescription("All damage dealt by this petal heals the flower by the lifesteal %."), new s.lm("Goo",35,12,12).setSize(1.3).setPoison(1, 6).setEnemySpeedMultiplier(.7, 6).setLaunchable(1, 35).setDescription("This sticky goo isn't good for you..."), new s.lm("Maggot Poo",23,5,5).setSize(1.3).setDamageReflection(.05).setLaunchable(0, 75).setDescription("A steaming pile of shi- I mean, poo."), new s.lm("Lightbulb",33,10,10).setSize(1.4).setAttractsAggro(1).setHuddles(1).setLighting(1).setDescription("Mobs will be prioritize yourshiny bulbs when they aggro when in use. The priority increases with each rarity, and stacks with itself."), new s.lm("Battery",55,1e-10,0).setPhases(1).setSize(1.34).setLightning(4, 256, 5, [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7], !0).setDescription("A battery that can release electric charges when hit."), new s.lm("Dust",16,7,6).setMulti(3, !0).setLaunchable(.7, 55).setDensity(5).setDescription("A cloud of dust that can be launched at enemies."), new s.lm("Armor",0,0,0).setMulti(0, !1).setDamageReduction(100).setDescription("This petal greatly protects you, but at a cost..."), new s.lm("wasp.projectile",1024,4,4).setPoison(2, 8).setDescription("[object null object]"), new s.lm("Shrub",45,18,6).setSize(1.2).setExtraHealth(15).setPoison(3, 2).setDescription("Extra HP with a bonus: poison!"), new s.lm("projectile.grape",1e3,400,1.5).setSize([.8,.8,.8,.8,.8,.8,.8,.8,1.2,1.6,1.6,1.6,2.2,3,3.6]).setPoison(23.5, 1).setDescription("[object null object]"), new s.lm("Grapes",50,40,1.5).setSize([.8,.8,.8,.8,.8,.8,.8,.8,1.2,1.6,1.6,1.6,2.2,3,3.6]).setPoison(23.5, 1).setDescription("With an added bonus: Poison!"), new s.lm("Lantern",112.5,1,5).setHuddles(1).setDescription("This fragine lantern shines so bright...").setLighting(3), new s.lm("web.player.launched",1024,1e5,0).setSize([20,40,60,75,80,100,120,140,180,220,260,300,350,400,475]).setEnemySpeedMultiplier(.334, .05).setIgnoreWalls(1).setDescription("[object null object]"), new s.lm("Branch",78.75,8,3).setSize(1.5).setHuddles(1).setMulti(2, !1).setDescription("A fragile branch from the Wilt."), new s.lm("Leech Egg",48,5,2).setSize(1.5).setHuddles(1).setDescription("Summons leeches to help protect you!"), new s.lm("Hornet Egg",48,5,2).setSize(1.5).setMulti(2, !1).setHuddles(1).setDescription("Hey wait a minute... This isn't a Beetle Egg!"), new s.lm("Candy",22.5,1,2.5).setSize(.9).setMulti(5, !0).setDescription("Ooh, tasty!"), new s.lm("Claw",78.75,5,0).setExtraDamage([.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55,.52,.49,.46,.9], 1, 228).setDescription("Sharp against the strong, weak against the weak."), new s.lm("projectile.diep_bullet",1e3,12,2).setDescription("[object null object]"), new s.lm("Square Egg",120,50,1).setSize(1.2).setHuddles(1).setDescription("This isn't from this world..."), new s.lm("Triangle Egg",240,100,2).setSize(1.5).setHuddles(1).setDescription("This isn't from this world..."), new s.lm("Pentagon Egg",360,200,4).setSize(1.8).setHuddles(1).setDescription("This isn't from this world..."), new s.lm("Bud",22.5,150,0.01).setDrawing(new s.wDrawing().addAction("beginPath").addAction("dipPolygon", 5, 1.2, -3.5).addAction("paint", "#c02dd6", 0.2).addAction("closePath").addAction("beginPath").addAction("circle", 0, 0, 1).addAction("paint", "#ebac00", 0.25).addAction("closePath")).setCooldown([30,20,10,7.5,5.75,3.7,3.1,2.5,2.2,2,1.85,1.6,1.45,1.35,1.3,1.25,1.15]).setSize(1.2).setRevives(1).setLaunchable(0, [30,20,10,7.5,5.75,3.7,3.1,2.5,2.2,2,1.85,1.6,1.45,1.35,1.3,1.25,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15]).setHuddles(1).setDescription("Slowly grows into a flower, reviving dead teammates."), new s.lm("Fig",18,.1,40).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, .25, .95).addAction("fill", "#5e2b7b").addAction("closePath").addAction("beginPath").addAction("dipPolygon", 2, .95, -.85).addAction("fill", "#5e2b7b").addAction("closePath").addAction("beginPath").addAction("circle", 0, .25, .65).addAction("fill", "#7d3c98").addAction("closePath").addAction("beginPath").addAction("dipPolygon", 2, .65, -.85).addAction("fill", "#7d3c98").addAction("closePath")).setSize([.8,.8,.8,.8,1,1.4,1.6,1.8,2,2.4,2.6,3.2,3.8,4.4,5,5.6,6.2]).setDescription("Explodes on impact, damaging many mobs in a sweeping blast."), new s.lm("Fig.explosion",18,1e-100,40).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, 0, 1).addAction("opacity", 0.1).addAction("fill", "#7d3c98").addAction("closePath")).setSize([18,18,18,18,22,26,30,34,38,42,48,54,60,66,72,80,85,90,95]).setCollisions(0).setDescription("[Null Object Null]"), new s.lm("Amulet Of Divergence",202.5,50000,0).setDrawing(new s.wDrawing().addAction("beginPath").addAction("polygon", 3, 1, 0.5).addAction("paint", "#ffd256", 0.2)).setSize(1.2).setSwitchBiome(1).setHuddles(1).setDescription("Slowly grows into a flower, reviving dead teammates."), new s.lm("Tree",35,205,30.5).setSize(3).setDescription("[Object Null Object]").setDrawing(new s.H1().addAction("beginPath").addAction("dipPolygon", 7, 1, 3).addAction("fill", "#257831").addAction("stroke", "#1e6228", .15).addAction("beginPath").addAction("dipPolygon", 6, 0.5, 3).addAction("fill", "#258031").addAction("stroke", "#258031", .1)), new s.lm("Bloom",22.5,300,0.01).setDrawing(new s.wDrawing().addAction("beginPath").addAction("beginPath").addAction("dipPolygon", 10, 1.2, -5).addAction("paint", "#ebac00", 0.2).addAction("closePath").addAction("beginPath").addAction("circle", 0, 0, 0.8).addAction("paint", "#c02dd6", 0.15).addAction("closePath")).setCooldown([80,60,40,20,13,11.4,7.4,6.2,5,3.7,3.4,3,2.6,2.2,1.9,1.8,1.7]).setSize(2.4).setRevives(2).setLaunchable(0, [80,60,40,20,13,11.4,7.4,6.2,5,3.7,3.4,3,2.6,2.2,1.9,1.8,1.7]).setHuddles(1).setDescription("Slowly grows into a flower, reviving dead teammates."), new s.lm("Root.mob",22.5,150,0.01).setDrawing(new s.wDrawing().addAction("beginPath").addAction("line",0,-1,0,1).addAction("line",0,1,0.75,2).addAction("line",0,1,-0.75,2).addAction("line",0,-1,0.75,-2).addAction("line",0,-1,-0.75,-2).addAction("line",1,0,-1,0).addAction("line",1,0,2,0.75).addAction("line",1,0,2,-0.75).addAction("line",-1,0,-2,0.75).addAction("line",-1,0,-2,-0.75).addAction("stroke","#5c3617",0.25).addAction("closePath").addAction("beginPath").addAction("circle",0,0,0.25).addAction("fill","#8b5529").addAction("stroke","#5c3617",0.1).addAction("closePath")).setDescription("[Object Null Object]"), new s.lm("Coconut",36,7000,.2).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, 0, 1).addAction("fill", "#8b5a2b").addAction("stroke", "#5c3b1a", .15).addAction("beginPath").addAction("circle", 0, -0.25, .15).addAction("fill", "#3b2412").addAction("beginPath").addAction("circle", 0.25, 0.25, .15).addAction("fill", "#3b2412").addAction("beginPath").addAction("circle", -0.25, 0.25, .15).addAction("fill", "#3b2412")).setSize([1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,2,2,2,2,2.5,4,6,8]).setFinalHit(600).setDescription("Deals massive damage on its final hit only. 50% less effective on bosses."), new s.lm("Husk",22.5,60,6).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, 0, 1).addAction("stroke", "#000000", .175)).setSize([1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1,1,1,1,2.4,3,3.6]).setDamageReduction(3).setExtraHealth(35).setDescription("A husk of what was once a strong insect. Equipping gives you body armor for mob body damage (non-stackable) and max health."), new s.lm("Cinderleaf",1.5,1e9,0).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, -.25, .85).addAction("fill", "#cc7b3d").addAction("closePath").addAction("beginPath").addAction("dipPolygon", 2, .85, -.85).addAction("fill", "#cc7b3d").addAction("closePath").addAction("beginPath").addAction("line", 0, 0, 0, -1.5).addAction("stroke", "#cc7b3d", .25).addAction("closePath").addAction("beginPath").addAction("circle", 0, -.25, .65).addAction("fill", "#fc9547").addAction("closePath").addAction("beginPath").addAction("dipPolygon", 2, .65, -.85).addAction("fill", "#fc9547").addAction("closePath").addAction("beginPath").addAction("line", 0, -.5, 0, .5).addAction("stroke", "#cc7b3d", .25).addAction("closePath")).setEOC(1).setSize([1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,2,2,2,2,2.5,4,6,8]).setDescription("Explodes when the flower touches an enemy."), new s.lm("Cinder.explosion",18,1e-100,15).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, 0, 1).addAction("opacity", 0.1).addAction("fill", "#fc9547").addAction("closePath")).setSize([18,18,18,18,22,26,30,34,38,42,48,54,60,66,72,80,85,90,95]).setCollisions(0).setDescription("[Null Object Null]"), new s.lm("Root",22.5,60,6).setDrawing(new s.wDrawing().addAction("beginPath").addAction("line", -.065, 0.26, -0.2, -0.1).addAction("stroke", "#b96c32", .8).addAction("closePath").addAction("beginPath").addAction("line", -0.2, -0.1, 0.28, -0.9).addAction("stroke", "#b96c32", .55).addAction("closePath").addAction("beginPath").addAction("line", 0.28, -0.9, -0.1, -1.2).addAction("stroke", "#b96c32", .25).addAction("closePath").addAction("beginPath").addAction("line", -0.4, 0.8, -0.6, -0.4).addAction("line", -0.6, -0.4, 0, -0.9).addAction("line", 0, -0.9, -0.2, -1.55).addAction("line", -0.4, 0.8, 0, 0.6).addAction("line", 0, 0.6, 0.4, 0.75).addAction("line", 0.4, 0.75, 0.1, -0.2).addAction("line", 0.1, -0.2, 0.5, -1).addAction("line", 0.5, -1, -0.2, -1.55).addAction("stroke", "#965728", .2).addAction("closePath")).setSize([1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1,1,1,1,2.4,3,3.6]).setDamageReduction(5).setSpeedMultiplier(0.5).setDamageReductionPercent([.2,.22,.24,.26,.3,.32,.34,.36,.38,.4,.42,.44,.46,.48,.50,.52]).setDescription("Grants you the deep roots of a Mangrove tree. You can't move yourself, and your damage (apart from any damage from your summons) is 50% less, but you gain resistance. Armor percent is applied after all other reductions."), new s.lm("Emerald",1,500,0).setDrawing(new s.wDrawing().addAction("beginPath").addAction("polygon", 5, 1, 0).addAction("fill", "#12e727").addAction("stroke", "#08c912", .2)).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,2.5,3,3.5]).setCooldown([10,10,10,10,10,10,10,10,10,10,10,10,6,5,5,5,5,1,.1]).setEmeraldAbility(1).setDescription("A mythical gem infused with the power of genesis."), new s.lm("Blood Stinger",56.25,5,325).setDrawing(new s.wDrawing().addAction("beginPath").addAction("polygon", 3, 1, 0).addAction("fill", "#9c1010").addAction("stroke", "#7e0d0d", .2)).setDamage([325,325,325,325,325,108.2474226804124,64.78260869565217]).setMulti([1, 1, 1, 1, 1, 3, 5, 5, 5, 5, 5, 5, 5, 6, 7], 1).setSize([.7, .7, .7, .7, .7, .7, .9, .9, 1.5, 1.5, 1.5, 1.9, 3.8, 3.8, 4.8]).setSelfDamage(15).setDescription("This stinger demands a sacrifice... Each hit deals damage back to the flower."), new s.lm("Blood Corn",202.5,30000,9).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -.75, -.625).addAction("lineTo", -.75, -.625).addAction("lineTo", -0.375, -0.85).addAction("lineTo", 0, -0.875).addAction("lineTo", 0.375, -0.85).addAction("lineTo", 0.75, -.625).addAction("lineTo", 0.8125, 0).addAction("lineTo", 0.625, 0.375).addAction("lineTo", 0.4, 0.75).addAction("lineTo", 0.26667, 0.5).addAction("lineTo", 0, 0.375).addAction("lineTo", -0.26667, 0.5).addAction("lineTo", -.4, 0.75).addAction("lineTo", -0.625, 0.375).addAction("lineTo", -.8125, 0).addAction("lineTo", -.75, -.625).addAction("closePath").addAction("fill", "#ff0000").addAction("stroke", "#cf0000", 0.3).addAction("closePath")).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.7,1.7,1.7,3.9,6.6,8.8]).setSelfDamage(0.55).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3], 0).setDescription("This corn grows darker by the second. For every second this corn lives, it deals 2% more damage but 4% more self-damage. Caps at 1 minute."), new s.lm("Blood Light",13.5,1,54).setDrawing(new s.wDrawing().addAction("beginPath").addAction("circle", 0, 0, 1).addAction("fill", "#ff1919").addAction("stroke", "#7e0d0d", .2)).setSelfDamage(3.6).setDamage([54,27,27,18,18,10.8,10.8,10.8,10.8,10.8,10.8,10.8,8.485465301189492]).setMulti([1, 2, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 7, 9, 11], 0).setSize([.6,.6,.6,.6,.8,.8,.8,1.2,1.5,1.5,1.5,1.5,2,2.2,2.5]).setDescription("This light demands a sacrifice... Each hit deals damage back to the flower."), new s.lm("Ruby",22.5,10,10).setDrawing(new s.wDrawing().addAction("beginPath").addAction("polygon", 3, 0.65, 0).addAction("fill", "#e03f3f").addAction("stroke", "#a12222", .2).addAction("closePath").addAction("beginPath").addAction("polygon", 3, 0.2, 0).addAction("fill", "#ea7e7e")).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,2,3]).setRubyAbility(1).setDescription("A mythical gem infused with the power of friendship."), new s.lm("Fire Missile",21.375,90,20).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -0.75, 0.5).addAction("lineTo", -0.75, -0.5).addAction("lineTo", 0.75, 0).addAction("lineTo", -0.75, 0.5).addAction("fill", "#882200").addAction("stroke", "#882200", .25)).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.7,2.4,3.2,3.2,3.2,4,8,10]).setLaunchable(2, 7).setPoison(18, 1.222).setDescription("Return it to the queen before it's too late. It's got her poison all over it."), new s.lm("fire.projectile",21.375,90,20).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -0.75, 0.5).addAction("lineTo", -0.75, -0.5).addAction("lineTo", 0.75, 0).addAction("lineTo", -0.75, 0.5).addAction("fill", "#882200").addAction("stroke", "#882200", .25)).setLaunchable(2, 7).setMobPoison(15, 2).setMobHealth(4).setMobDamage(15).setDescription("[Null Object Null]"), new s.lm("Sandstone",1,1,1).setSize(5).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -0.24, 1).addAction("lineTo", 0.4, 1.2).addAction("lineTo", 0.6, 0.6).addAction("lineTo", 0.7, 0.1).addAction("lineTo", 0.3, -0.2).addAction("lineTo", -0.4, -0.6).addAction("lineTo", -0.8, 0).addAction("lineTo", -0.4, 0.6).addAction("lineTo", -0.24, 1).addAction("fill", "#dfc85c").addAction("stroke", "#d6ba36", .25)).setDescription("[Null Object Null]"), new s.lm("missile.projectile",21.375,90,20).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -0.75, 0.5).addAction("lineTo", -0.75, -0.5).addAction("lineTo", 0.75, 0).addAction("lineTo", -0.75, 0.5).addAction("fill", "#333333").addAction("stroke", "#333333", .25)).setLaunchable(2, 7).setMobHealth(4).setMobDamage(14).setDescription("[Null Object Null]"), new s.lm("Moonlit Frog",35,205,30.5).setDescription("[Object Null Object]").setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo",-.50,.75).addAction("lineTo",.23,1.09).addAction("moveTo",.23,1.09).addAction("lineTo",.36,1.26).addAction("moveTo",.23,1.09).addAction("lineTo",.45,1.08).addAction("stroke","#3d178e",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",-.50,-.75).addAction("lineTo",.23,-1.09).addAction("moveTo",.23,-1.09).addAction("lineTo",.45,-1.08).addAction("moveTo",.23,-1.09).addAction("lineTo",.36,-1.26).addAction("stroke","#3d178e",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,.30).addAction("lineTo",1.16,.51).addAction("moveTo",1.16,.51).addAction("lineTo",1.28,.63).addAction("moveTo",1.16,.51).addAction("lineTo",1.33,.49).addAction("stroke","#3d178e",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,-.30).addAction("lineTo",1.16,-.51).addAction("moveTo",1.16,-.51).addAction("lineTo",1.33,-.49).addAction("moveTo",1.16,-.51).addAction("lineTo",1.28,-.63).addAction("stroke","#3d178e",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.13,.97).addAction("lineTo",.01,1.10).addAction("lineTo",-.20,1.16).addAction("lineTo",-.47,1.15).addAction("lineTo",-.74,1.06).addAction("lineTo",-.99,.91).addAction("lineTo",-1.17,.71).addAction("lineTo",-1.25,.51).addAction("lineTo",-1.23,.33).addAction("lineTo",-1.11,.20).addAction("lineTo",-.90,.14).addAction("lineTo",-.63,.15).addAction("lineTo",-.36,.24).addAction("lineTo",-.11,.39).addAction("lineTo",.07,.59).addAction("lineTo",.15,.79).addAction("closePath").addAction("fill","#4a1cad").addAction("stroke","#3d178e",.12).addAction("beginPath").addAction("moveTo",.13,-.97).addAction("lineTo",.15,-.79).addAction("lineTo",.07,-.59).addAction("lineTo",-.11,-.39).addAction("lineTo",-.36,-.24).addAction("lineTo",-.63,-.15).addAction("lineTo",-.90,-.14).addAction("lineTo",-1.11,-.20).addAction("lineTo",-1.23,-.33).addAction("lineTo",-1.25,-.51).addAction("lineTo",-1.17,-.71).addAction("lineTo",-.99,-.91).addAction("lineTo",-.74,-1.06).addAction("lineTo",-.47,-1.15).addAction("lineTo",-.20,-1.16).addAction("lineTo",.01,-1.10).addAction("closePath").addAction("fill","#4a1cad").addAction("stroke","#3d178e",.12).addAction("beginPath").addAction("moveTo",1.10,.00).addAction("lineTo",1.02,.34).addAction("lineTo",.78,.64).addAction("lineTo",.42,.83).addAction("lineTo",.00,.90).addAction("lineTo",-.42,.83).addAction("lineTo",-.78,.64).addAction("lineTo",-1.02,.34).addAction("lineTo",-1.10,.00).addAction("lineTo",-1.02,-.34).addAction("lineTo",-.78,-.64).addAction("lineTo",-.42,-.83).addAction("lineTo",-.00,-.90).addAction("lineTo",.42,-.83).addAction("lineTo",.78,-.64).addAction("lineTo",1.02,-.34).addAction("closePath").addAction("fill","#4a1cad").addAction("stroke","#3d178e",.15).addAction("beginPath").addAction("moveTo",.57,.00).addAction("lineTo",.52,.17).addAction("lineTo",.38,.32).addAction("lineTo",.17,.42).addAction("lineTo",-.08,.45).addAction("lineTo",-.33,.42).addAction("lineTo",-.54,.32).addAction("lineTo",-.68,.17).addAction("lineTo",-.73,.00).addAction("lineTo",-.68,-.17).addAction("lineTo",-.54,-.32).addAction("lineTo",-.33,-.42).addAction("lineTo",-.08,-.45).addAction("lineTo",.17,-.42).addAction("lineTo",.38,-.32).addAction("lineTo",.52,-.17).addAction("closePath").addAction("fill","#6b45bc").addAction("stroke","#6b45bc",.15).addAction("beginPath").addAction("circle",.55,.50,.20).addAction("fill","#000000").addAction("beginPath").addAction("circle",.55,-.50,.20).addAction("fill","#000000")), new s.lm("Sunlit Frog",35,205,30.5).setDescription("[Object Null Object]").setDrawing(new s.H1().addAction("beginPath").addAction("moveTo",-.50,.75).addAction("lineTo",.23,1.09).addAction("moveTo",.23,1.09).addAction("lineTo",.36,1.26).addAction("moveTo",.23,1.09).addAction("lineTo",.45,1.08).addAction("stroke","#ada259",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",-.50,-.75).addAction("lineTo",.23,-1.09).addAction("moveTo",.23,-1.09).addAction("lineTo",.45,-1.08).addAction("moveTo",.23,-1.09).addAction("lineTo",.36,-1.26).addAction("stroke","#ada259",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,.30).addAction("lineTo",1.16,.51).addAction("moveTo",1.16,.51).addAction("lineTo",1.28,.63).addAction("moveTo",1.16,.51).addAction("lineTo",1.33,.49).addAction("stroke","#ada259",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,-.30).addAction("lineTo",1.16,-.51).addAction("moveTo",1.16,-.51).addAction("lineTo",1.33,-.49).addAction("moveTo",1.16,-.51).addAction("lineTo",1.28,-.63).addAction("stroke","#ada259",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.13,.97).addAction("lineTo",.01,1.10).addAction("lineTo",-.20,1.16).addAction("lineTo",-.47,1.15).addAction("lineTo",-.74,1.06).addAction("lineTo",-.99,.91).addAction("lineTo",-1.17,.71).addAction("lineTo",-1.25,.51).addAction("lineTo",-1.23,.33).addAction("lineTo",-1.11,.20).addAction("lineTo",-.90,.14).addAction("lineTo",-.63,.15).addAction("lineTo",-.36,.24).addAction("lineTo",-.11,.39).addAction("lineTo",.07,.59).addAction("lineTo",.15,.79).addAction("closePath").addAction("fill","#d3c66d").addAction("stroke","#ada259",.12).addAction("beginPath").addAction("moveTo",.13,-.97).addAction("lineTo",.15,-.79).addAction("lineTo",.07,-.59).addAction("lineTo",-.11,-.39).addAction("lineTo",-.36,-.24).addAction("lineTo",-.63,-.15).addAction("lineTo",-.90,-.14).addAction("lineTo",-1.11,-.20).addAction("lineTo",-1.23,-.33).addAction("lineTo",-1.25,-.51).addAction("lineTo",-1.17,-.71).addAction("lineTo",-.99,-.91).addAction("lineTo",-.74,-1.06).addAction("lineTo",-.47,-1.15).addAction("lineTo",-.20,-1.16).addAction("lineTo",.01,-1.10).addAction("closePath").addAction("fill","#d3c66d").addAction("stroke","#ada259",.12).addAction("beginPath").addAction("moveTo",1.10,.00).addAction("lineTo",1.02,.34).addAction("lineTo",.78,.64).addAction("lineTo",.42,.83).addAction("lineTo",.00,.90).addAction("lineTo",-.42,.83).addAction("lineTo",-.78,.64).addAction("lineTo",-1.02,.34).addAction("lineTo",-1.10,.00).addAction("lineTo",-1.02,-.34).addAction("lineTo",-.78,-.64).addAction("lineTo",-.42,-.83).addAction("lineTo",-.00,-.90).addAction("lineTo",.42,-.83).addAction("lineTo",.78,-.64).addAction("lineTo",1.02,-.34).addAction("closePath").addAction("fill","#d3c66d").addAction("stroke","#ada259",.15).addAction("beginPath").addAction("moveTo",.57,.00).addAction("lineTo",.52,.17).addAction("lineTo",.38,.32).addAction("lineTo",.17,.42).addAction("lineTo",-.08,.45).addAction("lineTo",-.33,.42).addAction("lineTo",-.54,.32).addAction("lineTo",-.68,.17).addAction("lineTo",-.73,.00).addAction("lineTo",-.68,-.17).addAction("lineTo",-.54,-.32).addAction("lineTo",-.33,-.42).addAction("lineTo",-.08,-.45).addAction("lineTo",.17,-.42).addAction("lineTo",.38,-.32).addAction("lineTo",.52,-.17).addAction("closePath").addAction("fill","#dbd087").addAction("stroke","#dbd087",.15).addAction("beginPath").addAction("circle",.55,.50,.20).addAction("fill","#000000").addAction("beginPath").addAction("circle",.55,-.50,.20).addAction("fill","#000000")), new s.lm("Ruby Frog",35,205,30.5).setDescription("[Object Null Object]").setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo",-.50,.75).addAction("lineTo",.23,1.09).addAction("moveTo",.23,1.09).addAction("lineTo",.36,1.26).addAction("moveTo",.23,1.09).addAction("lineTo",.45,1.08).addAction("stroke","#af2e2e",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",-.50,-.75).addAction("lineTo",.23,-1.09).addAction("moveTo",.23,-1.09).addAction("lineTo",.45,-1.08).addAction("moveTo",.23,-1.09).addAction("lineTo",.36,-1.26).addAction("stroke","#af2e2e",.12).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,.30).addAction("lineTo",1.16,.51).addAction("moveTo",1.16,.51).addAction("lineTo",1.28,.63).addAction("moveTo",1.16,.51).addAction("lineTo",1.33,.49).addAction("stroke","#af2e2e",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.60,-.30).addAction("lineTo",1.16,-.51).addAction("moveTo",1.16,-.51).addAction("lineTo",1.33,-.49).addAction("moveTo",1.16,-.51).addAction("lineTo",1.28,-.63).addAction("stroke","#af2e2e",.11).addAction("closePath").addAction("beginPath").addAction("moveTo",.13,.97).addAction("lineTo",.01,1.10).addAction("lineTo",-.20,1.16).addAction("lineTo",-.47,1.15).addAction("lineTo",-.74,1.06).addAction("lineTo",-.99,.91).addAction("lineTo",-1.17,.71).addAction("lineTo",-1.25,.51).addAction("lineTo",-1.23,.33).addAction("lineTo",-1.11,.20).addAction("lineTo",-.90,.14).addAction("lineTo",-.63,.15).addAction("lineTo",-.36,.24).addAction("lineTo",-.11,.39).addAction("lineTo",.07,.59).addAction("lineTo",.15,.79).addAction("closePath").addAction("fill","#d63838").addAction("stroke","#af2e2e",.12).addAction("beginPath").addAction("moveTo",.13,-.97).addAction("lineTo",.15,-.79).addAction("lineTo",.07,-.59).addAction("lineTo",-.11,-.39).addAction("lineTo",-.36,-.24).addAction("lineTo",-.63,-.15).addAction("lineTo",-.90,-.14).addAction("lineTo",-1.11,-.20).addAction("lineTo",-1.23,-.33).addAction("lineTo",-1.25,-.51).addAction("lineTo",-1.17,-.71).addAction("lineTo",-.99,-.91).addAction("lineTo",-.74,-1.06).addAction("lineTo",-.47,-1.15).addAction("lineTo",-.20,-1.16).addAction("lineTo",.01,-1.10).addAction("closePath").addAction("fill","#d63838").addAction("stroke","#af2e2e",.12).addAction("beginPath").addAction("moveTo",1.10,.00).addAction("lineTo",1.02,.34).addAction("lineTo",.78,.64).addAction("lineTo",.42,.83).addAction("lineTo",.00,.90).addAction("lineTo",-.42,.83).addAction("lineTo",-.78,.64).addAction("lineTo",-1.02,.34).addAction("lineTo",-1.10,.00).addAction("lineTo",-1.02,-.34).addAction("lineTo",-.78,-.64).addAction("lineTo",-.42,-.83).addAction("lineTo",-.00,-.90).addAction("lineTo",.42,-.83).addAction("lineTo",.78,-.64).addAction("lineTo",1.02,-.34).addAction("closePath").addAction("fill","#d63838").addAction("stroke","#af2e2e",.15).addAction("beginPath").addAction("moveTo",.57,.00).addAction("lineTo",.52,.17).addAction("lineTo",.38,.32).addAction("lineTo",.17,.42).addAction("lineTo",-.08,.45).addAction("lineTo",-.33,.42).addAction("lineTo",-.54,.32).addAction("lineTo",-.68,.17).addAction("lineTo",-.73,.00).addAction("lineTo",-.68,-.17).addAction("lineTo",-.54,-.32).addAction("lineTo",-.33,-.42).addAction("lineTo",-.08,-.45).addAction("lineTo",.17,-.42).addAction("lineTo",.38,-.32).addAction("lineTo",.52,-.17).addAction("closePath").addAction("fill","#dd5c5c").addAction("stroke","#dd5c5c",.15).addAction("beginPath").addAction("circle",.55,.50,.20).addAction("fill","#000000").addAction("beginPath").addAction("circle",.55,-.50,.20).addAction("fill","#000000")), new s.lm("Moth",35,205,30.5).setSize(3).setDescription("[Object Null Object]").setDrawing(new s.H1().addAction("beginPath").addAction("circle",0,0,1).addAction("fill","#a7952f").addAction("beginPath").addAction("circle",0,0,0.75).addAction("fill","#ccb639").addAction("beginPath").addAction("arc",0.9,-1.3,1,0.7,1.7).addAction("stroke","#000000",0.1).addAction("beginPath").addAction("arc",0.9,1.3,1,-1.7,-0.7).addAction("stroke","#000000",0.1).addAction("beginPath").addAction("circle",1.7,-0.7,0.15).addAction("fill","#000000").addAction("beginPath").addAction("circle",1.7,0.7,0.15).addAction("fill","#000000").addAction("beginPath").addAction("moveTo",.15,.08).addAction("lineTo",.18,.18).addAction("lineTo",.18,.30).addAction("lineTo",.13,.44).addAction("lineTo",.05,.58).addAction("lineTo",-.07,.73).addAction("lineTo",-.21,.87).addAction("lineTo",-.39,1.00).addAction("lineTo",-.57,1.13).addAction("lineTo",-.77,1.23).addAction("lineTo",-.98,1.31).addAction("lineTo",-1.17,1.37).addAction("lineTo",-1.36,1.39).addAction("lineTo",-1.53,1.39).addAction("lineTo",-1.66,1.36).addAction("lineTo",-1.77,1.31).addAction("lineTo",-1.85,1.22).addAction("lineTo",-1.88,1.12).addAction("lineTo",-1.88,1.00).addAction("lineTo",-1.83,.86).addAction("lineTo",-1.75,.72).addAction("lineTo",-1.63,.57).addAction("lineTo",-1.49,.43).addAction("lineTo",-1.31,.30).addAction("lineTo",-1.13,.17).addAction("lineTo",-.93,.07).addAction("lineTo",-.72,-.01).addAction("lineTo",-.53,-.07).addAction("lineTo",-.34,-.09).addAction("lineTo",-.17,-.09).addAction("lineTo",-.04,-.06).addAction("lineTo",.07,-.01).addAction("closePath").addAction("opacity","0.3").addAction("fill","#ffffff").addAction("stroke","#ffffff",.01).addAction("beginPath").addAction("moveTo",.15,-.08).addAction("lineTo",.07,.01).addAction("lineTo",-.04,.06).addAction("lineTo",-.17,.09).addAction("lineTo",-.34,.09).addAction("lineTo",-.53,.07).addAction("lineTo",-.72,.01).addAction("lineTo",-.93,-.07).addAction("lineTo",-1.12,-.17).addAction("lineTo",-1.31,-.30).addAction("lineTo",-1.49,-.43).addAction("lineTo",-1.63,-.57).addAction("lineTo",-1.75,-.72).addAction("lineTo",-1.83,-.86).addAction("lineTo",-1.88,-1.00).addAction("lineTo",-1.88,-1.12).addAction("lineTo",-1.85,-1.22).addAction("lineTo",-1.77,-1.31).addAction("lineTo",-1.66,-1.36).addAction("lineTo",-1.53,-1.39).addAction("lineTo",-1.36,-1.39).addAction("lineTo",-1.17,-1.37).addAction("lineTo",-.98,-1.31).addAction("lineTo",-.77,-1.23).addAction("lineTo",-.58,-1.13).addAction("lineTo",-.39,-1.00).addAction("lineTo",-.21,-.87).addAction("lineTo",-.07,-.73).addAction("lineTo",.05,-.58).addAction("lineTo",.13,-.44).addAction("lineTo",.18,-.30).addAction("lineTo",.18,-.18).addAction("closePath").addAction("opacity","0.3").addAction("fill","#ffffff").addAction("stroke","#ffffff",.01)), new s.lm("Mandible",27,0.1,21).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo", -0.82, -1.03).addAction("lineTo", -0.55, -0.90).addAction("lineTo", -0.20, -0.75).addAction("lineTo", 0.15, -0.45).addAction("lineTo", 0.38, -0.10).addAction("lineTo", 0.55, 0.25).addAction("lineTo", 0.60, 0.65).addAction("lineTo", 0.40, 0.90).addAction("lineTo", 0.00, 1.00).addAction("lineTo", -0.10, 0.70).addAction("lineTo", 0.10, 0.35).addAction("lineTo", -0.25, 0.05).addAction("lineTo", -0.45, 0.05).addAction("lineTo", -0.10, -0.25).addAction("lineTo", -0.40, -0.40).addAction("lineTo", -0.65, -0.35).addAction("lineTo", -0.82, -1.03).addAction("closePath").addAction("fill", "#8f0d07").addAction("stroke", "#780a06", 0.15)).setOddsDamage(420).setSize([1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.8,3.6,6.4,7.6]).setDescription("Has a 10% chance of doing 20x damage."), new s.lm("Shiny Wing",33.75,25,50).setDrawing(new s.wDrawing().addAction("beginPath").addAction("moveTo",-.80,.07).addAction("lineTo",-.80,-.11).addAction("lineTo",-.77,-.28).addAction("lineTo",-.71,-.44).addAction("lineTo",-.62,-.58).addAction("lineTo",-.51,-.71).addAction("lineTo",-.38,-.80).addAction("lineTo",-.23,-.87).addAction("lineTo",-.08,-.90).addAction("lineTo",.08,-.89).addAction("lineTo",.23,-.86).addAction("lineTo",.38,-.78).addAction("lineTo",.51,-.68).addAction("lineTo",.62,-.56).addAction("lineTo",.71,-.41).addAction("lineTo",.77,-.24).addAction("lineTo",.80,-.07).addAction("lineTo",.78,-.13).addAction("lineTo",.73,-.19).addAction("lineTo",.65,-.23).addAction("lineTo",.54,-.27).addAction("lineTo",.42,-.30).addAction("lineTo",.28,-.32).addAction("lineTo",.13,-.32).addAction("lineTo",-.03,-.31).addAction("lineTo",-.18,-.29).addAction("lineTo",-.33,-.26).addAction("lineTo",-.47,-.22).addAction("lineTo",-.58,-.17).addAction("lineTo",-.68,-.12).addAction("lineTo",-.75,-.05).addAction("lineTo",-.79,.01).addAction("closePath").addAction("fill","#fff5a0").addAction("stroke","#eee290",.15)).setMulti([1,1,1,1,1,1,1,1,1,1,1,1,2,2,4,5], 0).setSize(1.4,1.4,1.4,1.4,1.4,1.4,1.4,2.8,2.8,2.8,2.8,2.8,4,5.5).setWingMovement(!0).setDescription("The faster it goes, the more damage it does!")]
              , h = t => n.findIndex((e => e.name === t));
            n[h("Web")].setShootOut(h("web.player.launched")),
            n[h("Peas")].setSplits(h("projectile.pea"), 4),
            n[h("Fig")].setExplodes({index: h("Fig.explosion")}),
            n[h("Cinderleaf")].setExplodes({index: h("Cinder.explosion")}),
            n[h("Grapes")].setSplits(h("projectile.grape"), 4);
            const r = [new s.XE("Ladybug",25,10,20,2.5).setNeutral(1).addDrop(h("Light"), [0.215,0.7,1], 0).addDrop(h("Rose"), [0.215,0.7,1], 0).addDrop(h("Cinderleaf"), [0.0339,0.1564,0.7048,0.9976,1], 0), new s.XE("Rock",30,10,22,0).addDrop(h("Rock"), [0.215,0.7,1], 0).addDrop(h("Heavy"), [0.0424,0.193,0.7835,0.9988,1], 0).addDrop(h("Emerald"), 1, 11, 15), new s.XE("Bee",15,50,18,4).setNeutral(1).setMoveInSines(1).addDrop(h("Stinger"), [0.215,0.7,1], 0).addDrop(h("Pollen"), [0,0.023,0.1525,0.8258,1], 1).addDrop(h("Honey"), [0,0,0.0269,0.2496,0.8374,1], 2), new s.XE("Spider",30,25,12,4).setAggressive(1).addDrop(h("Faster"), [0.215,0.7], 0).addDrop(h("Web"), [0,0,0.066,0.5118,0.9891,1], 2).addDrop(h("Third Eye"), [0,0,0,0,0.0013,0.0258,0.225,0.859,1], 4), new s.XE("Beetle",30,30,24,4).setAggressive(1).addDrop(h("Bone"), [0.215, 0.7,1], 0).addDrop(h("Beetle Egg"), [0.128, 0.4939, 0.9921,1], 0), new s.XE("Leafbug",35,2,22,2.5).setAggressive(1).setDamageReduction(.13).addDrop(h("Leaf")).addDrop(h("Bone"), .5).addDrop(h("Cactus"), .25), new s.XE("Roach",18,3,20,5.5).setNeutral(1).addDrop(h("Antennae")).addDrop(h("Magnolia"), .6).addDrop(h("Bone"), .6), new s.XE("Hornet",30,50,25,2.5).setAggressive(1).setProjectile({
                petalIndex: h("missile.projectile"),
                cooldown: 45,
                health: 4,
                damage: 5,
                speed: 3.75,
                range: 55,
                aimbot: !0
            }).addDrop(h("Missile"), [0,0,0.066,0.5118,0.9891,1], 2).addDrop(h("Antennae"), [0,0,0.066,0.5118,0.9891,1], 2).addDrop(h("Orange"), [0.215,0.7,1], 0).addDrop(h("Husk"), [0,0,0,0,0,0,0,0.0053,0.5375,1], 7, 8), new s.XE("Mantis",44,2,26,2).setAggressive(1).setProjectile({
                petalIndex: h("projectile.pea"),
                cooldown: 80,
                health: 1.25,
                damage: 1.5,
                speed: 4.5,
                range: 55,
                size: .2,
                multiShot: {
                    count: 3,
                    delay: 256
                }
            }).addDrop(h("Peas")).addDrop(h("Dahlia"), .5).addDrop(h("Antennae"), .5), new s.XE("Pupa",80,1,18,1).setAggressive(1).setProjectile({
                petalIndex: n.findIndex((t => "Rock" === t.name)),
                cooldown: 55,
                health: .8,
                damage: 1.1,
                speed: 4,
                range: 45,
                size: .3,
                multiShot: {
                    count: 5,
                    delay: 10,
                    spread: .2
                }
            }).addDrop(h("Rock")).addDrop(h("Wing")).addDrop(h("Heavy"), .5), new s.XE("Sandstorm",39,40,25,6).setAggressive(0).addDrop(h("Sand"), [0.215, 0.7,1], 0).addDrop(h("Stick"), [0,0,0,0.0058, 0.0336, 0.5481, 0.9988,1], 4), new s.XE("Scorpion",40,10,27,3.5).setPoison(20, 4).setAggressive(1).setProjectile({
                petalIndex: n.findIndex((t => "scorpion.projectile" === t.name)),
                cooldown: 65,
                health: 3,
                damage: 5,
                speed: 5,
                range: 120,
                runs: !0,
                size: .2,
                aimbot: !0
            }).addDrop(h("Pincer"), [0.215, 0.7,1], 0).addDrop(h("Iris"), [0.215, 0.7,1], 0).addDrop(h("Missile"), [0.128, 0.4939, 0.9921,1], 0), new s.XE("Demon",225,1,35,1).setAggressive(1).setPushability(.8).setProjectile({
                petalIndex: n.findIndex((t => "Missile" === t.name)),
                cooldown: 65,
                health: 3,
                damage: 5,
                speed: 10,
                range: 120,
                size: .1334,
            }).addDrop(h("Bone")).addDrop(h("Lightning"), .2).addDrop(h("Fire Spellbook"), .03), new s.XE("Jellyfish",36,10,22,2.5).setAggressive(1).setLightning([75], [4], 125, 15).addDrop(h("Lightning")).addDrop(h("Jelly")), new s.XE("Cactus",30,35,24,0).setPushability(.5).addDrop(h("Cactus"), [0.215, 0.7,1], 0).addDrop(h("Stinger"), [0.0084,0.0412,0.2596,0.9572,1], 0).addDrop(h("Cinderleaf"), [0.0084,0.0412,0.2596,0.9572,1], 0), new s.XE("Baby Ant",10,10,7,2).addDrop(h("Light"), [0.128,0.4939,0.9921,1], 0).addDrop(h("Leaf"), [0.128,0.4939,0.9921,1], 0).addDrop(h("Rice"), [0,0,0.066,0.5118,0.9891,1], 2), new s.XE("Worker Ant",15,10,9,3.25).setNeutral(1).addDrop(h("Light"), [0.0851,0.3566,0.9569,1], 0).addDrop(h("Leaf"), [0.215,0.7,1]), new s.XE("Soldier Ant",25,10,11,3.5).setAggressive(1).addDrop(h("Corn"), [0.0424,0.193,0.7835,0.9988,1], 0).addDrop(h("Wing"), [0.215,0.7,1], 0).addDrop(h("Husk"), [0,0,0,0,0,0,0,0.0018,0.227,0.899,1], 7, 8), new s.XE("Queen Ant",100,10,25,3.5).setAggressive(1).setPushability(.8).addDrop(h("Wing"), [0.443,0.944,1], 0).addDrop(h("Ant Egg"), [0.443,0.944,1], 0), new s.XE("Ant Hole",100,10,30,0).setPushability(0).addDrop(h("Dirt"), [0.215,0.7,1], 0).addDrop(h("Heavy"), [0.69, 1], 0).addDrop(h("Ant Egg")), new s.XE("Baby Fire Ant",6,1,5,3).setPoison(24, 3).addDrop(h("Blood Light"), [0.129,0.4939,0.9921,1], 0), new s.XE("Worker Fire Ant",12,3,7,4).setPoison(7,3).setNeutral(1).addDrop(h("Yucca"), [0.215,0.7,1], 0).addDrop(h("Blood Corn"), [0.129,0.4939,0.9921,1], 0).addDrop(h("Blood Stinger"), [0.215,0.7,1], 0), new s.XE("Soldier Fire Ant",16,4,9,4).setPoison(7,3).setAggressive(1).addDrop(h("Yucca"), [0.215,0.7,1], 0).addDrop(h("Wing"), [0.851,0.767,0.9569,1], 0).addDrop(h("Bone"), [0.0424,0.193,0.7835,0.9988,1], 0), new s.XE("Queen Fire Ant",100,40,25,4).setPoison(10,20).setAggressive(1).setPushability(.8).setProjectile({
                petalIndex: h("fire.projectile"),
                cooldown: 45,
                health: 4,
                damage: 15,
                speed: 4.75,
                runs: !0,
                range: 55,
                aimbot: !0
            }).addDrop(h("Ant Egg")).addDrop(h("Wing")).addDrop(h("Fire Missile")), new s.XE("Fire Ant Hole",300000,15,7.5,0).setPushability(0).setDestruct(1).addDrop(h("Ant Egg"), [0.443,0.944,1], 0).addDrop(h("Magnet")), new s.XE("Baby Termite",6,.3,10,2).setDamageReduction(.1).setDamageReflection(.15).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Worker Termite",12,1,12,3).setNeutral(1).setDamageReduction(.1).setDamageReflection(.15).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Soldier Termite",16,2,14,3).setAggressive(1).setDamageReduction(.1).setDamageReflection(.15).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Termite Overmind",125,2,45,.5).setAggressive(1).setPushability(.5).setDamageReduction(.1).setDamageReflection(.15).addDrop(h("Ant Egg"), .5).addDrop(h("Amulet"), .4).addDrop(h("Primrose"), .7), new s.XE("Termite Mound",350,1,60,0).setDamageReduction(.1).setDamageReflection(.15).setPushability(0).addDrop(h("Dirt")).addDrop(h("Armor"), .75).addDrop(h("Magnet"), .5), new s.XE("Ant Egg",25,2,10,0).addDrop(h("Ant Egg"), .8).addDrop(h("Dirt"), .1), new s.XE("Queen Ant Egg",16,1,13,0).addDrop(h("Ant Egg"), .4).addDrop(h("Dirt"), .1), new s.XE("Fire Ant Egg",25,2,8,0).addDrop(h("Ant Egg"), .8).addDrop(h("Yucca"), .8), new s.XE("Queen Fire Ant Egg",16,1,10,0).addDrop(h("Ant Egg"), .4).addDrop(h("Yucca"), .4), new s.XE("Termite Egg",25,2,13,0).addDrop(h("Ant Egg"), .8).addDrop(h("Bone"), .8), new s.XE("Evil Ladybug",35,10,21,3).setNeutral(1).addDrop(h("Dahlia"), [0.215,0.7,1], 0).addDrop(h("Yin Yang"), [0.215,0.7,1], 0), new s.XE("Shiny Ladybug",35,10,21,3).setNeutral(1).addDrop(h("Rose")).addDrop(h("Dahlia")).addDrop(h("Bud"), [0,0,0,0,0.0151,0.278,0.9609,1], 5), new s.XE("Angelic Ladybug",30,3,22,4).setNeutral(1).setDamageReflection(.05).addDrop(h("Dahlia")).addDrop(h("Yin Yang"), .15).addDrop(h("Third Eye"), .05, 3), new s.XE("Centipede",10,10,15,4).setNeutral(1).addDrop(h("Peas"), [0.068,0.2946,0.9166,1], 0).addDrop(h("Leaf"), [0.0851,0.3566,0.9569,1], 0), new s.XE("Centipede",10,10,15,4).setSystem(1).setAggressive(1).addDrop(h("Peas"), [0.068,0.2946,0.9166,1], 0).addDrop(h("Leaf"), [0.0851,0.3566,0.9569,1], 0), new s.XE("Desert Centipede",20,10,17,4).setCentiMovement(1).addDrop(h("Powder"), [0,0,0.0135,0.1328,0.5963,0.9991,1], 2).addDrop(h("Faster"), [0.215,0.7,1], 0), new s.XE("Desert Centipede",20,10,17,4).setCentiMovement(1).setSystem(1).addDrop(h("Powder"), [0,0,0.0135,0.1328,0.5963,0.9991,1], 2).addDrop(h("Faster"), [0.215,0.7,1], 0), new s.XE("Evil Centipede",10,15,15,4).setAggressive(1).addDrop(h("Grapes"), [0.068,0.2946,0.9166,1], 0).addDrop(h("Iris"), [0.0851,0.3566,0.9569,1], 0), new s.XE("Evil Centipede",10,15,15,4).setSystem(1).setAggressive(1).addDrop(h("Grapes"), [0.068,0.2946,0.9166,1], 0).addDrop(h("Iris"), [0.0851,0.3566,0.9569,1], 0), new s.XE("Dandelion",30,5,20,0).setPushability(.5).addDrop(h("Dandelion"), [0,0.305,0.925,0.999,1], 1).addDrop(h("Pollen"), [0,0.0456,0.2839,0.9696,1], 1), new s.XE("Sponge",25,10,23,0).addDrop(h("Sponge")), new s.XE("Bubble",1,3,35,0).addDrop(h("Bubble"), .8).addDrop(h("Air"), .8), new s.XE("Shell",60,15,23,30).setMovesInBursts(1).setNeutral(1).addDrop(h("Shell"), .8).addDrop(h("Pearl"), .5).addDrop(h("Magnet"), .2), new s.XE("Starfish",26,25,22,4).setAggressive(1).setSpins(1).setHealing(5.459303933588445).setFleeAtLowHealth(.35).addDrop(h("Starfish"), [0.128,0.4939,0.9921,1], 0).addDrop(h("Sand"), [0.0169,0.0812,45.43,0.9967, 1], 0), new s.XE("Leech",18,1.68,12,5.5).setAggressive(1).addDrop(h("Fang"), [0.215,0.7,1], 0).addDrop(h("Faster"), [0.215,0.7,1]), new s.XE("Maggot",24,1,24,2).setAggressive(1).setProjectile({
                petalIndex: h("Goo"),
                cooldown: 56,
                health: 2,
                damage: 1,
                speed: 3,
                range: 45,
                size: .5
            }).addDrop(h("Goo")).addDrop(h("Maggot Poo"), .5).addDrop(h("Dirt"), .65), new s.XE("Firefly",23,2,16,4).setMoveInSines(1).addDrop(h("Wing")).addDrop(h("Lightbulb"), .6).addDrop(h("Battery"), .4), new s.XE("Bumblebee",29,4,18,5).setMoveInSines(1).setAggressive(1).setProjectile({
                petalIndex: h("Pollen"),
                cooldown: 11,
                health: 2,
                damage: 2,
                speed: 0,
                range: 90
            }).addDrop(h("Pollen")).addDrop(h("Honey"), .6), new s.XE("Moth",19,2,16,3).setMoveInSines(1).setNeutral(1).setFleeAtLowHealth(1).addDrop(h("Wing")).addDrop(h("Lightbulb"), .6).addDrop(h("Dust"), .4), new s.XE("Fly",18,3,14,6).setAggressive(1).setMoveInSines(1).addDrop(h("Wing")).addDrop(h("Faster"), .8).addDrop(h("Third Eye"), .02, 4), new s.XE("Square",12,2,13,0).setSystem(1), new s.XE("Triangle",18,3,15,0).setSystem(1), new s.XE("Pentagon",26,4,17,0).setSystem(1), new s.XE("Hell Beetle",45,4.5,25,3.5).setAggressive(1).setPushability(.8).addDrop(h("Dust"), .8).addDrop(h("Pincer"), .8).addDrop(h("Beetle Egg"), .8), new s.XE("Hell Spider",15,5,20,4.5).setAggressive(1).setPoison(1, 3).setPushability(.8).addDrop(h("Faster")).addDrop(h("Web"), .5).addDrop(h("Dahlia"), .5).setProjectile({
                petalIndex: h("web.mob.launched"),
                cooldown: 25,
                health: 1 / 0,
                damage: 0,
                speed: 0,
                range: 175,
                size: 1,
                runs: !0,
                nullCollision: !0
            }), new s.XE("Hell Yellowjacket",65,5,25,4).setAggressive(1).setProjectile({
                petalIndex: h("Missile"),
                cooldown: 85,
                health: 4,
                damage: 4,
                speed: 4.5,
                range: 65,
                aimbot: !0
            }).setPushability(.8).addDrop(h("Missile")).addDrop(h("Antennae"), .5), new s.XE("Termite Overmind Egg",16,1,17,0).addDrop(h("Ant Egg"), .4).addDrop(h("Amulet"), .4), new s.XE("Spirit",1e-10,0,35,1).setSpins(4, 1).addDrop(h("Candy"), .1), new s.XE("Wasp",55,4,24,3).setAggressive(1).setProjectile({
                petalIndex: h("wasp.projectile"),
                cooldown: 95,
                health: 13,
                damage: 1.25,
                speed: 2.25,
                range: 185,
                multiShot: {
                    count: 3,
                    delay: 256,
                    spread: .2
                }
            }).addDrop(h("Missile")).setPushability(.8).addDrop(h("Antennae"), .7).addDrop(h("Pollen"), .4), new s.XE("Stickbug",10,6,8,7).setAggressive(1).setPoison(2, 4).addDrop(h("Iris"), .75).addDrop(h("Powder")), new s.XE("Shrub",14,3,24,0).setPoison(3, 5).setPushability(.5).addDrop(h("Iris"), .75).addDrop(h("Shrub"), .6).addDrop(h("Leaf")), new s.XE("Hell Centipede",16,3,17,4.5).setAggressive(1).setSize(17, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Powder"), .5).addDrop(h("Dust"), .5), new s.XE("Hell Centipede",16,3,17,4.5).setSystem(1).setAggressive(1).setSize(17, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Powder"), .5).addDrop(h("Dust"), .5), new s.XE("Wilt",16,3,20,0).setPushability(0).addDrop(h("Branch")).addDrop(h("Leaf"), .6), new s.XE("Wilt",16,3,10,2.5).setSystem(1).setAggressive(1).setSize(10, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Branch")).addDrop(h("Leaf"), .6), new s.XE("Pumpkin",25,2,10,0).setSize(10, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Leaf", .5)).addDrop(h("Candy", .6)).addDrop(h("Lantern", .1)), new s.XE("Jack O' Lantern",34,4,13,0).setAggressive(1).setProjectile({
                petalIndex: h("Candy"),
                cooldown: 3,
                health: 1,
                damage: 1,
                speed: 5,
                range: 20,
                size: .4
            }).addDrop(h("Rock", .5)).addDrop(h("Candy", .6)).addDrop(h("Lantern", .1)), new s.XE("Crab",25,35,20,7.5).setAggressive(1).setStrafes(200, 35, 1.5).addDrop(h("Sand", .4)).addDrop(h("Claw", .825)), new s.XE("Tank",100,1,20,2).setAggressive(1).setProjectile({
                petalIndex: h("projectile.diep_bullet"),
                cooldown: 12,
                health: 12,
                damage: 2,
                speed: 2,
                range: 50,
                size: .2,
                aimbot: !0
            }).addDrop(h("Square Egg"), .1).addDrop(h("Triangle Egg"), .05).addDrop(h("Pentagon Egg"), .01), new s.XE("Dirt",75,10,20,0).setMOBPetal(h("Dirt")).addDrop(h("Dirt"), [0.215,0.7,1], 0).addDrop(h("Bloom"), [0,0,0,0,0.0007,0.013,0.12,0.99,1], 4, 4), new s.XE("Tree",45,10,30,0).setMOBPetal(h("Tree")).setPushability(0).addDrop(h("Coconut"), [0.129,0.4939,9921,1], 0).addDrop(h("Fig"), [0.215, 0.7, 1], 0).addDrop(h("Orange"), [0.301,0.835,1], 0), new s.XE("Small Tree",20,10,15,0).setPushability(0.01).setMOBPetal(h("Tree")).setSystem(1).addDrop(h("Coconut"), [0.129,0.4939,9921,1], 0).addDrop(h("Orange"), [0.301,0.835,1], 0), new s.XE("Root",100,15,15,0).setPushability(0.01).setDecays(1).setMOBPetal(h("Root.mob")).addDrop(h("Root"), [0.43,0.944,1], 0).addDrop(h("Cinderleaf"), [0.43,0.944,1], 0), new s.XE("Sandstone",15,10,20,0).setMOBPetal(h("Sandstone")).addDrop(h("Sand"), [0.215,0.7,1], 0).addDrop(h("Amulet Of Divergence"), [0,0,0,0,0,0,0,0,0,0,0,0,0,0.4871,1], 11, 16), new s.XE("Moonlit Frog",20,10,23,40).setMOBPetal(h("Moonlit Frog")).setMovesInBursts(1).setAggressive(1).addDrop(h("Faster"), [0.215,0.7,1], 0), new s.XE("Sunlit Frog",25,10,23,40).setMOBPetal(h("Sunlit Frog")).setMovesInBursts(1).setNeutral(1).setFleeAtLowHealth(1).addDrop(h("Faster"), [0.215,0.7,1], 0), new s.XE("Ruby Frog",20,10,23,150).setMOBPetal(h("Ruby Frog")).setMovesInBursts(1).setNeutral(1).addDrop(h("Faster")).addDrop(h("Ruby")), new s.XE("Desert Moth",25,10,25,4).setNeutral(2).setMOBPetal(h("Moth")).addDrop(h("Wing"), [0.215,0.7,1], 0).addDrop(h("Powder"), [0.215,0.7,1], 0).addDrop(h("Mandible"), [0.215,0.7,1], 0)]
              , o = t => r.findIndex((e => e.name === t));
            function l(t) {
                for (let e = 0; e < r.length; e++)
                    if (t(r[e]))
                        return e;
                return -1
            }
            n[h("Beetle Egg")].setSpawnable(o("Beetle"), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24], [3,3,3,3,9,7,5,3,2,2.8,3.6,4.4,5.2,7]),
            n[h("Stick")].setSpawnable(o("Sandstorm"), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24], [3]),
            n[h("Ant Egg")].setSpawnable(o("Soldier Ant"), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24], [0.2]),
            n[h("Branch")].setSpawnable(o("Wilt") + 1, [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5]),
            n[h("Leech Egg")].setSpawnable(o("Leech"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [6]),
            n[h("Hornet Egg")].setSpawnable(o("Hornet"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [6]),
            n[h("Square Egg")].setSpawnable(o("Square"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [4]),
            n[h("Triangle Egg")].setSpawnable(o("Triangle"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [4]),
            n[h("Pentagon Egg")].setSpawnable(o("Pentagon"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [4]),
            r[o("Angelic Ladybug")].setPoopable({
                index: o("Evil Ladybug"),
                interval: 135
            }),
          r[o("Tree")].setAntHoleSpawns([{
                index: o("Hornet"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Spider"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Ladybug"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Evil Ladybug"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Root"),
                count: 1,
                minHealthRatio: .001
            }]),
          r[o("Small Tree")].setAntHoleSpawns([{
                index: o("Hornet"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Spider"),
                count: 1,
                minHealthRatio: .001
            }]),
          r[o("Sandstone")].setAntHoleSpawns([{
                index: o("Sandstorm"),
                count: 1,
                minHealthRatio: .001
            }]),
          r[o("Ant Hole")].setAntHoleSpawns([{
                index: o("Soldier Ant"),
                count: 3,
                minHealthRatio: 1
            }, {
                index: o("Soldier Ant"),
                count: 3,
                minHealthRatio: .88
            }, {
                index: o("Soldier Ant"),
                count: 3,
                minHealthRatio: .76
            }, {
                index: o("Soldier Ant"),
                count: 3,
                minHealthRatio: .64
            }, {
                index: o("Soldier Ant"),
                count: 1,
                minHealthRatio: .52
            }, {
                index: o("Worker Ant"),
                count: 3,
                minHealthRatio: .28
            }, {
                index: o("Soldier Ant"),
                count: 3,
                minHealthRatio: .16
            }, {
                index: o("Baby Ant"),
                count: 3,
                minHealthRatio: .04
            }, {
                index: o("Soldier Ant"),
                count: 6,
                minHealthRatio: .001
            }, {
                index: o("Worker Ant"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Baby Ant"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Queen Ant"),
                count: 1,
                minHealthRatio: .001
            }]),
          r[o("Fire Ant Hole")].setAntHoleSpawns([{
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .88
            }, {
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .76
            }, {
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .64
            }, {
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .52
            }, {
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .4
            }, {
                index: o("Worker Fire Ant"),
                count: 2,
                minHealthRatio: .28
            }, {
                index: o("Soldier Fire Ant"),
                count: 2,
                minHealthRatio: .16
            }, {
                index: o("Baby Fire Ant"),
                count: 2,
                minHealthRatio: .04
            }, {
                index: o("Soldier Fire Ant"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Worker Fire Ant"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Baby Fire Ant"),
                count: 1,
                minHealthRatio: .001
            }, {
                index: o("Queen Fire Ant"),
                count: 1,
                minHealthRatio: .001
            }]),
            r[o("Termite Mound")].setAntHoleSpawns([{
                index: o("Baby Termite"),
                count: 6
            }, {
                index: o("Worker Termite"),
                count: 8
            }, {
                index: o("Soldier Termite"),
                count: 8
            }, {
                index: o("Termite Egg"),
                count: 5
            }, {
                index: o("Termite Overmind"),
                count: 1,
                minHealthRatio: .5
            }]),
            r[o("Ant Egg")].setHatchables([{
                index: o("Baby Ant"),
                time: 337.5
            }, {
                index: o("Worker Ant"),
                time: 562.5
            }, {
                index: o("Soldier Ant"),
                time: 787.5
            }]),
            r[o("Queen Ant Egg")].setHatchables({
                index: o("Soldier Ant"),
                time: 33.75
            }),
            r[o("Queen Ant")].setPoopable({
                index: o("Queen Ant Egg"),
                interval: 45
            }),
            r[o("Fire Ant Egg")].setHatchables([{
                index: o("Baby Fire Ant"),
                time: 337.5
            }, {
                index: o("Worker Fire Ant"),
                time: 562.5
            }, {
                index: o("Soldier Fire Ant"),
                time: 787.5
            }]),
            r[o("Queen Fire Ant Egg")].setHatchables({
                index: o("Soldier Fire Ant"),
                time: 33.75
            }),
            r[o("Queen Fire Ant")].setPoopable({
                index: o("Queen Fire Ant Egg"),
                interval: 45
            }),
            r[o("Termite Egg")].setHatchables([{
                index: o("Baby Termite"),
                time: 337.5
            }, {
                index: o("Worker Termite"),
                time: 562.5
            }, {
                index: o("Soldier Termite"),
                time: 787.5
            }]),
            r[o("Termite Overmind Egg")].setHatchables({
                index: o("Soldier Termite"),
                time: 45
            }),
            r[o("Termite Overmind")].setPoopable({
                index: o("Termite Overmind Egg"),
                interval: 90
            }),
            r[o("Centipede")].segmentWith(l((t => t.isSystem && "Centipede" === t.name))),
            r[o("Desert Centipede")].segmentWith(l((t => t.isSystem && "Desert Centipede" === t.name))),
            r[o("Evil Centipede")].segmentWith(l((t => t.isSystem && "Evil Centipede" === t.name))),
            r[o("Hell Centipede")].segmentWith(l((t => t.isSystem && "Hell Centipede" === t.name))),
            r[o("Tree")].branchWith(l((t => t.isSystem && "Small Tree" === t.name)), 2, 1);
            r[o("Wilt")].branchWith(l((t => t.isSystem && "Wilt" === t.name)), 7, 3);
            const d = n.length;
            r.length;
            console.log("config.js loaded", n.length, "petals", r.length, "mobs.");
            const c = t => {
                const e = [];
                return r.forEach((i => {
                    i.drops.forEach((i => {
                        i.index > -1 && t >= i.minRarity && e.push(i.index)
                    }
                    ))
                }
                )),
                e[Math.random() * e.length | 0]
            }
        }
        ,
        512: (t, e, i) => {
            i.d(e, {
                A: () => r
            });
            var s = i(110)
              , a = i(874);
            class n {
                constructor() {
                    this.grid = new Map
                }
                clear() {
                    this.grid.clear()
                }
                insert(t) {
                    const e = t._AABB.x1 >> 10
                      , i = t._AABB.y1 >> 10
                      , s = t._AABB.x2 >> 10
                      , a = t._AABB.y2 >> 10;
                    for (let n = i; n <= a; n++)
                        for (let i = e; i <= s; i++) {
                            const e = i | n << 10;
                            this.grid.has(e) ? this.grid.get(e).push(t) : this.grid.set(e, [t])
                        }
                }
                retrieve(t) {
                    const e = new Map
                      , i = t._AABB.x1 >> 10
                      , s = t._AABB.y1 >> 10
                      , a = t._AABB.x2 >> 10
                      , n = t._AABB.y2 >> 10;
                    for (let h = s; h <= n; h++)
                        for (let s = i; s <= a; s++) {
                            const i = s | h << 10;
                            if (!this.grid.has(i))
                                continue;
                            const a = this.grid.get(i);
                            for (let i = 0; i < a.length; i++)
                                !e.has(a[i].id) && this.hitDetection(t, a[i]) && e.set(a[i].id, a[i])
                        }
                    return e
                }
                hitDetection(t, e) {
                    return !(t._AABB.x1 > e._AABB.x2 || t._AABB.y1 > e._AABB.y2 || t._AABB.x2 < e._AABB.x1 || t._AABB.y2 < e._AABB.y1)
                }
                getAABB(t) {
                    const e = t.width * t.size
                      , i = t.height * t.size;
                    return {
                        x1: t.x - e,
                        y1: t.y - i,
                        x2: t.x + e,
                        y2: t.y + i
                    }
                }
            }
            const h = {
                specialWaveType: 0,
                isSpecialWave: 0,
                router: null,
                width: 1024,
                height: 1024,
                isRadial: !1,
                isLineMap: !1,
                biome: 0,
                announceRarity: 7,
                gamemode: s.LX.FFA,
                isTDM: !1,
                teamCount: 2,
                isWaves: !1,
                currentWave: 0,
                mobsExpire: !1,
                dynamicRoom: !0,
                teamMinimaps: [],
                random: () => {
                    if (h.isRadial) {
                        const t = Math.random() * Math.PI * 2
                          , e = Math.random() * h.width / 2;
                        return {
                            x: Math.cos(t) * e,
                            y: Math.sin(t) * e
                        }
                    }
                    return {
                        x: -h.width / 2 + Math.random() * h.width,
                        y: -h.height / 2 + Math.random() * h.height
                    }
                }
                ,
                mapSpawns: null,
                maxMapDistFromSpawn: 0,
                mapData: [],
                mapBasedSpawn(t, e) {
                    if (null == h.mapSpawns || null == h.mapSpawns[t])
                        return h.random();
                    let i = h.mapSpawns[t];
                    if (t == s.wv.PLAYER) {
                        let t = 0;
                        i = i.filter((t => {
                            if (t.rarity <= e.highestRarity)
                                return !0
                        }
                        )),
                        i.forEach((e => {
                            t = Math.max(e.rarity, t)
                        }
                        )),
                        i = i.filter((e => {
                            if (e.rarity >= t)
                                return !0
                        }
                        ))
                    }
                    const a = i[Math.floor(Math.random() * i.length)];
                    return {
                        x: a.x * h.width,
                        y: a.y * h.height,
                        rarity: a.rarity
                    }
                },
                isValidMapSpawn: (t, e) => {
                    if (0 === h.mapData.cells.length)
                        return !0;
                    const i = Math.floor((t + h.width / 2) / h.width * h.terrainGridWidth)
                      , s = Math.floor((e + h.height / 2) / h.height * h.terrainGridHeight);
                    return !(i < 0 || i >= h.terrainGridWidth || s < 0 || s >= h.terrainGridHeight) && 0 !== h.mapDataAt(t, e).type
                }
                ,
                mapDataAt: (t, e) => {
                    const i = Math.floor((t + h.width / 2) / h.width * h.terrainGridWidth)
                      , s = Math.floor((e + h.height / 2) / h.height * h.terrainGridHeight);
                    return i < 0 || i >= h.terrainGridWidth || s < 0 || s >= h.terrainGridHeight ? null : h.mapData.cells.filter((t => {
                        if (t.x == i && t.y == s)
                            return !0
                    }
                    ))[0]
                }
                ,
                mapSpawnClosestTo: (t, e) => {
                    if (0 === h.mapData.length)
                        return h.random();
                    t /= h.width,
                    e /= h.height;
                    let i, s = 1 / 0;
                    for (const n in h.mapSpawns) {
                        const r = h.mapSpawns[n];
                        for (const n of r) {
                            const h = (0,
                            a.t1)(n, {
                                x: t,
                                y: e
                            });
                            h < s && (i = n,
                            s = h)
                        }
                    }
                    return i
                }
                ,
                getPlayerSpawn: t => {
                    if (!h.isLineMap) {
                        return h.mapBasedSpawn(s.wv.PLAYER, t)
                    }
                    return {
                        x: Math.max(-h.width / 2 + 25, Math.min(h.width / 2 - 25, -h.width / 2 + Math.min(t.level / 50, 1) * h.width / 1.5 + 64 * (Math.random() - .5))),
                        y: -h.height / 2 + Math.random() * h.height
                    }
                }
                ,
                spawnNearPlayer: t => {
                    const e = [];
                    if (h.clients.forEach((t => {
                        t.body && e.push({
                            highestRarity: t.highestRarity,
                            x: t.body.x,
                            y: t.body.y,
                            size: t.body.size
                        })
                    }
                    )),
                    0 === e.length)
                        return {
                            position: h.mapBasedSpawn(s.wv.MOB),
                            rarity: 3 * Math.random() | 0
                        };
                    const i = e[Math.floor(Math.random() * e.length)];
                    let a, n = 0, r = i.size + 512, o = !1, l = 0;
                    do {
                        const e = Math.random() * Math.PI * 2
                          , s = r + 2048 * Math.random();
                        a = {
                            x: i.x + Math.cos(e) * s,
                            y: i.y + Math.sin(e) * s
                        };
                        const n = i.x - a.x
                          , d = i.y - a.y;
                        if (n * n + d * d > r * r && h.isValidMapSpawn(a.x, a.y)) {
                            const e = h.mapSpawnClosestTo(a.x, a.y).rarity
                              , i = Math.random() > .5 * Math.pow(1.1015, e);
                            l = Math.min(11, Math.max(0, i ? e + 1 : e - (2 * Math.random() | 0)));
                            if (0 === h.spatialHash.retrieve({
                                _AABB: {
                                    x1: a.x - t.tiers[l].size,
                                    y1: a.y - t.tiers[l].size,
                                    x2: a.x + t.tiers[l].size,
                                    y2: a.y + t.tiers[l].size
                                }
                            }).size) {
                                o = !0;
                                break
                            }
                        }
                    } while (++n < 100);
                    return o || (a = h.mapBasedSpawn(s.wv.MOB)),
                    {
                        position: a,
                        rarity: l,
                        tile: h.mapDataAt(a.x, a.y)
                    }
                }
                ,
                lineMapMobSpawn: t => {
                    const e = [];
                    if (h.clients.forEach((t => {
                        t.body && e.push({
                            highestRarity: t.highestRarity,
                            x: t.body.x,
                            y: t.body.y
                        })
                    }
                    )),
                    0 === e.length) {
                        const t = h.random();
                        return t.x = Math.max(-h.width / 2 + 25, Math.min(-25, t.x)),
                        {
                            position: t,
                            rarity: Math.min(10, Math.max(0, Math.floor((t.x + h.width / 2) / h.width * 10 + 2 * (Math.random() - .5))))
                        }
                    }
                    const i = e[Math.floor(Math.random() * e.length)];
                    let s = Math.min(10, i.highestRarity + (Math.random() > .8), Math.max(0, Math.floor((i.x + h.width / 2) / h.width * 10 + 2 * (Math.random() - .5))))
                      , n = 0
                      , r = 0
                      , o = 0;
                    do {
                        const e = Math.random() * Math.PI * 2
                          , a = 128 + 8 * t.tiers[s].size + Math.random() * t.tiers[s].size * 12;
                        n = i.x + Math.cos(e) * a,
                        r = i.y + Math.sin(e) * a,
                        n = Math.max(-h.width / 2 + 25, Math.min(h.width / 2 - 25, n)),
                        r = Math.max(-h.height / 2 + 25, Math.min(h.height / 2 - 25, r)),
                        o > 0 && o % 10 == 9 && (s = Math.max(0, s - 1))
                    } while (e.some((t => (0,
                    a.t1)(t, {
                        x: n,
                        y: r
                    }) < 128)) && o++ < 100);
                    return {
                        position: {
                            x: n,
                            y: r
                        },
                        rarity: s
                    }
                }
                ,
                spatialHash: new n,
                viewsSpatialHash: new n,
                terrainSpatialHash: new n,
                entities: new Map,
                drops: new Map,
                clients: new Map,
                pentagrams: new Map,
                lightning: new Map,
                terrain: new Map,
                terrainGridWidth: 0,
                terrainGridHeight: 0,
                maxMobs: 6,
                livingMobCount: 0,
                secretKey: crypto.getRandomValues(new Uint8Array(32)).join(""),
                zones: [],
                lag: {
                    fps: 20,
                    mspt: 0,
                    ticks: 0,
                    totalTime: 0
                },
                updateTerrain: () => {
                    h.terrainSpatialHash.clear(),
                    h.terrain.forEach((t => {
                        t._AABB = t.polygon._AABB,
                        h.terrainSpatialHash.insert(t)
                    }
                    ))
                }
                ,
                sendTerrain: t => {
                    const e = new s.AU(!0);
                    e.setUint8(s.jU.PIPE_PACKET),
                    e.setUint16(t > 0 ? t : 0),
                    e.setUint8(s.de.TERRAIN),
                    e.setUint16(h.terrainGridWidth),
                    e.setUint16(h.terrainGridHeight),
                    e.setUint16(h.terrain.size),
                    h.terrain.forEach((t => {
                        e.setInt16(t.gridX),
                        e.setInt16(t.gridY),
                        e.setUint8(t.type[0]),
                        e.setUint8(t.type[1])
                    }
                    )),
                    h.router.postMessage(e.build())
                }
                ,
                mobTable: null,
                defaultMobTables: null
            }
              , r = h
        }
        ,
        874: (t, e, i) => {
            i.d(e, {
                Br: () => l,
                FL: () => h,
                Iv: () => d,
                UU: () => o,
                jd: () => n,
                nU: () => s,
                t1: () => r
            });
            location.protocol,
            ("localhost" === location.hostname || location.hostname.startsWith("178.79.")) && location.hostname;
            function s(t, e, i) {
                const s = (1 - i) * Math.cos(t) + i * Math.cos(e)
                  , a = (1 - i) * Math.sin(t) + i * Math.sin(e);
                return Math.atan2(a, s)
            }
            const a = .6375;
            function n(t, e) {
                const i = Math.min(23, Math.min(t, e + 1))
                  , s = Math.max(0, i - 2);
                if (s > i)
                    return s;
                let n = s;
                const h = Math.pow(a, i);
                for (let t = s; t < i; t++)
                    Math.random() < h && n++;
                return n
            }
            function h(t, e) {
                const i = t - e;
                return Math.atan2(Math.sin(i), Math.cos(i))
            }
            function r(t, e) {
                const i = t.x - e.x
                  , s = t.y - e.y;
                return i * i + s * s
            }
            function o(t) {
                return 11.18213 * Math.log(0.000480827337943866 * (2080 + t));
            }
            function l(t, e=!1) {
                return /^[aeiou]/i.test(t) ? (e ? "An" : "an") + " " + t : (e ? "A" : "a") + " " + t
            }
            const d = ( () => {
                const t = new Date
                  , e = t.getMonth() + 1
                  , i = t.getDate();
                return 10 === e && i >= 31 || 11 === e && i <= 7
            }
            )()
        }
        ,
        904: (t, e, i) => {
            i.d(e, {
                cS: () => m,
                Bw: () => y,
                ai: () => p,
                M_: () => M
            });
            var s = i(110)
              , a = i(874)
              , n = i(446)
              , h = i(512);
            class r {
                constructor(t=0, e=0) {
                    this.x = t,
                    this.y = e
                }
                get magnitude() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                }
                get angle() {
                    return Math.atan2(this.y, this.x)
                }
                multiply(t) {
                    return this.x *= t,
                    this.y *= t,
                    this
                }
                divide(t) {
                    return this.x /= t,
                    this.y /= t,
                    this
                }
                add(t) {
                    return this.x += t.x,
                    this.y += t.y,
                    this
                }
                subtract(t) {
                    return this.x -= t.x,
                    this.y -= t.y,
                    this
                }
                normalize() {
                    return this.divide(Math.max(1e-4, this.magnitude))
                }
                addDirection(t, e) {
                    return this.x += e * Math.cos(t),
                    this.y += e * Math.sin(t),
                    this
                }
                zero() {
                    return this.x = 0,
                    this.y = 0,
                    this
                }
            }
            class o {
                constructor(t) {
                    this.health = t,
                    this.maxHealth = t,
                    this.lastDamaged = 0,
                    this.damageReduction = 0,
                    this.damageReductionPercent = 0,
                    this.invulnerable = !1,
                    this.onDamage = null,
                    this.shield = 0
                }
                set(t, e=!0) {
                    this.health = t * (e ? this.ratio : 1),
                    this.maxHealth = t,
                    this.shield = Math.min(this.shield, this.maxHealth)
                }
                damage(t) {
                    if (this.invulnerable)
                        return 0;
                    let e = 0;
                    if (this.shield > 0 && (e = Math.min(this.shield, t),
                    this.shield -= e),
                    this.shield <= 0) {
                        const i = Math.max(0, Math.min(this.health, (t - e - this.damageReduction) * (1 - this.damageReductionPercent)));
                        this.health = this.health - i,
                        e += i
                    }
                    return this.lastDamaged = Date.now(),
                    this.onDamage && this.onDamage(e),
                    e
                }
                deteriorateShield() {
                    this.shield = Math.max(0, this.shield - .015 * this.maxHealth / 23)
                }
                get ratio() {
                    return Math.max(0, this.health) / this.maxHealth
                }
                get shieldRatio() {
                    return Math.max(0, this.shield) / this.maxHealth
                }
                get isDead() {
                    return this.health <= 0
                }
            }
            class l {
                constructor(t, e) {
                    this.player = t,
                    this.index = e,
                    this.rarity = 0,
                    this.petals = [],
                    this.cooldowns = [],
                    this.boundMobs = [],
                    this.config = null,
                    this.amount = 1,
                    this.clumps = !1
                }
                get displayRatio() {
                    return 0 === this.amount || this.config.wearable ? 1 : this.petals.every((t => t && t.health.ratio > 0)) ? this.petals.reduce(( (t, e) => t + e.health.ratio), 0) / this.amount : Math.max(...this.cooldowns) / Math.max(1, this.config.tiers[this.rarity].cooldown)
                }
                define(t, e=0) {
                    this.config = t,
                    this.amount = this.config.tiers[e].count,
                    this.clumps = this.config.tiers[e].clumps && this.amount > 1,
                    this.petals = new Array(this.amount).fill(null),
                    this.cooldowns = new Array(this.amount).fill(0),
                    this.boundMobs = new Array(this.amount).fill(null).map(( () => [])),
                    this.player.health.set(
                      (this.amount > 0 
                        ? this.player.health.maxHealth + (this.config.tiers[e].extraHealth / this.amount)
                        : this.player.health.maxHealth
                      ) * (this.config.healthDivision == 0.05 ? this.config.healthDivision : 1)
                    );
                    this.rarity = e,
                    this.player.health.damageReduction = this.player.petalSlots.reduce((total, current) => Math.max(total, current.config.tiers[current.rarity].damageReduction ?? 0), 0),
                    this.player.health.damageReductionPercent = this.player.petalSlots.reduce((total, current) => Math.max(total, current.config.tiers[current.rarity].damageReductionPercent ?? 0), 0),
                    this.player.size += this.config.tiers[e].extraSize;
                    if (!this.player._baseSize) this.player._baseSize = this.player.size;
                    this.player.size = this.player.size + (this.config.tiers[e].scalingExtraSize / 2)
                    - (this.player._lastScalingSize ?? 0);
                    this.player._lastScalingSize = (this.config.tiers[e].scalingExtraSize / 2);
                    this.player.speed *= this.config.tiers[e].speedMultiplier,
                    this.config.wearable > 0 && (this.player.wearing[this.config.wearable] ??= 0,
                    this.player.wearing[this.config.wearable]++,
                    this.config.tiers[this.rarity].damageReflection > 0 && 1 === this.player.wearing[this.config.wearable] && (this.player.damageReflection += this.config.tiers[this.rarity].damageReflection)),
                    this.config.tiers[this.rarity].extraVision && (this.player.extraVision += this.config.tiers[this.rarity].extraVision),
                    this.config.tiers[this.rarity].absorbsDamage && this.player.absorbStacks.set(this.index,new d(0,this.config.tiers[this.rarity].absorbsDamage.period)),
                    this.config.attractsAggro && (this.player.aggroLevel += this.rarity),
                    this.player.client && (this.player.client.camera.lightingBoost += this.config.extraLighting)
                }
                destroy() {
                    this.petals.forEach((t => t?.destroy())),
                    this.player.health.set(
                      this.player.health.maxHealth -
                      ((this.config.tiers[this.rarity].extraHealth / this.amount) *
                       (this.config.healthDivision == 0.05 ? this.config.healthDivision : 1))
                    ),
                    this.player.health.damageReduction = this.player.petalSlots.reduce((total, current) => Math.max(total, current.config.tiers[current.rarity].damageReduction ?? 0), 0),
                    this.player.health.damageReductionPercent = this.player.petalSlots.reduce((total, current) => Math.max(total, current.config.tiers[current.rarity].damageReductionPercent ?? 0), 0),
                    this.player.size -= this.config.tiers[this.rarity].extraSize;
                    if (!this.player._baseSize) this.player._baseSize = this.player.size;
                    this.player.size = this.player.size - (this.config.tiers[this.rarity].scalingExtraSize / 2)
                    + (this.player._lastScalingSize ?? 0);
                    this.player._lastScalingSize = (this.config.tiers[this.rarity].scalingExtraSize / 2);
                    this.player.speed /= this.config.tiers[this.rarity].speedMultiplier,
                    this.cooldowns = new Array(this.amount).fill(-100),
                    this.boundMobs.forEach((t => t.forEach((t => t.destroy())))),
                    this.config.wearable > 0 && (this.player.wearing[this.config.wearable]--,
                    this.config.tiers[this.rarity].damageReflection > 0 && 0 === this.player.wearing[this.config.wearable] && (this.player.damageReflection -= this.config.tiers[this.rarity].damageReflection)),                
                    this.config.tiers[this.rarity].extraVision && (this.player.extraVision -= this.config.tiers[this.rarity].extraVision),
                    this.config.tiers[this.rarity].absorbsDamage && (() => {
                    const stack = this.player.absorbStacks.get(this.index);
                    stack && this.player.health.damage(stack.stacks.reduce((sum, s) => sum + s.damagePerTick * s.remainingTicks, 0));
                    this.player.absorbStacks.delete(this.index);
                    })(),
                    this.config.attractsAggro && (this.player.aggroLevel -= this.rarity),
                    this.player.client && (this.player.client.camera.lightingBoost -= this.config.extraLighting)
                }
                get radianSlots() {
                    return this.clumps ? 1 : this.amount
                }
                update(t, e, i) {
                    const totalExtraRadians =
                      this.player.petalSlots.reduce(
                        (total, slot) =>
                          total + (slot?.config?.tiers?.[slot.rarity]?.extraRadians ?? 0),
                        0.125
                      );
                    
                    this.player._cachedExtraRadians = totalExtraRadians;
                    
                    let r = this.player.size + 52.5 * (this.config.huddles ? 0.65 : i);
                    
                    if (this.config.wingMovement === true && this.player.attack) {
                        r += (1 + Math.sin(performance.now() / 125 + this.index)) * (this.player.size * (1 + this.rarity));
                    }
                    
                    for (let i = 0; i < this.amount; i++) {
                        const o = this.petals[i];
                    
                        if (
                            this.config.tiers[this.rarity].constantHeal > 0 &&
                            this.player.health.ratio < this.config.healWhenUnder &&
                            this.player.health.ratio > 0.001 &&
                            (!this.config.healsInDefense || (!this.player.attack))
                        ) {
                            const healAmount = this.config.healsInDefense && !this.player.defend
                                ? this.config.tiers[this.rarity].constantHeal / 2
                                : this.config.tiers[this.rarity].constantHeal;
                    
                            this.player.health.health = Math.min(
                                this.player.health.maxHealth,
                                this.player.health.health + healAmount
                            );
                        }
                        if (o) {
                            if (this.config.tiers[this.rarity].constantHeal > 0 && this.player.health.ratio < this.config.healWhenUnder && this.player.health.ratio > .001 && (!this.config.healsInDefense || !this.player.attack && this.player.defend) && (this.player.health.health = Math.min(this.player.health.maxHealth, this.player.health.health + this.config.tiers[this.rarity].constantHeal)),
                            this.config.healSpit && (o.range--,
                            o.range <= 0 && (o.range = this.config.healSpit.cooldown,
                            h.A.spatialHash.retrieve({
                                _AABB: {
                                    x1: this.player.x - this.config.healSpit.range,
                                    y1: this.player.y - this.config.healSpit.range,
                                    x2: this.player.x + this.config.healSpit.range,
                                    y2: this.player.y + this.config.healSpit.range
                                }
                            }).forEach((t => {
                                t.parent.id !== this.player.id || t.type !== s.wv.PLAYER || t.health.ratio >= 1 || (t.health.health = Math.min(t.health.maxHealth, t.health.health + this.config.healSpit.heal * Math.pow(s.z.HEALTH_SCALE, this.rarity)))
                            }
                            )))),
                            this.config.tiers[this.rarity].pentagramAbility && (o.range--,
                            o.range <= 0)) {
                                const t = this.config.tiers[this.rarity].pentagramAbility;
                                o.range = t.cooldown;
                                const e = o.findTarget(t.range, !0);
                                e && new A(this.player,e,25 * Math.pow(this.rarity + 1, 1.15),1e3 + 3e3 * Math.random(),this.rarity).define(t.damage, t.poison.damage, t.poison.duration, t.speedDebuff.multiplier, t.speedDebuff.duration)
                            }
                            if (this.config.shootsOut > -1 && (o.range -= 3,
                            o.range <= 0 && (this.player.attack || this.player.defend))) {
                                const t = new g(this.player,-1,-1);
                                t.x = o.x,
                                t.y = o.y,
                                t.index = this.config.shootsOut;
                                const e = n.GJ[this.config.shootsOut]
                                  , i = e.tiers[this.rarity];
                                t.size = i.sizeRatio,
                                t.health.set(i.health),
                                t.damage = i.damage,
                                t.speed = 0,
                                t.spinSpeed = 0,
                                t.launched = !0,
                                t.range = 225,
                                t.nullCollision = !0,
                                t.ignoreWalls = e.ignoreWalls,
                                i.poison && (t.poison.toApply.damage = i.poison.damage,
                                t.poison.toApply.timer = i.poison.duration),
                                e.enemySpeedDebuff && (t.speedDebuff.toApply.multiplier = e.enemySpeedDebuff.speedMultiplier,
                                t.speedDebuff.toApply.timer = e.enemySpeedDebuff.duration);
                                const s = Math.atan2(o.y - this.player.y, o.x - this.player.x);
                                t.velocity.x = Math.cos(s) * (this.player.attack ? 25 : 2.5),
                                t.velocity.y = Math.sin(s) * (this.player.attack ? 25 : 2.5),
                                o.health.health = 0
                            }
                            if (this.config.tiers[this.rarity].healing)
                                if (this.player.health.ratio < 1) {
                                    if (o.range--,
                                    o.range <= 0) {
                                        o.moveStrength = 3,
                                        o.moveAngle = Math.atan2(this.player.y - o.y, this.player.x - o.x),
                                        (0,
                                        a.t1)(o, this.player) < this.player.size && (this.player.health.health = Math.min(this.player.health.maxHealth, this.player.health.health + this.config.tiers[this.rarity].healing),
                                        o.destroy());
                                        continue
                                    }
                                } else
                                    o.range = 33.75;
                            if (this.config.tiers[this.rarity].shield > 0)
                                if (this.player.health.shieldRatio < 1) {
                                    if (o.range--,
                                    o.range <= 0) {
                                        o.moveStrength = 3,
                                        o.moveAngle = Math.atan2(this.player.y - o.y, this.player.x - o.x),
                                        (0,
                                        a.t1)(o, this.player) < this.player.size && (this.player.health.shield = Math.min(this.player.health.maxHealth, this.player.health.shield + this.config.tiers[this.rarity].shield),
                                        o.destroy());
                                        continue
                                    }
                                } else
                                    o.range = 33.75;
                            if (!o.launched) {
                                let s = 0
                                  , a = 0;
                                if (this.clumps) {
                                    const n = e / t * Math.PI * 2 + this.player.petalRotation
                                      , h = this.player.x + Math.cos(n) * r
                                      , l = this.player.y + Math.sin(n) * r
                                      , d = i / this.amount * Math.PI * 2 - this.player.petalRotation;
                                    let c = o.size * 2;
                                    2 === this.config.wingMovement && (c *= 1 + 4 * Math.sin(performance.now() / 125 + 5 * o.id)),
                                    s = h + Math.cos(d) * c,
                                    a = l + Math.sin(d) * c
                                } else {
                                    const n = (e + i) / t * Math.PI * 2 + this.player.petalRotation;
                                    s = this.player.x + Math.cos(n) * r,
                                    a = this.player.y + Math.sin(n) * r
                                }
                                const n = s - o.x
                                  , h = a - o.y;
                                o.moveStrength = Math.max(1, Math.cbrt(n * n + h * h) * (this.player._cachedExtraRadians / 0.125) / o.speed);
                                o.moveAngle = Math.atan2(h, n)
                            }
                            if (this.config.launchable && !o.launched && (o.facing = (e + i) / t * Math.PI * 2 + this.player.petalRotation,
                            o.range -= 3,
                            (this.player.defend && 0 == this.config.launchedSpeed || this.player.attack) && o.range <= 0) && (!this.config.revives || h.A.clients.values().toArray().some((client) => client.body == null))) {
                                o.launched = !0,
                                o.speed *= this.config.launchedSpeed,
                                o.range = this.config.tiers[this.rarity].launchedRange;
                                const [t,e] = o.findTargetAngleWithinRadianArc(o.facing, 2 * Math.PI / (7.5 - .4 * this.rarity));
                                o.launchedAt = e,
                                o.moveAngle = t,
                                o.facing = o.moveAngle,
                                o.moveStrength = 1,
                                this.player.petalSlots[o.slotIndex].petals[o.petalIndex] = null,
                                o.slotIndex = -1,
                                o.petalIndex = -1
                            }
                            if (this.config.splits && (o.range -= 2,
                            o.range <= 0 && this.player.attack)) {
                                for (let t = 0; t < this.config.splits.count; t++) {
                                    const e = new g(this.player,-1,-1);
                                    const tiers = this.rarity;
                                    e.index = this.config.splits.index,
                                    e.size = o.size,
                                    e.health.set(o.health.health),
                                    e.damage = o.damage,
                                    e.poison = o.poison,
                                    e.speed = 4 * o.speed,
                                    e.spinSpeed = o.spinSpeed,
                                    e.launched = !0,
                                    e.range = 50 * (this.rarity / 2 + 1),
                                    e.facing = e.moveAngle = 2 * Math.PI / this.config.splits.count * t + o.facing + o.moveAngle,
                                    e.x = o.x,
                                    e.y = o.y
                                }
                                o.health.health = 0
                            }
                            if (!0 === this.config.wingMovement && (o.facing += .15),
                            this.config.tiers[this.rarity].spawnable && (o.range--,
                            o.range <= 0)) {
                                const t = new y(o);
                                t.parent = this.player,
                                t.team = this.player.team,
                                t.friendly = !0,
                                t.health.maxHealth *= 3,
                                t.health.health *= 3,
                                h.A.livingMobCount--,
                                t.define(n.ey[this.config.tiers[this.rarity].spawnable.index], this.config.tiers[this.rarity].spawnable.rarity),
                                this.boundMobs[i].push(t),
                                o.health.health = 0
                            }
                        } else {
                            if (this.boundMobs[i].length > 0 && (this.boundMobs[i] = this.boundMobs[i].filter((t => t && !t.health.isDead)),
                            this.boundMobs[i].length > 0))
                                continue;
                            this.cooldowns[i]++,
                            this.cooldowns[i] >= this.config.tiers[this.rarity].cooldown && (this.petals[i] = new g(this.player,this.index,i),
                            this.petals[i].define(this.config, this.rarity),
                            this.cooldowns[i] = 0)
                        }
                    }
                    
                if (this.config.switchBiome && this.player.defend && this.player.client.divergenceUses > 0 && this.petals.some((petal) => petal != null)) {
                    h.A.clients.values().toArray().forEach((client) => {
                            if (h.A.biome == 1) {
                        client.talk(s.de.ROOM_UPDATE, {width: h.A.width, height: h.A.height, isRadial: true, biome: s.VC.DESERT});
                            } else if (h.A.biome == 2) {
                        client.talk(s.de.ROOM_UPDATE, {width: h.A.width, height: h.A.height, isRadial: true, biome: s.VC.OCEAN});
                            } else if (h.A.biome == 3) {
                        client.talk(s.de.ROOM_UPDATE, {width: h.A.width, height: h.A.height, isRadial: true, biome: s.VC.GARDEN});
                            }
                    });
                    if (h.A.biome == 1) {
                    h.A.mobTable = h.A.defaultMobTables[s.VC.DESERT];
                     h.A.biome = s.VC.DESERT;
                    } else if (h.A.biome == 2) {
                    h.A.mobTable = h.A.defaultMobTables[s.VC.OCEAN];
                    h.A.biome = s.VC.OCEAN;
                    } else if (h.A.biome == 3) {
                    h.A.mobTable = h.A.defaultMobTables[s.VC.GARDEN];
                    h.A.biome = s.VC.GARDEN;
                    }
                    this.player.client.divergenceUses -= 1;
                    this.destroy();
                }
                    return this.clumps ? e + 1 : e + this.amount
                }
                get gui() {
                    return {
                        index: this.config.id,
                        rarity: this.rarity,
                        alive: this.petals.some((t => t?.health.ratio > 0)),
                        cooldown: Math.min(...this.cooldowns) / this.config.tiers[this.rarity].cooldown
                    }
                }
            }
            class d {
                constructor(t=0, e=96) {
                    this.maxDamage = t;
                    this.absorbPercent = 0.9;
                    this.ticks = e;
                    this.stacks = [];
                }
            
                addStack(damage) {
                    if (damage <= 0) return false;
                    this.stacks.push({ damagePerTick: damage / this.ticks, remainingTicks: this.ticks });
                    return true;
                }
            
                tick() {
                    let total = 0;
                    for (let i = 0; i < this.stacks.length; i++) {
                        total += this.stacks[i].damagePerTick;
                        if (--this.stacks[i].remainingTicks <= 0) this.stacks.splice(i--, 1);
                    }
                    return total;
                }
            
                get totalAbsorbed() {
                    return this.stacks.reduce((sum, s) => sum + s.damagePerTick * s.remainingTicks, 0);
                }
            }
            class c {
                static idAccumulator = 1;
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    this.id = c.idAccumulator++,
                    this.parent = this,
                    this.x = t.x,
                    this.y = t.y,
                    this.size = 20,
                    this.width = 1,
                    this.height = 1,
                    this.facing = 0,
                    this.speed = 4,
                    this.velocity = new r(0,0),
                    this.health = new o(10),
                    this.type = s.wv.STANDARD,
                    this.friction = .5,
                    this.damage = 5,
                    this.pushability = 1,
                    this.density = 1,
                    this.damageReflection = 0,
                    this.aggroLevel = 0,
                    this.canBeViewed = !0,
                    this.nullCollision = !1,
                    this.hit = 0,
                    this.collisionIDs = new Set,
                    this.damagedBy = {},
                    this.speedDebuff = {
                        multiplier: 1,
                        timer: 0,
                        toApply: {
                            multiplier: 1,
                            timer: 0
                        }
                    },
                    this.poison = {
                        damage: 0,
                        timer: 0,
                        toApply: {
                            damage: 0,
                            timer: 0
                        }
                    },
                    this.absorbStacks = new Map,
                    this.lastGoodPosition = {
                        x: this.x,
                        y: this.y
                    },
                    this.guns = [],
                    h.A.entities.set(this.id, this)
                }
                bindToRoom() {
                    if (h.A.isRadial) {
                        const t = Math.atan2(this.y, this.x)
                          , e = this.x * this.x + this.y * this.y
                          , i = h.A.width / 2;
                        if (e > i * i) {
                            const e = Math.sqrt(i * i - 1);
                            this.x = Math.cos(t) * e,
                            this.y = Math.sin(t) * e
                        }
                    } else
                        this.x = Math.max(-h.A.width / 2, Math.min(h.A.width / 2, this.x)),
                        this.y = Math.max(-h.A.height / 2, Math.min(h.A.height / 2, this.y))
                }
                findTarget(t, e=!1) {
                    const i = h.A.spatialHash.retrieve({
                        _AABB: {
                            x1: this.x - t,
                            y1: this.y - t,
                            x2: this.x + t,
                            y2: this.y + t
                        }
                    });
                    if (e) {
                        const t = [];
                        return i.forEach((e => {
                            e.parent.id !== this.parent.id && e.parent.team !== this.parent.team && e.type !== s.wv.PETAL && t.push(e)
                        }
                        )),
                        t[Math.floor(Math.random() * t.length)]
                    }
                    {
                        const t = [];
                        return i.forEach((e => {
                            e.parent.id !== this.parent.id && e.parent.team !== this.parent.team && e.type !== s.wv.PETAL && t.push(e)
                        }
                        )),
                        t.sort(( (t, e) => (0,
                        a.t1)(this, t) - (0,
                        a.t1)(this, e))).sort(( (t, e) => e.parent.aggroLevel - t.parent.aggroLevel))[0] || null
                    }
                }
                update() {
                    if (this.destruct === 1) {
                        const players = Array.from(h.A.clients.values())
                            .map(c => c.body)
                            .filter(b => b && !b.health.isDead);
                    
                        const inRange = players.some(p => {
                            const dx = this.x - p.x;
                            const dy = this.y - p.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            return dist < this.size * 20 / (this.rarity / 4 + 1);
                        });
                    
                        if (inRange && !this._destructInterval) {
                            this._destructInterval = setInterval(() => {
                                if (!this.health || this.health.health <= 0) {
                                    clearInterval(this._destructInterval);
                                    this._destructInterval = null;
                                    return;
                                }
                    
                                const dmg = this.health.maxHealth * 0.05;
                    
                                if (typeof this.health.damage === "function") {
                                    this.health.damage(dmg);
                                } else {
                                    this.health.health -= dmg;
                                }
                    
                                if (this.health.health <= 0) {
                                    this.health.health = 0;
                                    clearInterval(this._destructInterval);
                                    this._destructInterval = null;
                                    if (typeof this.destroy === "function") this.destroy();
                                }
                            }, 100);
                        }
                    }
                    if (this.health.isDead) {
                        if (this.explodes) {
                            const explodePetal = new g(this.parent,-1,-1);
                            explodePetal.define(n.GJ[this.explodes.index], this.rarity);
                            explodePetal.x = this.x;
                            explodePetal.y = this.y;
                            explodePetal.speed = 0;
                            explodePetal.nullCollision = false;
                            setTimeout(() => {
                            explodePetal.destroy();
                        }, 250);
                    }
                        this.destroy();
                    } else {
                        if (this.poison.timer > 0 && (this.health.damage(this.poison.damage),
                        this.poison.timer--),
                        this.absorbStacks.size > 0) {
                            let t = 0;
                            this.absorbStacks.forEach((e => {
                                t += e.tick()
                            }
                            )),
                            this.health.damage(t)
                        }
                        this.speedDebuff.timer > 0 && (this.velocity.multiply(this.speedDebuff.multiplier),
                        this.speedDebuff.timer--),
                        this.x += this.velocity.x,
                        this.y += this.velocity.y,
                        this.speedDebuff.timer > 0 && this.velocity.divide(this.speedDebuff.multiplier),
                        this.velocity.multiply(this.friction),
                        this._AABB = h.A.spatialHash.getAABB(this),
                        this.canBeViewed && h.A.viewsSpatialHash.insert(this),
                        h.A.spatialHash.insert(this),
                        this.collisionIDs.clear(),
                        this.hit = Math.max(0, this.hit - 1)
                    }
                }
                collide() { 
                    h.A.spatialHash.retrieve(this).forEach((t => {
                        if (this.collisionIDs.has(t.id) || t.collisionIDs.has(this.id) || this.id === t.id || this.parent?.id === t.parent?.id && this.type !== t.type)
                            return;
                        this.collisionIDs.add(t.id),
                        t.collisionIDs.add(this.id);
                        if (this.parent.team === t.parent.team && (this.type === s.wv.PETAL || t.type === s.wv.PETAL || this.type === s.wv.PLAYER && t.type === s.wv.MOB || t.type === s.wv.PLAYER && this.type === s.wv.MOB))
                            return;
                        if (this.type === s.wv.MOB && t.type === s.wv.MOB && this.team === t.team && this.segmentID > -1 && t.segmentID > -1 && this.segmentID === t.segmentID)
                            return;
                        const e = this.x - t.x, i = this.y - t.y, a = e * e + i * i;
                        if (0 === a || this.size + t.size < Math.sqrt(a)) return;
                
                        if (new Set([this.type, t.type]).isSupersetOf(new Set([s.wv.MOB, s.wv.PETAL]))) {
                            let petal = this.type === s.wv.PETAL ? this : t;
                            let mob = this.type === s.wv.PETAL ? t : this;
                            const emeraldCaps = {
                                0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:10,9:11,10:12,11:13,
                                12:14,13:16,14:20,15:24,16:26,17:26,18:26
                            };
                            if (petal.emeraldAbility === 1 && mob.emeralded !== 1) {
                                const maxDupeRarity = emeraldCaps[petal.rarity] ?? 3;
                                if (mob.rarity <= maxDupeRarity) {
                                    mob.emeralded = 1;
                                    if (mob.parent && mob.parent !== mob) mob.parent.emeralded = 1;
                                    const newMob = new y({ x: mob.x, y: mob.y });
                                    newMob.config = mob.config;
                                    newMob.rarity = mob.rarity;
                                    newMob.team = mob.team;
                                    newMob.parent = mob.parent;
                                    newMob.define(newMob.config, newMob.rarity);
                                    newMob.emeralded = 1;
                                    petal.destroy();
                                    return;
                                }
                            }
                        }
                        if (this.parent.team !== t.parent.team) {
                        if (((this.type == s.wv.PLAYER) && (t.type == s.wv.MOB) || (this.launched && this.parent?.team === -69)) || ((this.type == s.wv.MOB) && (t.type == s.wv.PLAYER) || (t.launched && t.parent?.team === -69))) {
                        
                        const player = this.type === s.wv.PLAYER ? this : t;
                        const mob = (this.type === s.wv.MOB ? this : t) || (t.launched && t.parent?.team === -69);
                        
                        if (!mob.health.isDead && mob.team !== player.team) {
                            const dx = player.x - mob.x;
                            const dy = player.y - mob.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const minDist = (player.size || 1) + (mob.size || 1);
                        
                            if (dist < minDist && dist > 0) {
                                const pushStrength = 3;
                                const pushX = (dx / dist) * pushStrength;
                                const pushY = (dy / dist) * pushStrength;
                        
                                player.x += pushX;
                                player.y += pushY;
                        
                                player.velocity.x += pushX * 0.3;
                                player.velocity.y += pushY * 0.3;
                            }
                        }
                        
                            const playerRef = t.parent?.type === s.wv.PLAYER ? t.parent : this;
                            const petalSlots = playerRef.petalSlots ?? playerRef.body?.petalSlots ?? [];
                            petalSlots.forEach(slot => {
                                const hasEOC = slot?.config?.EOC || slot?.config?.tiers?.[slot.rarity]?.EOC;
                                if (!hasEOC) return;
                                const activePetal = slot.petals?.[0];
                                if (!activePetal) return;
                                if (activePetal.explodes) {
                                    const explodePetal = new g(activePetal.parent, -1, -1);
                                    explodePetal.define(n.GJ[activePetal.explodes.index], activePetal.rarity);
                                    explodePetal.x = activePetal.x;
                                    explodePetal.y = activePetal.y;
                                    explodePetal.speed = 0;
                                    explodePetal.nullCollision = 2;
                                    setTimeout(() => explodePetal.destroy(), 250);
                                }
                                activePetal.destroy();
                            });
                        }
                            if (!(this.nullCollision === true && this.type === s.wv.PETAL) && !(t.nullCollision === true && t.type === s.wv.PETAL)) {
                            let eD = 0, iD = 0;
                                iD += this.damage,
                                eD += t.damage;
                                if (this.extraDamage && t.health.ratio > this.extraDamage.minHp && t.health.ratio < this.extraDamage.maxHp) {
                                    const maxAllowedDamage = (t.health.ratio - this.extraDamage.minHp) * t.health.maxHealth;
                                    const bonus = this.extraDamage.multiplier;
                                    iD += Math.min(bonus, maxAllowedDamage);
                                }
                                if (t.extraDamage && this.health.ratio > t.extraDamage.minHp && this.health.ratio < t.extraDamage.maxHp) {
                                    const maxAllowedDamage = (this.health.ratio - t.extraDamage.minHp) * this.health.maxHealth;
                                    const bonus = t.extraDamage.multiplier;
                                    eD += Math.min(bonus, maxAllowedDamage);
                                }
                                if (((this.type == s.wv.PETAL) && (t.type == s.wv.MOB)) || ((this.type == s.wv.MOB) && (t.type == s.wv.PETAL))) {
                                    let petal = null;
                                    let mob = null;
                                    (this.type == s.wv.PETAL) ? (petal = this, mob = t) : (petal = t, mob = this);
                                    const reduction = petal.healingReduction !== undefined ? petal.healingReduction : 0;
                                    reduction != undefined && reduction > 0 && mob.healing > 0 && (mob.healing -= reduction);
                                    mob.healing < 0 ? mob.healing = 0 : mob.healing;
                                }
                                if (this.finalHit && !this.finalHitTriggered && (this.health.health - eD <= 0 || this.health.ratio <= 0.001)) {
                                    iD += this.finalHit.damage;
                                    this.finalHitTriggered = !0;
                                }
                                if (t.finalHit && !t.finalHitTriggered && (t.health.health - iD <= 0 || t.health.ratio <= 0.001)) {
                                    eD += t.finalHit.damage;
                                    t.finalHitTriggered = !0;
                                }
    
                                if (this.oddsDamage && !this.oddsDamageTriggered && (this.health.health - eD <= 0 || this.health.ratio <= 0.001)) {
                                    if (Math.floor(Math.random() * 10) == 1) {
                                    iD += this.oddsDamage.damage;
                                    console.log(this.oddsDamage.damage);
                                    this.oddsDamageTriggered = !0;
                                    }
                                }
                                if (t.oddsDamage && !t.oddsDamageTriggered && (t.health.health - iD <= 0 || t.health.ratio <= 0.001)) {
                                    if (Math.floor(Math.random() * 10) == 1) {
                                    eD += t.oddsDamage.damage;
                                    console.log(t.oddsDamage.damage);
                                    t.oddsDamageTriggered = !0;
                                    }
                                }
    
                                if (this.absorbStacks.size > 0) {
                                    let used = !1;
                                    this.absorbStacks.forEach((s => { !used && s.addStack(eD) && (used = !0) }));
                                    used || this.health.damage(eD);
                                } else this.health.damage(eD);
                
                                if (t.absorbStacks.size > 0) {
                                    let used = !1;
                                    t.absorbStacks.forEach((s => { !used && s.addStack(iD) && (used = !0) }));
                                    used || t.health.damage(iD);
                                } else t.health.damage(iD);
                                if (this.selfDamage) this.parent.health.damage(this.selfDamage);
                                if (t.selfDamage) t.parent.health.damage(t.selfDamage);
                                if (this.healBack > 0) this.parent.health.health = Math.min(this.parent.health.maxHealth, this.parent.health.health + this.healBack);
                                if (t.healBack > 0) t.parent.health.health = Math.min(t.parent.health.maxHealth, t.parent.health.health + t.healBack);
                                this.hit = 3,
                                t.hit = 3,
                
                                this.type === s.wv.MOB && this.neutral && (this.target = t.parent),
                                t.type === s.wv.MOB && t.neutral && (t.target = this.parent);
                                if (this.type === s.wv.PLAYER || this.type === s.wv.MOB)
                                    if (this.parent && "Leech" === this.config?.name) {
                                        let rec = this.parent.damagedBy[t.parent.id] || [0, t.parent.type, t.parent.type === s.wv.PLAYER ? t.parent.name : t.parent.index, t.parent.type === s.wv.PLAYER && t.parent.client ? t.parent.client.id : null];
                                        rec[0] += t.damage, this.parent.damagedBy[t.parent.id] = rec;
                                    } else {
                                        let rec = this.damagedBy[t.parent.id] || [0, t.parent.type, t.parent.type === s.wv.PLAYER ? t.parent.name : t.parent.index, t.parent.type === s.wv.PLAYER && t.parent.client ? t.parent.client.id : null];
                                        rec[0] += t.damage, this.damagedBy[t.parent.id] = rec;
                                    }
                
                                if (t.type === s.wv.PLAYER || t.type === s.wv.MOB)
                                    if (t.parent && "Leech" === t.config?.name) {
                                        let rec = t.parent.damagedBy[this.parent.id] || [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null];
                                        rec[0] += this.damage, t.parent.damagedBy[this.parent.id] = rec;
                                    } else {
                                        let rec = t.damagedBy[this.parent.id] || [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null];
                                        rec[0] += this.damage, t.damagedBy[this.parent.id] = rec;
                                    }
                
                                this.type === s.wv.PETAL && this.lightning?.chargesLeft > 0 && (new w(this.parent).define(this.lightning.damage, this.lightning.range, this.lightning.bounces).bounce(),
                                this.lightning.charges > 1 && (this.lightning.chargesLeft--,
                                this.health.health = this.health.maxHealth / this.lightning.charges * this.lightning.chargesLeft)),
                                t.type === s.wv.PETAL && t.lightning?.chargesLeft > 0 && (new w(t.parent).define(t.lightning.damage, t.lightning.range, t.lightning.bounces).bounce(),
                                t.lightning.charges > 1 && (t.lightning.chargesLeft--,
                                t.health.health = t.health.maxHealth / t.lightning.charges * t.lightning.chargesLeft));
                            }
                
                            this.speedDebuff.toApply.timer > 0 && (t.speedDebuff.multiplier = this.speedDebuff.toApply.multiplier,
                            t.speedDebuff.timer = this.speedDebuff.toApply.timer),
                            t.speedDebuff.toApply.timer > 0 && (this.speedDebuff.multiplier = t.speedDebuff.toApply.multiplier,
                            this.speedDebuff.timer = t.speedDebuff.toApply.timer),
                            this.poison.toApply.timer > 0 && (t.poison.damage = this.poison.toApply.damage,
                            t.poison.timer = this.poison.toApply.timer),
                            t.poison.toApply.timer > 0 && (this.poison.damage = t.poison.toApply.damage,
                            this.poison.timer = t.poison.toApply.timer);
                    }            
                        if (!(this.nullCollision === 2 || (this.nullCollision === true && this.type === s.wv.PETAL)) &&
                        !(t.nullCollision === 2 || (t.nullCollision === true && t.type === s.wv.PETAL))) {
                    
                        const pushDist = this.size + t.size - Math.sqrt(a);
                        if (pushDist > 0) {
                            const pushAngle = Math.atan2(i, e);
                            let thisFactor = 0.05,
                                tFactor = 0.95,
                                softness = 0.85;
                    
                            if ((this.type === s.wv.MOB && t.type === s.wv.PETAL) ||
                                (this.type === s.wv.PETAL && t.type === s.wv.MOB)) {
                                softness = 1;
                                if (t.density > 0) {
                                    thisFactor = 1.0;
                                    tFactor = 1.0;
                                } else {
                                    thisFactor = 1.0;
                                    tFactor = 1.0;
                                }
                                if (this.type === s.wv.MOB) {
                                    thisFactor = 0.01;
                                    tFactor = 1.0;
                                } else {
                                    thisFactor = 1.0;
                                    tFactor = 0.01;
                                }
                            }
                    
                            else if (this.type === s.wv.PLAYER && t.type === s.wv.PLAYER) {
                                softness = 1;
                                thisFactor = 0.5;
                                tFactor = 0.5;
                            }
                    
                            else if (this.type === s.wv.MOB && t.type === s.wv.MOB) {
                                const rarityDiff = (this.rarity ?? 0) - (t.rarity ?? 0);
                                const diff = Math.abs(rarityDiff);
                                let pushStrength;
                    
                                if (diff === 0) pushStrength = 0.5;
                                else if (diff === 1) pushStrength = 0.75;
                                else if (diff === 2) pushStrength = 0.85;
                                else pushStrength = 0.9;
                    
                                if (rarityDiff > 0) {
                                    tFactor = pushStrength;
                                    thisFactor = 1 - pushStrength;
                                } else if (rarityDiff < 0) {
                                    thisFactor = pushStrength;
                                    tFactor = 1 - pushStrength;
                                } else {
                                    thisFactor = tFactor = pushStrength;
                                }
                            }
                        
                            else if ((this.launched && this.parent?.team === -69) ||
                                     (t.launched && t.parent?.team === -69)) {
                                const rarityDiff = (this.rarity ?? 0) - (t.rarity ?? 0);
                                const diff = Math.abs(rarityDiff);
                                let pushStrength;
                    
                                if (diff === 0) pushStrength = 0.5;
                                else if (diff === 1) pushStrength = 0.75;
                                else if (diff === 2) pushStrength = 0.85;
                                else pushStrength = 0.9;
                    
                                if (rarityDiff > 0) {
                                    tFactor = pushStrength;
                                    thisFactor = 1 - pushStrength;
                                } else if (rarityDiff < 0) {
                                    thisFactor = pushStrength;
                                    tFactor = 1 - pushStrength;
                                } else {
                                    thisFactor = tFactor = pushStrength;
                                }
                            }
                    
                            const ratioThis = this.size / (this.size + t.size),
                                  ratioT = t.size / (this.size + t.size);
                    
                            this.velocity.x += Math.cos(pushAngle) * pushDist * softness * this.pushability * ratioT * thisFactor * t.density;
                            this.velocity.y += Math.sin(pushAngle) * pushDist * softness * this.pushability * ratioT * thisFactor * t.density;
                            t.velocity.x -= Math.cos(pushAngle) * pushDist * softness * t.pushability * ratioThis * tFactor * this.density;
                            t.velocity.y -= Math.sin(pushAngle) * pushDist * softness * t.pushability * ratioThis * tFactor * this.density;
                        }
                    }
                }
                ))}
                collideTerrain() {
                    const t = h.A.terrainSpatialHash.retrieve(this)
                      , e = [];
                    if (t.forEach((t => {
                        if (t.polygon.circleIntersects(this.x, this.y, this.size)) {
                            const i = t.polygon.resolve(this.x, this.y, this.size);
                            this.x = i.x,
                            this.y = i.y,
                            e.push(t)
                        }
                    }
                    )),
                    e.length > 0 ? this.velocity.multiply(.5) : this.lastGoodPosition = {
                        x: this.x,
                        y: this.y
                    },
                    2 === e.length) {
                        const t = Math.abs(e[0].gridX - e[1].gridX)
                          , i = Math.abs(e[0].gridY - e[1].gridY);
                        if (t === i || t > 1 || i > 1)
                            return;
                        const s = {
                            x: 0,
                            y: 0,
                            size: 0
                        };
                        for (const t of e)
                            s.x += t.x,
                            s.y += t.y,
                            s.size += t.size;
                        s.x /= e.length,
                        s.y /= e.length,
                        s.size /= e.length;
                        const a = this.x - s.x
                          , n = this.y - s.y;
                        if (Math.sqrt(a * a + n * n) < this.size)
                            return;
                        const h = Math.atan2(this.y - s.y, this.x - s.x);
                        this.x = s.x + Math.cos(h) * (s.size + this.size + 3),
                        this.y = s.y + Math.sin(h) * (s.size + this.size + 3)
                    }
                    let i = this.x > -h.A.width / 2 && this.x < h.A.width / 2 && this.y > -h.A.height / 2 && this.y < h.A.height / 2;
                    i && (this._AABB = h.A.spatialHash.getAABB(this),
                    h.A.terrainSpatialHash.retrieve(this).forEach((t => {
                        i && t.polygon.circleIntersects(this.x, this.y, this.size) && (i = !1)
                    }
                    ))),
                    i || (this.x = this.lastGoodPosition.x,
                    this.y = this.lastGoodPosition.y)
                }
                getTopDamagers(t=3, e=-1) {
                    const i = [];
                    for (const t in this.damagedBy) {
                        const [a,h,r,o] = this.damagedBy[t];
                        -1 !== e && h !== e || (h !== s.wv.PLAYER || i.some((t => t.clientID === o)) || i.push({
                            id: +t,
                            type: h,
                            damage: a,
                            name: r,
                            clientID: o
                        }),
                        h === s.wv.MOB && i.push({
                            id: +t,
                            type: h,
                            damage: a,
                            name: n.ey[r].name
                        }))
                    }
                    return i.sort(( (t, e) => e.damage - t.damage)),
                    i.slice(0, t)
                }
                destroy() {
                    this.health.health = 0,
                    h.A.entities.delete(this.id)
                }
            }
            class g extends c {
                constructor(t, e, i) {
                    super(t),
                    this.parent = t,
                    this.slotIndex = e,
                    this.petalIndex = i,
                    this.moveAngle = 0,
                    this.moveDist = 1,
                    this.speed = 6,
                    this.size = 7.5,
                    this.health.set(10),
                    this.type = s.wv.PETAL,
                    this.friction = 0,
                    this.index = 0,
                    this.spinSpeed = .1,
                    this.launched = !1,
                    this.range = 33.75,
                    this.moveStrength = 1,
                    this.launchedAt = null,
                    this.attractsLightning = !1,
                    this.placeDown = !1,
                    this.rarity = 0,
                    this.lightning = null,
                    this.burst = !1,
                    this.faceInRelation = !1,
                    this.ignoreWalls = !1
                }
                define(t, e) {
                    const i = t.tiers[e];
                    this.rarity = e,
                    this.health.set(i.health),
                    this.damage = i.damage,
                    this.size *= i.sizeRatio,
                    this.index = t.id,
                    this.spinSpeed = t.launchable ? 0 : .1,
                    i.petalDamageReduction != null && i.petalDamageReduction != undefined && (this.health.damageReduction += i.petalDamageReduction),
                    t.explodes && (this.explodes = t.explodes),
                    t.honey && (this.honey = t.honey),
                    t.EOC && (this.EOC = t.EOC),
                    t.emeraldAbility && (this.emeraldAbility = t.emeraldAbility),
                    t.rubyAbility && (this.rubyAbility = t.rubyAbility),
                    t.revives && (this.revives = t.revives),
                    t.SOS && (this.SOS = t.SOS),
                    i.selfDamage && (this.selfDamage = i.selfDamage / i.count),
                    t.enemySpeedDebuff && (this.speedDebuff.toApply.multiplier = t.enemySpeedDebuff.speedMultiplier,
                    this.speedDebuff.toApply.timer = t.enemySpeedDebuff.duration),
                    i.poison && (this.poison.toApply.damage = i.poison.damage,
                    this.poison.toApply.timer = i.poison.duration),
                    i.spawnable && (this.range = i.spawnable.timer,
                    this.spinSpeed = 0),
                    i.lightning && (this.lightning = i.lightning,
                    this.lightning.chargesLeft = i.lightning.charges),
                    t.canPlaceDown && (this.placeDown = !0),
                    i.density && (this.density = i.density),
                    t.collisions && (this.collisions = t.collisions),
                    t.phases && (this.health.invulnerable = !0,
                    this.pushability = 0),
                    this.attractsLightning = t.attractsLightning,
                    i.boost && (this.burst = {
                        speed: i.boost.length,
                        ticks: i.boost.delay
                    }),
                    t.healWhenUnder < 1 && (this.spinSpeed = 0),
                    "Starfish" === t.name && (this.faceInRelation = 0),
                    i.healBack && (this.healBack = i.healBack),
                    i.extraDamage && (this.extraDamage = i.extraDamage),
                    i.healingReduction !== undefined && (this.healingReduction = i.healingReduction),
                    i.finalHit && (this.finalHit = i.finalHit),
                    i.oddsDamage && (this.oddsDamage = i.oddsDamage),
                    this.ignoreWalls = t.ignoreWalls
                }
                findTargetAngleWithinRadianArc(t, e) {
                    let i = t
                      , n = 1 / 0
                      , r = null;
                    return h.A.entities.forEach((h => {
                        if (h.parent.id === this.parent.id || h.parent.team === this.parent.team || h.type === s.wv.PETAL)
                            return;
                        const o = Math.atan2(h.y - this.y, h.x - this.x);
                        if (Math.abs((0,
                        a.FL)(t, o)) > e / 2)
                            return;
                        const l = this.x - h.x
                          , d = this.y - h.y
                          , c = l * l + d * d;
                        c < n && (i = o,
                        n = c,
                        r = h)
                    }
                    )),
                    [i, r]
                }
                update() {
                    if (n.GJ[this.index].name == "Blood Corn") {
                        if (this.size < 50 && this.rarity < 9) {
                        console.log(1);
                        this.size += 0.0303703703703704;
                        this.damage *= 1.00088;
                        this.selfDamage *= 1.0017;
                        } else if (this.size < 70 && this.rarity > 8 && this.rarity < 12) {
                        this.size += 0.0424074074074074;
                         this.damage *= 1.00088;
                        this.selfDamage *= 1.0017;
                        } else if (this.size < 90 && this.rarity == 12) {
                        this.size += 0.045;
                        this.damage *= 1.00088;
                        this.selfDamage *= 1.0017;
                        } else if (this.size < 110 && this.rarity == 13) {
                        this.size += 0.0448148148148148;
                        this.damage *= 1.00088;
                        this.selfDamage *= 1.0017;
                        } else if (this.size < 130 && this.rarity == 14) {
                        this.size += 0.0474074074074074;
                        this.damage *= 1.00088;
                        this.selfDamage *= 1.0017;
                        }
                    }
                    if (this.honey && this.launched && h?.A?.entities) {
                        const player = this.parent;
                    
                        const honeyAttractionMap = {
                            0: [400, 133],
                            1: [400, 400, 133],
                            2: [400, 400, 400, 133],
                            3: [400, 400, 400, 400, 133],
                            4: [400, 400, 400, 400, 400, 133],
                            5: [400, 400, 400, 400, 400, 400, 133],
                            6: [450, 450, 450, 450, 450, 450, 450, 150],
                            7: [500, 500, 500, 500, 500, 500, 500, 500, 167],
                            8: [550, 550, 550, 550, 550, 550, 550, 550, 550, 183],
                            9: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 200],
                            10: [650, 650, 650, 650, 650, 650, 650, 650, 650, 650, 650, 217],
                            11: [700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 233],
                            12: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 500, 250],
                            13: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 700, 600, 400],
                            14: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 700, 550, 400],
                            15: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 700, 600, 500],
                        };
                    
                        const honeyRarity = this.rarity;
                        const honeyData = honeyAttractionMap[honeyRarity];
                        if (Array.isArray(honeyData)) {
                            h.A.entities.forEach(ent => {
                                        if (player?.defend) {
                                        this.speed /= 1.01;
                                        }
                                if (ent.type === s.wv.MOB && !ent.health.isDead && ent.team !== this.team && !ent.friendly) {
                                    const mobRarity = ent.rarity;
                    
                                    if (mobRarity < honeyData.length) {
                                        let radius = honeyData[mobRarity];
                    
                                        const dx = ent.x - this.x;
                                        const dy = ent.y - this.y;
                                        const distSq = dx * dx + dy * dy;
                                        const radiusSq = radius * radius;
                    
                                        if (distSq < radiusSq) {
                                            ent.target = this;
                                        } else if (ent.target === this) {
                                            ent.target = null;
                                        }
                                    }
                                }
                            });
                        }
                    }
                    if (this.dandelionBind)
                        return this.x = this.dandelionBind.x + Math.cos(this.facing) * (this.size + 1.2 * this.dandelionBind.size),
                        this.y = this.dandelionBind.y + Math.sin(this.facing) * (this.size + 1.2 * this.dandelionBind.size),
                        super.update();
                    if (!1 !== this.burst && (this.burst.ticks--,
                    this.parent.type === s.wv.PLAYER && this.parent.defend && this.burst.ticks <= 0)) {
                        const t = Math.atan2(this.parent.y - this.y, this.parent.x - this.x)
                          , e = this.burst.speed / this.parent.friction;
                        return this.parent.velocity.x += Math.cos(t) * e,
                        this.parent.velocity.y += Math.sin(t) * e,
                        void this.destroy()
                    }
                    if (this.launched && null !== this.launchedAt && !this.launchedAt.health.isDead && (this.moveAngle = (0,
                    a.nU)(this.moveAngle, Math.atan2(this.launchedAt.y - this.y, this.launchedAt.x - this.x), .35),
                    this.facing = this.moveAngle),
                    this.placeDown && this.parent.attack)
                        return super.update();
                        this.velocity.x += Math.cos(this.moveAngle) * this.speed * this.moveStrength,
                        this.velocity.y += Math.sin(this.moveAngle) * this.speed * this.moveStrength;
                    this.facing += this.spinSpeed,
                        
                    !1 !== this.faceInRelation && (this.facing = Math.atan2(this.y - this.parent.y, this.x - this.parent.x) + this.faceInRelation),
                    (this.launched && (this.range--, this.range <= 0))
                      ? (
                          this.destroy(),
                    
                          (this.revives == 1)
                            ? (
                                h.A.clients.values().toArray()
                                  .filter((client) => client.body == null)
                                  .sort((a, b) => a.deathID - b.deathID)
                                  .slice(0, this.revives)
                                  .forEach((client) => {
                                    client.body = new p(this);
                                    client.body.name = client.username;
                                    client.body.nameColor = client.nameColor;
                                    client.body.client = client;
                                    client.body.health.set(client.healthAdjustement);
                                    client.body.damage = client.bodyDamageAdjustment;
                                    client.body.initSlots(client.slots.length);
                                    for (let i = 0; i < client.slots.length; i++) {
                                      client.body.setSlot(i, client.slots[i].id, client.slots[i].rarity);
                                    }
                                    if (h.A.isTDM) client.body.team = -client.team;
                                  })
                              )
                    
                            : (this.revives == 2)
                              ? (
                                  h.A.clients.values().toArray()
                                    .filter((client) => client.body == null)
                                    .sort((a, b) => a.deathID - b.deathID)
                                    .slice(0, this.revives + 1)
                                    .forEach((client) => {
                                      client.body = new p(this);
                                      client.body.name = client.username;
                                      client.body.nameColor = client.nameColor;
                                      client.body.client = client;
                                      client.body.health.set(client.healthAdjustement);
                                      client.body.damage = client.bodyDamageAdjustment;
                                      client.body.initSlots(client.slots.length);
                                      for (let i = 0; i < client.slots.length; i++) {
                                        client.body.setSlot(i, client.slots[i].id, client.slots[i].rarity);
                                      }
                                      if (h.A.isTDM) client.body.team = -client.team;
                                    })
                                )
                    
                              : super.update()
                        )
                    
                      : super.update();
                        }
                collide() {
                    if (this.launched && !1 === this.ignoreWalls) {
                        h.A.terrainSpatialHash.retrieve(this).forEach((t => {
                            t.polygon.circleIntersects(this.x, this.y, this.size) && this.destroy()
                        }
                        ))
                    }
                    super.collide()
            if (n.GJ[this.index].name === "Honey" || n.GJ[this.index].name === "Bud" || n.GJ[this.index].name === "Bloom") {
                const previousX = this.x,
                      previousY = this.y;
                this.bindToRoom();
                if (previousX != this.x || previousY != this.y)
                this.moveAngle += (Math.atan2(this.y - previousY, this.x - previousX) - this.moveAngle - Math.PI) * 2 + Math.PI
                }
                    if (n.GJ[this.index].name === "projectile.pea") {
                        const previousX = this.x,
                              previousY = this.y;
                    
                        this.bindToRoom();
                        if (previousX != this.x || previousY != this.y) {
                            this.moveAngle += (Math.atan2(this.y - previousY, this.x - previousX) - this.moveAngle - Math.PI) * 2 + Math.PI;
                        }
                    
                    for (const ent of h.A.entities) {
                        if (
                            ent.type !== s.wv.MOB ||
                            ent.health.isDead ||
                            ent.team === this.team ||
                            ent.friendly
                        ) continue;
                    
                        const dx = ent.x - this.x;
                        const dy = ent.y - this.y;
                        const dist2 = dx * dx + dy * dy;
                        const minDist = (this.size || 1) + (ent.size || 1);
                        const maxCheckDist = 300;
                    
                        if (dist2 > maxCheckDist * maxCheckDist) continue;
                    
                        if (dist2 < minDist * minDist) {
                            const angleToMob = Math.atan2(dy, dx);
                            this.moveAngle = 2 * angleToMob - this.moveAngle + Math.PI;
                            this.x -= Math.cos(this.moveAngle) * 2;
                            this.y -= Math.sin(this.moveAngle) * 2;
                        }
                    }
                }
                    if (n.GJ[this.index].name === "projectile.grape") {
                        const previousX = this.x,
                              previousY = this.y;
                    
                        this.bindToRoom();
                        if (previousX != this.x || previousY != this.y) {
                            this.moveStrength += 0.15 / (this.rarity * 4 + 1);
                            this.moveAngle += (Math.atan2(this.y - previousY, this.x - previousX) - this.moveAngle - Math.PI) * 2 + Math.PI;
                        }
                    
                        if (h?.A?.entities) {

                            h.A.entities.forEach(ent => {
                                if (
                                    ent.type === s.wv.MOB &&
                                    !ent.health.isDead &&
                                    ent.team !== this.team &&
                                    ent.friendly !== true
                                ) {
                                    const dx = ent.x - this.x;
                                    const dy = ent.y - this.y;
                                    const dist = Math.sqrt(dx * dx + dy * dy);
                                    const minDist = (this.size || 1) + (ent.size || 1);
                    
                                    if (dist < minDist) {
                                        const angleToMob = Math.atan2(dy, dx);
                                        const reflectAngle = this.moveAngle - 2 * (this.moveAngle - angleToMob);
                                        this.moveAngle = reflectAngle + Math.PI;
                    
                                        this.moveStrength += 0.05 / (this.rarity * 10 + 1);
                    
                                        this.x -= Math.cos(this.moveAngle) * 2;
                                        this.y -= Math.sin(this.moveAngle) * 2;
                                        }
                                    }
                            });
                        }
                    }
                }
                destroy() {
                    if (this.config?.SOS) {
                    this.slot.reloadTimer = 360 * 22.5;
                    this.slot.cooldown = this.slot.reloadTimer;
                    if (this.slot.cooldowns) {
                        for (let i = 0; i < this.slot.cooldowns.length; i++) {
                            this.slot.cooldowns[i] = this.config.tiers?.[this.rarity]?.cooldown ?? 1;
                        }
                    }
                }
                    this.slotIndex > -1 && (this.parent.petalSlots[this.slotIndex].petals[this.petalIndex] = null),
                    super.destroy()
                }
            }
            class p extends c {
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    super(t),
                    this.name = "guest",
                    this.nameColor = "#FFFFFF",
                    this.type = s.wv.PLAYER,
                    this.accountName = null
                    this.accountPassword = null
                    this.team = this.id,
                    this.health.set(125),
                    this.moveAngle = 0,
                    this.moveStrength = 0,
                    this.attack = !1,
                    this.defend = !1,
                    this.petalRotation = 0,
                    this.size = 17,
                    this.extraPickupRange = 0,
                    this.petalSlots = [],
                    this.initSlots(5),
                    this.client = null,
                    this.wearing = [],
                    this.extraVision = 0,
                    this.lightVision = 2
                }
                get level() {
                    return this.client ? this.client.level : 1
                }
                get rarity() {
                    if (this.client)
                        return this.client.highestRarity;
                    let t = 0;
                    return this.petalSlots.forEach((e => {
                        t = Math.max(t, e.rarity)
                    }
                    )),
                    t
                }
                initSlots(t) {
                    if (t > this.petalSlots.length)
                        for (let e = this.petalSlots.length; e < t; e++) {
                            const t = new l(this,e);
                            t.define(n.GJ[0], 0),
                            this.petalSlots.push(t)
                        }
                    else
                        for (let e = this.petalSlots.length - 1; e >= t; e--)
                            this.petalSlots[e].destroy(),
                            this.petalSlots.pop()
                }
                setSlot(t, e, i) {
                    this.petalSlots[t].destroy(),
                    this.petalSlots[t].define(n.GJ[e], i)
                }
                    update() {
                        if (this.health.isDead)
                        for (const t of this.petalSlots)
                            if (t.config.tiers[t.rarity].deathDefying > 0 && t.petals.some((t => t && !t.health.isDead))) {
                                this.health.health = Math.min(t.config.tiers[t.rarity].deathDefying * this.health.maxHealth, this.health.maxHealth),
                                t.petals.forEach((t => t?.destroy())),
                                this.health.invulnerable || (this.health.invulnerable = !0,
                                setTimeout(( () => this.health.invulnerable = !1), 1500 + 250 * t.rarity));
                                break
                            }
                    this.health.shield > 0 && this.health.deteriorateShield(),
                    this.velocity.x += Math.cos(this.moveAngle) * this.moveStrength,
                    this.velocity.y += Math.sin(this.moveAngle) * this.moveStrength,
                    this.bindToRoom(),
                    this.facing = this.moveAngle,
                    super.update(),
                    this.health.lastDamaged + 15e3 < Date.now() && (this.health.health = Math.min(this.health.maxHealth, this.health.health + .0025 * this.health.maxHealth))
                }
                collide() {
                    super.collide(),
                    this.collideTerrain();
                    let t = 0
                      , e = 0
                      , i = 0;
                    const s = this.petalSlots.reduce(( (t, s) => (s.config.yinYangMovement && e++,
                    s.config.tiers[s.rarity].extraRange > i && (i = s.config.tiers[s.rarity].extraRange),
                    t + s.radianSlots)), 0);
                    let a = 1;
                    a = e % 3 == 0 ? 1 : e % 3 == 1 ? -1 : 0,
                    this.petalRotation += .125 * a,
                    this.extraPickupRange = 0;
                    const n = (1 + .5 * this.attack - .4 * this.defend) * (1 + i * this.attack);
                    this.petalSlots.forEach((e => {
                        t = e.update(s, t, n),
                        e.config.tiers[e.rarity].extraRadians && (this.petalRotation += e.config.tiers[e.rarity].extraRadians * a),
                        this.extraPickupRange = Math.max(this.extraPickupRange, e.config.tiers[e.rarity].extraPickupRange)
                    }
                    ))
                }
                
                destroy() {
                    this.client && (this.client.deathID = this.id);
                    if (this.petalSlots.forEach((t => t.destroy())),
                    super.destroy(),
                    null !== this.client) {
                        const t = this.getTopDamagers(10)
                          , e = []
                          , i = {}
                          , a = this.petalSlots.reduce(( (t, e) => t + Math.pow(e.rarity + 1, 3)), 0);
                        t.forEach((t => {
                            if (t.type === s.wv.PLAYER && (e.push(t.name),
                            null !== t.clientID)) {
                                const e = h.A.clients.get(t.clientID);
                                e && e.addXP(a)
                            }
                            t.type === s.wv.MOB && (i[t.name] = (i[t.name] || 0) + 1)
                        }
                        ));
                        const n = [...e, ...Object.entries(i).map(( ([t,e]) => (1 === e ? "a" : e) + " " + t + (e > 1 ? "s" : "")))];
                        let r = "You were killed by ";
                        n.length > 0 ? r += n.slice(0, -1).join(", ") + (n.length > 1 ? " and " : "") + n[n.length - 1] : r += '"the game"',
                        this.client.talk(s.de.DEATH, r),
                        this.client.body = null
                        const allPlayersDead = Array.from(h.A.clients.values()).every(client => client.body == null);
                        if (allPlayersDead) {
                            h.A.entities.forEach(ent => {
                                if (ent.type === s.wv.MOB) {
                                    ent.destroy({ skipDrops: true });
                                }
                            });
                        
                            Array.from(h.A.clients.values()).forEach(client => {
                                client.deathID = null;
                                client.DivergenceUses = 2;
                                client.startingWave = h.A.currentWave;
                                client.talk(s.fh.SPAWN);
                            });
                        
                            h.A.clients.forEach(t => t.systemMessage("Everyone has died, resetting lobby.", "#F03"));
                            h.A.width = h.A.height = 1024
                            h.A.currentWave = 0;
                            h.A.maxMobs = 0;
                            h.A.waveInProgress = false;
                            h.A.isSpecialWave = 0;
                            h.A.started = false;
                            if (Array.isArray(h.A._waveTimers)) h.A._waveTimers.forEach(clearTimeout);
                            h.A._waveTimers = [];
                        
                            h.A.clients.forEach(c => c.sendRoom());
                            const RARITIES = [
                                { name: "Common", color: "#7eef6d" },
                                { name: "Unusual", color: "#ffe65d" },
                                { name: "Rare", color: "#4d52e3" },
                                { name: "Epic", color: "#861fde" },
                                { name: "Legendary", color: "#de1f1f" },
                                { name: "Mythic", color: "#1fdbde" },
                                { name: "Ultra", color: "#ff2b75" },
                                { name: "Super", color: "#2bffa3" },
                                { name: "Omega", color: "#494849" },
                                { name: "Fabled", color: "#ff5500" },
                                { name: "Divine", color: "#67549c" },
                                { name: "Supreme", color: "#b25dd9" },
                                { name: "Omnipotent", color: "#5e004f" },
                                { name: "Astral", color: "#046307" },
                                { name: "Celestial", color: "#608efc" },
                                { name: "Seraphic", color: "#c77e5b" },
                                { name: "Transcendent", color: "#ffffff" },
                                { name: "Ethereal", color: "#f6c5de" },
                                { name: "Galactic", color: "#7f0226" },
                                { name: "Eternal", color: "#146636" },
                                { name: "Apotheotic", color: "#b3ab56" },
                                { name: "Voidbound", color: "#250a3d" },
                                { name: "Exalted", color: "#18608c" },
                                { name: "Chaos", color: "#20258a" },
                                { name: "Cataclysmic", color: "#940909" },
                                { name: "Nullborne", color: "#434246" }
                            ];
                            
                            const PETALS = [
                                "Basic","Light","Faster","Heavy","Stinger","Rice","Rock","Cactus","Leaf","Wing",
                                "Bone","Dirt","Magnolia","Corn","Sand","Orange","Missile","Pea","Rose","Yin Yang",
                                "Pollen","Honey","Iris","Web","web.mob.launched","Third Eye","Pincer","Beetle Egg",
                                "Antennae","Peas","Stick","scorpion.projectile","Dahlia","Primrose","Fire Spellbook",
                                "Deity","Lightning","Powder","Ant Egg","Yucca","Magnet","Amulet","Jelly","Yggdrasil",
                                "Glass","Dandelion","Sponge","Pearl","Shell","Bubble","Air","Starfish","Fang","Goo",
                                "Maggot Poo","Lightbulb","Battery","Dust","Armor","wasp.projectile","Shrub","projectile.grape",
                                "Grapes","Lantern","web.player.launched","Branch","Leech Egg","Hornet Egg","Candy",
                                "Claw","projectile.diep_bullet","Square Egg","Triangle Egg","Pentagon Egg","Bud",
                                "Fig","Fig.explosion","Amulet of Divergence","Tree","Bloom","Root.mob","Coconut",
                                "husk","Cinderleaf","Cinder.explosion","Root","Emerald","Blood Stinger","Blood Corn",
                                "Blood Light","Ruby","Fire Missile", "fire.projectile", "Sandstone", "missile.projectile",
                                "Moonlit Frog", "SunlitFrog","Ruby Frog", "Moth","Mandible"
                            ];
                            
                            h.A.clients.forEach(player => {
                                if (!player || !player.accountName || !player.accountPassword) return;
                            
                                if (Math.floor(Math.random() * 3) + 1 !== 1) return;
                            
                                const craftingStatsPerRarity = {};
                                for (let i = 0; i < RARITIES.length; i++) {
                                    const src = player.craftingStats?.[i] || {};
                                    craftingStatsPerRarity[i] = {
                                        A: src.A ?? 0,
                                        S: src.S ?? 0,
                                        C: src.C ?? 0,
                                        L: src.L ?? 0
                                    };
                                }
                            
                            const craftingStatsPerPetal = {};
                            if (player.craftingStatsPerPetal) {
                                for (const [rarityIdx, petals] of Object.entries(player.craftingStatsPerPetal)) {
                            
                                    const tier = {};
                                    for (const [petalKey, stats] of Object.entries(petals)) {
                                        let petalId = Number(petalKey);
                                        if (isNaN(petalId)) petalId = PETALS.indexOf(petalKey);
                                        if (petalId < 0) continue;
                            
                                        const attempts = stats?.A ?? 0;
                                        if (attempts > 0) {
                                            tier[petalId] = { A: attempts };
                                        }
                                    }
                            
                                    if (Object.keys(tier).length > 0) {
                                        craftingStatsPerPetal[rarityIdx] = tier;
                                    }
                                }
                            }
                            
                                PLAYER_ACCOUNTS[player.accountName] = {
                                    username: player.accountName,
                                    password: player.accountPassword,
                                    data: {
                                        aN: player.accountName,
                                        aP: player.accountPassword,
                                        sW: player.startingWave,
                                        L: player.level || 0,
                                        XP: player.xp || 0,
                                        TSP: (player.slots || []).map(slot => slot?.id ?? null),
                                        TSR: (player.slots || []).map(slot => slot?.rarity ?? null),
                                        BSP: (player.secondarySlots || []).map(slot => slot?.id ?? null),
                                        BSR: (player.secondarySlots || []).map(slot => slot?.rarity ?? null),
                                        I: player.inventory || {},
                                        CPR: craftingStatsPerRarity,
                                        CPP: craftingStatsPerPetal
                                    }
                                };
                            h.A.clients.forEach(c => c.systemMessage("Accounts Saved.", "#ff75ef"));
                    console.log(
                          "%c[SAVE DATA]%c" + `${JSON.stringify(PLAYER_ACCOUNTS[player.accountName].data)}`,
                      "color: cyan; font-weight: bold;",
                      "color: blue;"
                    );
                });
                            return;
                        }
                    }
                }
            }
            class u {
                constructor(t) {
                    this.id = t,
                    this.body = null,
                    this.camera = {
                        lightingBoost: 1
                    },
                    this.level = 1,
                    this.xp = 1,
                    this.slots = new Array(5).fill(null).map(( () => ({
                        id: 0,
                        rarity: 2
                    }))),
                    this.secondarySlots = new Array(5).fill(null).map(( () => null))
                }
                talk() {}
                addXP(t) {
                    if (!Number.isFinite(t))
                        return;
                    for (this.xp += t; this.xp < (0,
                    a.UU)(this.level - 1); )
                        this.level--,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    for (; this.xp >= (0,
                    a.UU)(this.level); )
                        this.level++,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    let e = 5 + Math.min(5, Math.floor(this.level / 10));
                    if (e !== this.slots.length) {
                        if (e > this.slots.length)
                            for (let t = this.slots.length; t < e; t++)
                                this.slots.push({
                                    id: 0,
                                    rarity: 0
                                }),
                                this.secondarySlots.push(null);
                        else if (e < this.slots.length)
                            for (let t = this.slots.length - 1; t >= e; t--)
                                this.slots.pop(),
                                this.secondarySlots.pop();
                        this.body && !this.body.health.isDead && this.body.initSlots(e)
                    }
                }
                get healthAdjustement() {
                    return 100 + 3 * Math.pow(this.level, 1.3)
                }
                get bodyDamageAdjustment() {
                    return 10 + 2 * Math.pow(this.level, 1.3)
                }
                get highestRarity() {
                    let t = 0;
                    for (const e of this.slots)
                        e.rarity > t && (t = e.rarity);
                    for (const e of this.secondarySlots)
                        e && e.rarity > t && (t = e.rarity);
                    return t
                }
            }
            class m extends p {
                static names = ["Abe", "Abraham", "Adam", "Adrian", "Al", "Alan", "Albert", "Alex", "Alexander", "Alfred", "Allan", "Allen", "Alvin", "Andre", "Andrew", "Andy", "Anthony", "Antonio", "Archie", "Arnold", "Arthur", "Austin", "Barry", "Ben", "Benjamin", "Bernard", "Bill", "Billy", "Bob", "Bobby", "Brad", "Bradley", "Brandon", "Brent", "Brett", "Brian", "Bruce", "Bryan", "Calvin", "Carl", "Cary", "Casey", "Cecil", "Chad", "Charles", "Charlie", "Chester", "Chris", "Christian", "Christopher", "Chuck", "Clarence", "Clifford", "Clint", "Clyde", "Cody", "Colin", "Corey", "Craig", "Curtis", "Dale", "Dan", "Daniel", "Danny", "Darrell", "Darren", "Dave", "David", "Dean", "Dennis", "Derek", "Derrick", "Don", "Donald", "Doug", "Douglas", "Duane", "Dustin", "Dwayne", "Dwight", "Dylan", "Earl", "Ed", "Eddie", "Edgar", "Edward", "Edwin", "Eli", "Eric", "Ernest", "Eugene", "Evan", "Floyd", "Francis", "Frank", "Franklin", "Fred", "Freddie", "Gabriel", "Garry", "Gary", "Gene", "Geoffrey", "George", "Gerald", "Gilbert", "Glen", "Glenn", "Gordon", "Greg", "Gregory", "Guy", "Harold", "Harry", "Harvey", "Henry", "Herbert", "Homer", "Horace", "Howard", "Hugh", "Ian", "Ira", "Isaac", "Jack", "Jacob", "Jake", "James", "Jamie", "Jason", "Jay", "Jeff", "Jeffery", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jerry", "Jesse", "Jim", "Jimmy", "Joe", "Joel", "John", "Johnny", "Jon", "Jonathan", "Jordan", "Jose", "Joseph", "Josh", "Joshua", "Juan", "Julian", "Justin", "Karl", "Keith", "Ken", "Kenneth", "Kenny", "Kent", "Kevin", "Kirk", "Kurt", "Kyle", "Lance", "Larry", "Lawrence", "Lee", "Leo", "Leon", "Leonard", "Leroy", "Leslie", "Lewis", "Lloyd", "Lonnie", "Louis", "Lucas", "Luther", "Marc", "Marcus", "Mario", "Marion", "Mark", "Marshall", "Martin", "Marvin", "Matt", "Matthew", "Maurice", "Max", "Melvin", "Michael", "Micheal", "Mike", "Mitchell", "Nathan", "Nathaniel", "Neil", "Nelson", "Nicholas", "Norman", "Oliver", "Oscar", "Otis", "Patrick", "Paul", "Perry", "Peter", "Phil", "Philip", "Phillip", "Ralph", "Randall", "Randy", "Ray", "Raymond", "Reginald", "Rex", "Richard", "Rick", "Rickey", "Ricky", "Robert", "Rodney", "Roger", "Ron", "Ronald", "Ronnie", "Ross", "Roy", "Russell", "Ryan", "Sam", "Samuel", "Scott", "Sean", "Seth", "Shane", "Shannon", "Shaun", "Shawn", "Sidney", "Stanley", "Stephen", "Steve", "Steven", "Ted", "Terry", "Theodore", "Thomas", "Tim", "Timothy", "Todd", "Tom", "Tommy", "Tony", "Tracy", "Travis", "Troy", "Tyler", "Tyrone", "Vernon", "Victor", "Vincent", "Virgil", "Wade", "Wallace", "Walter", "Warren", "Wayne", "Wesley", "Willard", "William", "Willie", "Zachary", "Zane", "Thot Clapper", "Grim Reaper", "real dev", "fake dev", "the void", "&#*!@$^*&$", "error 404", "ej", "Amara", "Lucifer", "Castiel"];
                constructor(t={
                    x: 0,
                    y: 0
                }, e=0, i=5) {
                    super(t),
                    this.team = -69,
                    this.target = null,
                    this.targetTick = 0,
                    this.randomMovementTick = 0,
                    this.name = ":" + m.names[Math.floor(Math.random() * m.names.length)] + ":",
                    this.client = new u(1024 + this.id),
                    this.client.body = this,
                    this.client.addXP((0,
                    a.UU)(i) + 1);
                    for (let t = 0; t < this.petalSlots.length; t++) {
                        const i = Math.max(0, e - 2 * Math.random() | 0)
                          , s = (0,
                        n.hf)(e);
                        this.client.slots[t] = {
                            id: s,
                            rarity: i
                        },
                        this.petalSlots[t].define(n.GJ[s], i)
                    }
                    h.A.livingMobCount++
                }
                update() {
                    this.target && this.target.health.isDead && (this.target = null),
                    this.target ? (this.moveAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x),
                    this.moveStrength = this.speed,
                    this.health.ratio < .334 ? (this.defend = !0,
                    this.attack = !1,
                    this.moveAngle += Math.PI + .5 * Math.sin(performance.now() / 2500)) : (this.defend = !1,
                    this.attack = !0)) : this.attack = this.defend = !1,
                    super.update()
                }
                collide() {
                    super.collide(),
                    this.targetTick-- <= 0 && (this.targetTick = 10e100,
                    this.target = this.findTarget(1024, !0))
                }
                destroy() {
                    super.destroy(),
                    h.A.livingMobCount--;
                    this.getTopDamagers(10).filter((t => t.type === s.wv.PLAYER)).forEach((t => {
                        const e = h.A.clients.get(t.clientID);
                        if (e)
                            for (let t = 0; t < this.petalSlots.length; t++)
                                Math.random() < .85 || new f({
                                    x: this.x + 75 * Math.random() - 37.5,
                                    y: this.y + 75 * Math.random() - 37.5
                                },e,this.petalSlots[t].config.id,Math.min(e.highestRarity + 1, this.petalSlots[t].rarity))
                    }
                    ))
                }
            }
            class y extends c {
                static segmentedLength = 0;
                static TEMPORARY_RANDOM_RARITY() {
                    const t = Math.random();
                    return t > .99995 ? 5 : t > .995 ? 4 : t > .9 ? 3 : t > .8 ? 2 : t > .6 ? 1 : 0
                }
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    super(t),
                    this.type = s.wv.MOB,
                    this.index = 0,
                    this.rarity = 0,
                    this.facing = Math.random() * Math.PI * 2,
                    this.movementAngle = Math.random() * Math.PI * 2,
                    this.moveStrength = 0,
                    this.tick = 0,
                    this.team = -69,
                    this.aggressive = !1,
                    this.henchmen = 0,
                    this.boss = 0,
                    this.neutral = !1,
                    this.destruct = 0,
                    this.emeralded = 0,
                    this.head = null,
                    this.target = null,
                    this.targetTick = 0,
                    this.extraTicker = 0,
                    this.projectile = null,
                    this.givesXP = !0,
                    h.A.livingMobCount++,
                    this.config = n.ey[0],
                    this.lastSeen = performance.now() + 1e4,
                    this.hatchable = null,
                    this.poopable = null,
                    this.deathEvent = null,
                    this.movesInBursts = !1,
                    this.spins = {
                        rate: 0,
                        constant: !1
                    },
                    this.fleeAtLowHealth = 0,
                    this.healing = 0,
                    this.segmentID = -1,
                    this.ropeBodies = null,
                    this._countsTowardsMobCount = !0
                }
                get countsTowardsMobCount() {
                    return this._countsTowardsMobCount
                }
                set countsTowardsMobCount(t) {
                    const e = this._countsTowardsMobCount;
                    e !== t && (this._countsTowardsMobCount = t,
                    e && !t && h.A.livingMobCount--,
                    !e && t && h.A.livingMobCount++)
                }
                define(t, e=0) {
                function getScaledSize(baseSize, raritySize, currentWave) {
                    const linearLimit = 100;
                    const minClamp = baseSize * 0.01;
                
                    let size = raritySize;
                
                    if (currentWave <= linearLimit) {
                        size *= Math.pow(0.995, currentWave);
                    } else {
                        const earlySize = raritySize * Math.pow(0.993, linearLimit);
                        const expFactor = 0.997;
                        const expWaves = currentWave - linearLimit;
                        size = earlySize * Math.pow(expFactor, expWaves);
                    }
                
                    size = Math.max(size, minClamp);
                
                    return size;
                }
                
                const i = t.tiers[e];
                const baseSize   = t.tiers[0].size;
                const raritySize = i.size;
                let scaledSize;
                
                if (h.A.currentWave !== 0) {
                    scaledSize = getScaledSize(baseSize, raritySize, h.A.currentWave) /
                                 ((h.A.currentWave / (200 / (this.rarity / 10 + 1))) + 1);
                } else {
                    scaledSize = 30;
                }
                this.petHealthScalers = [100,60,37.5,22,5.4,3.9,2.7,1.27,0.69,0.38,0.2,0.11,0.056];
                this.petDamageScalers = [0.5,0.58,0.66,0.76,0.88,1.12,1.33,2.61,4.56,8,11.24,19.6,34.3];
                this.beetleDamageScalers = [3000,276.9230769230769,225,203.5714285714286,168.75,132.9896907216495,112.1739130434783,57.33333333333333,32.6984126984127,18.72727272727273,10.7012987012987,6.156716417910448,3.503184713375796];
                scaledSize *= (0.98 + 0.04 * Math.random()) *
              (t.sizeRand.min + Math.random() * t.sizeRand.max);
                    this.config = t,
                    e = Math.min(t.tiers.length - 1, e);
                    if (this.health.set(i.health),
                    this.boss == true ? this.size = scaledSize * (1.5 / (this.rarity / 55 + 1)): this.size = scaledSize,
                    this.speed = t.speed,
                    this.index = t.id,
                    this.decays = t.decays,
                    this.rarity = e,
                    this.aggressive = t.aggressive,
                    this.henchmen = t.henchmen,
                    this.neutral = t.neutral,
                    this.destruct = t.destruct,
                    this.centiMovement = t.centiMovement,
                    this.emeralded = t.emeralded,
                    this.finalHit = t.finalHit,
                    this.healing = this.healing = t.tiers[e].healing,
                    this.oddsDamage = t.oddsDamage,
                    this.spins = t.spins,
                    this.fleeAtLowHealth = t.fleeAtLowHealth,
                    this.health.damageReduction += i.damageReduction,
                    this.invulnerable = true,
                    this.health.set(i.health * 100000),
                    this.damage = 0,
                    setTimeout(() => {
                        this.invulnerable = false;
                    
                        if (n.ey[this.index].name === "Soldier Ant" && this.friendly) {
                            const dmgScale = this.petDamageScalers[e] ?? 1;
                            const hpScale  = this.petHealthScalers[e] ?? 1;
                    
                            const baseDmg = Number.isFinite(i.damage) ? i.damage : 1;
                            const baseHP  = Number.isFinite(i.health) ? i.health : 1;
                    
                            this.damage = baseDmg * dmgScale;
                            this.health.set(baseHP * hpScale);
                        } else {
                            this.boss == true ? this.damage = i.damage * 1.5 : this.damage = i.damage
                            this.boss == true ? this.health.set(i.health * 5) : this.health.set(i.health);
                        }
                        if (n.ey[this.index].name === "Beetle" && this.friendly) {
                            const dmgScale = this.beetleDamageScalers[e] ?? 1;
                    
                            const baseDmg = Number.isFinite(i.damage) ? i.damage : 1;
                    
                            this.damage = baseDmg / dmgScale;
                            this.health.set(i.health);
                        } else {
                            this.boss == true ? this.damage = i.damage * 1.5 : this.damage = i.damage
                            this.boss == true ? this.health.set(i.health * 5) : this.health.set(i.health);
                        }
                    }, 1000),            
                    t.MOBpetal && (
                        this.MOBpetal = new g(this, -1, -1),
                        this.MOBpetal.define(n.GJ[t.MOBpetal], 0),
                        this.MOBpetal.spinSpeed = 0,
                        this.MOBpetal.size = this.size,
                        this.MOBpetal.health.invulnerable = true,
                        this.MOBpetal.nullCollision = true
                    ),
                    i.projectile && (this.projectile = {
                        ...i.projectile,
                        tick: 0
                    }),
                    i.poison && (this.poison.toApply.damage = i.poison.damage,
                    this.poison.toApply.timer = i.poison.duration),
                    t.segment && (this.segments = []),
                    "Demon" === t.name && (this.extraTicker = 100),
                    t.damageReflection > 0 && (this.damageReflection = t.damageReflection),
                    i.antHoleSpawns) {
                        const t = structuredClone(i.antHoleSpawns)
                          , e = t => {
                            const e = Math.random() * Math.PI * 2
                              , i = this.size + t + 1;
                            return {
                                x: this.x + Math.cos(e) * i,
                                y: this.y + Math.sin(e) * i
                            }
                        }
                        ;
                        for (let e = 0; e < t.length; e++)
                            t[e].maxCount = t[e].count;
                        for (const i of t)
                            if (i.count > 4)
                                for (let t = 0, s = 4 * Math.random() | 0; t < s; t++)
                                    setTimeout(( () => {
                                        const t = this.rarity
                                          , s = new y(e(n.ey[i.index].tiers[t].size));
                                        s.define(n.ey[i.index], t),
                                        s.team = this.team,
                                        i.count--,
                                        i.maxCount--,
                                        h.A.isWaves && h.A.maxMobs++
                                    }
                                    ), 64);
                    this.health.onDamage = () => {
                        for (const i of t) {
                            if (i.count <= 0) continue;
                    
                            const meetsHealth = !i.minHealthRatio || this.health.ratio <= i.minHealthRatio;
                            if (!meetsHealth) continue;
                    
                            while (
                                i.count > 0 &&
                                (i.minHealthRatio < 1 || this.health.ratio <= (i.count + 1) / i.maxCount)
                            ) {
                                const mobConfig = n.ey[i.index];
                                if (!mobConfig || !Array.isArray(mobConfig.tiers) || mobConfig.tiers.length === 0) {
                                    console.warn("[AntHole Spawn] Invalid mobConfig or no tiers for index:", i.index);
                                    break;
                                }
                    
                                let t = Math.max(0, Math.min(this.rarity, mobConfig.tiers.length - 1));
                    
                                const tier = mobConfig.tiers[t];
                                if (!tier || typeof tier.size === "undefined") {
                                    console.warn(`[AntHole Spawn] Missing tier size at rarity ${t} for mob index ${i.index}`);
                                    break;
                                }
                                const s = new y(e(tier.size));
                                s.define(mobConfig, t);
                                s.team = this.team;
                                i.count--;
                    
                                if (h.A.isWaves) h.A.maxMobs++;
                                }
                            }
                        }
                    };
                    if (t.hatchables?.length > 0 && (this.hatchable = structuredClone(t.hatchables[Math.random() * t.hatchables.length | 0])),
                    t.poopable && (this.poopable = {
                        index: t.poopable.index,
                        ticker: 0,
                        interval: t.poopable.interval
                    }),
                    t.segment) {
                        const e = y.segmentedLength++
                          , i = 3;
                        let s = this;
                        this.segmentID = e;
                        for (let a = 0; a < i; a++) {
                            const i = new y(this);
                            i.head = s,
                            i.define(n.ey[t.segment], this.rarity),
                            i.countsTowardsMobCount = !1,
                            i.segmentID = e,
                            i.henchmen = this.henchmen,
                            i.x = s.x - Math.cos(this.facing) * (this.size + i.size + 1),
                            i.y = s.y - Math.sin(this.facing) * (this.size + i.size + 1),
                            i.facing = this.facing,
                            s = i,
                            this.segments.push(i),
                            i.parent = this
                        }
                    }
                    if (t.branch) {
                        const e = y.segmentedLength++;
                        for (let i = 0; i < t.branch.branches; i++) {
                            const s = t.branch.branchLength;
                            let a = this;
                            this.segmentID = e;
                            for (let h = 0; h < s; h++) {
                                const s = new y(this);
                                s.head = a,
                                s.define(n.ey[t.branch.index], this.rarity),
                                s.countsTowardsMobCount = !1,
                                s.segmentID = e;
                                const h = this.facing + i * (2 * Math.PI) / t.branch.branches;
                                s.x = a.x - Math.cos(h) * (this.size + s.size + 1),
                                s.y = a.y - Math.sin(h) * (this.size + s.size + 1),
                                this.facing = h / 3,
                                s.facing = h,
                                a = s
                            }
                        }
                    }
                    if ("Leech" === t.name && !this.head && !this.isConvertedByRuby) {
                        const t = 4 + 5 * Math.random() | 0;
                        let e = this;
                        const i = y.segmentedLength++;
                        this.segmentID = i,
                        this.ropeBodies = [];
                        for (let s = 0; s < t; s++) {
                            const t = new y(this);
                            t.head = e,
                            t.define(n.ey[this.index], this.rarity),
                            t.size = this.size,
                            t.givesXP = !1,
                            t.health = this.health,
                            t.canBeViewed = !1,
                            t.countsTowardsMobCount = !1,
                            t.segmentID = i,
                            t.team = this.team,
                            t.parent = this,
                            t.x = e.x - Math.cos(this.facing) * (this.size + t.size + 1),
                            t.y = e.y - Math.sin(this.facing) * (this.size + t.size + 1),
                            t.facing = this.facing,
                            this.ropeBodies.push(t),
                            e = t
                        }
                    }
                    if (this.movesInBursts = t.movesInBursts,
                    "Dandelion" === this.config.name) {
                        const t = [];
                        this.id--,
                        c.idAccumulator--;
                        for (let e = 0; e < 8; e++) {
                            const i = 2 * Math.PI / 8 * e
                              , s = new g(this,-1,-1);
                            s.team = this.team,
                            s.define(n.GJ[(0,
                            n.zw)("Dandelion")], this.rarity),
                            s.facing = i,
                            s.pushability = 0,
                            s.dandelionBind = this,
                            s.size = this.size / 2,
                            s.damage *= .5,
                            s.health.set(.85 * s.health.maxHealth),
                            s.x = this.x + Math.cos(i) * (this.size + 1.2 * s.size),
                            s.y = this.y + Math.sin(i) * (this.size + 1.2 * s.size),
                            t.push(s)
                        }
                        
                        let e = !1;
                        this.health.onDamage = () => {
                            t.forEach((t => {
                                t.dandelionBind = !1,
                                t.moveAngle = t.facing,
                                t.launched = !0,
                                t.range = 67.5
                            }
                            )),
                            e = !0
                        }
                        ,
                        this.deathEvent = () => {
                            e || t.forEach((t => t.destroy()))
                        }
                        ,
                        this.id = c.idAccumulator++,
                        h.A.entities.set(this.id, this)
                    }
                    "Spirit" === this.config.name && (this.deathEvent = () => {
                        const t = n.ey.filter((t => {
                            if (!t.isSystem)
                                return !0
                        }
                        ));
                        new y(this).define(t[Math.random() * t.length | 0], this.rarity)
                    }
                    ),
                    t.strafes && (this.strafes = {
                        ...t.strafes,
                        cTick: 0,
                        mTick: 0,
                        direction: 0
                    }),
                    this.pushability = t.pushability
                }
                spawnDandelionProjectile(angleOffset = 0, projectileName = "Dandelion") {
                    const DMG_SCALE = [
                        1, 1.2, 1.5, 1.9, 2.7, 4.3, 8.6, 17.2, 34.4, 68.8,
                        137.6, 275.2, 550, 1100, 1650, 2475, 4950, 7425,
                        14850, 21000, 29700, 59400, 89100, 133650, 267300, 534600
                    ];
                    const HP_SCALE = [
                        1, 2, 4, 8*1.72/1.6, 50, 110, 310, 1350, 4941, 18084,
                        66188, 242247, 968988, 4844940, 9800000, 20000000, 60000000, 120000000,
                        360000000, 720000000, 1440000000, 4.32e9, 8.64e9, 1.728e10, 6e10, 18e10
                    ];
                
                    const projectileIndex = n.GJ.findIndex(t => t.name === projectileName);
                    if (projectileIndex === -1) return;
                
                    const p = new g(this, -1, -1);
                    p.define(n.GJ[projectileIndex], this.rarity);
                    p.team = p.parent.team;
                    p.index = projectileIndex;
                
                    p.size = this.size * 0.35;
                    p.speed = 5 * (this.rarity / 5);
                    p.range = 180 * 1 + (this.rarity / 10);
                    p.launched = true;
                
                    const rarityIndex = Math.min(this.rarity, DMG_SCALE.length - 1);
                
                    p.damage = 3 * DMG_SCALE[rarityIndex];
                
                    const scaledHP = 7 * HP_SCALE[rarityIndex];
                    p.health.health = scaledHP;
                    p.health.maxHealth = scaledHP;
                
                    p.spinSpeed = 0;
                    p.nullCollision = false;
                    p.facing = p.moveAngle = this.facing + angleOffset;
                }
                
                spinShootPattern1(deltaTime) {
                    this._spin1 = this._spin1 || { angle: 0, cooldown: 0 };
                    this._spin1.cooldown -= deltaTime;
                
                    if (this._spin1.cooldown <= 0) {
                        this._spin1.cooldown = 5;
                        const rotationStep = Math.PI / 10;
                        this.spawnDandelionProjectile(0);
                        this._spin1.angle += rotationStep;
                        this.facing += rotationStep;
                    }
                
                    if (this._spin1.angle >= Math.PI * 4) {
                        this._spin1.angle = 0;
                        return true; // signal done
                    }
                    return false;
                }
                
                spinShootPattern2(deltaTime) {
                    this._spin2 = this._spin2 || { angle: 0, cooldown: 0 };
                    this._spin2.cooldown -= deltaTime;
                
                    if (this._spin2.cooldown <= 0) {
                        this._spin2.cooldown = 20 * (this.rarity / 3);
                        const slices = 5;
                        for (let i = 0; i < slices; i++) {
                            const angleOffset = (i / slices) * Math.PI * 2 + this._spin2.angle;
                            this.spawnDandelionProjectile(angleOffset + (25 * Math.PI / 180));
                        }
                        const rotationStep = Math.PI / 12;
                        this._spin2.angle += rotationStep;
                        this.facing += rotationStep;
                    }
                
                    if (this._spin2.angle >= Math.PI * 4) {
                        this._spin2.angle = 0;
                        return true;
                    }
                    return false;
                }
                
                                spawnOrbitSpider() {
                    const rarMod = Math.random() < 0.5 ? -1 : -2;
                    const rarity = Math.max(0, this.rarity + rarMod);
                
                    const mob = new y(this);
                    const spiderConfig = n.ey.find(m => m.name === "Spider");
                    mob.define(spiderConfig, rarity);
                
                    mob.isOrbitMinion = true;
                    mob.orbitBoss = this;
                
                    mob.target = null;
                    mob.ignorePlayers = true; 
                    mob.noAggro = true;
                    mob.henchmen = 1;
                
                    mob.speed *= 0.9;
                
                    const angle = Math.random() * Math.PI * 2;
                    const spawnRadius = this.arena.radius + this.size * 1.2;
                
                    mob.x = this.x + Math.cos(angle) * spawnRadius;
                    mob.y = this.y + Math.sin(angle) * spawnRadius;
                
                    mob.movementAngle = angle;
                    mob.moveStrength = 0;
                
                    if (!this.orbitSpiders) this.orbitSpiders = [];
                    this.orbitSpiders.push(mob);
                
                    return mob;
                }
                
                    update() {
                if (this.config.name === "Baby Ant" && this.boss === true) {
                    this.spawnTriggers = this.spawnTriggers || {};
                
                    const percent = (this.health.health / this.health.maxHealth) * 100 | 0;
                
                    const spawnWave = (rarityOffset, count) => {
                        const spawnList = ["Queen Ant", "Worker Ant", "Baby Ant"];
                        for (let i = 0; i < count; i++) {
                            const mobName = spawnList[Math.random() * spawnList.length | 0];
                
                            const mobConfig = n.ey.find(m => m.name === mobName);
                            if (!mobConfig) continue;
                
                            const newMob = new y(this);
                            newMob.define(mobConfig, Math.max(this.rarity + rarityOffset, 0));
                            newMob.henchmen = 1;
                        }
                    };
                
                    const spawnSettings = [
                        { threshold: 14, key: 14, rarityOffset: -1, count: 6 },
                        { threshold: 13, key: 13, rarityOffset: -2, count: 8 },
                        { threshold: 12, key: 12, rarityOffset: -1, count: 6 },
                        { threshold: 11, key: 11, rarityOffset: -2, count: 8 },
                        { threshold: 10, key: 10, rarityOffset: -1, count: 6 },
                        { threshold: 6, key: 9, rarityOffset: -2, count: 8 },
                        { threshold: 8, key: 8, rarityOffset: -1, count: 6 },
                        { threshold: 8, key: 7, rarityOffset: -2, count: 8 },
                        { threshold: 6, key: 6, rarityOffset: -1, count: 6 },
                        { threshold: 6, key: 5, rarityOffset: -2, count: 8 },
                        { threshold: 4, key: 4, rarityOffset: -1, count: 6 },
                        { threshold: 4, key: 3, rarityOffset: -2, count: 8 },
                        { threshold: 2, key: 2, rarityOffset: -1, count: 6 },
                        { threshold: 1, key: 1, rarityOffset: -2, count: 8 },
                        { threshold: 0, key: 0, rarityOffset: -1, count: 6 },
                    ];
                
                    for (const { threshold, key, rarityOffset, count } of spawnSettings) {
                        if (percent <= threshold && !this.spawnTriggers[key]) {
                            this.spawnTriggers[key] = true;
                            spawnWave(rarityOffset, count);
                        }
                    }
                }
                
                if (this.config.name === "Spider" && this.boss === true && !this._ladybugInit) {
                    this._ladybugInit = true;
                
                    this.arena = {
                        radius: this.size * (5 / (this.rarity / 10))
                    };
                
                    this.orbitSpiders = [];       
                    this.spawnCooldown = 0;    
                    this.spawnInterval = 1500;
                    this.orbitCount = 20;
                }
                
                if (this.config.name === "Spider" && this.boss === true) {
                
                    this.arena.x = this.x;
                    this.arena.y = this.y;
                
                    const radius = this.arena.radius;
                
                    h.A.clients.forEach(client => {
                        if (!client.body) return;
                        const p = client.body;
                        const dx = p.x - this.arena.x;
                        const dy = p.y - this.arena.y;
                        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                        if (dist > radius) {
                            p.x = this.arena.x + dx / dist * radius;
                            p.y = this.arena.y + dy / dist * radius;
                        }
                    });
                
                    if (this.orbitSpiders.length === 0) {
                        for (let i = 0; i < this.orbitCount; i++) this.spawnOrbitSpider();
                    }
                
                this.spawnCooldown -= this.tickDelta || 16;
                    
                    if (this.spawnCooldown <= 0 && this.orbitSpiders.length <= 200) {
                        this.spawnCooldown = this.spawnInterval;
                        for (let i = 0; i < 4; i++) this.spawnOrbitSpider();
                    }
                
                const now = performance.now();
                const count = this.orbitSpiders.length;
                const minOrbitOffset = this.size * 1.5;
                const orbitRadius = Math.max(this.arena.radius + this.size * 1.5, minOrbitOffset);
                
                for (let i = 0; i < count; i++) {
                    const s = this.orbitSpiders[i];
                    if (!s || s.health?.isDead) continue;
                
                    const baseAngle = (i / count) * Math.PI * 2;
                    const rotationSpeed = 0.002;
                    const angle = baseAngle + now * rotationSpeed;
                
                    const targetX = this.x + Math.cos(angle) * orbitRadius;
                    const targetY = this.y + Math.sin(angle) * orbitRadius;
                
                    const dx = targetX - s.x;
                    const dy = targetY - s.y;
                    const distance = Math.sqrt(dx*dx + dy*dy) || 1;
                
                    s.movementAngle = Math.atan2(dy, dx);
                    s.moveAngle = s.movementAngle;
                
                    const linearSpeed = Math.max(s.speed * 0.8, distance / 8);
                    s.moveStrength = linearSpeed;
                
                    s.tick = 30;
                
                    s.target = null;
                    }
                }
                if (this.config.name === "Dirt" && this.boss === true) {
                    this.sizeCycle = this.sizeCycle || {
                        timer: 0,
                        state: "idle",
                        idleDuration: 5000,
                        growDuration: 250 * (this.rarity / 3),
                        shrinkDuration: 500 * (this.rarity / 3),
                        baseScale: this.size || 1,
                        maxScale: (this.size || 1) * 5 / (this.rarity / 5)
                    };
                
                    const dt = (this.tickDelta || 16);
                
                    const s = this.sizeCycle;
                    s.timer += dt;
                
                    if (s.state === "idle") {
                        if (s.timer >= s.idleDuration) {
                            s.state = "growing";
                            s.timer = 0;
                        }
                    }
                    else if (s.state === "growing") {
                        const t = Math.min(s.timer / s.growDuration, 1);
                        this.size = s.baseScale + (s.maxScale - s.baseScale) * t;
                        this.MOBpetal.size = this.size;
                
                        if (t >= 1) {
                            s.state = "shrinking";
                            s.timer = 0;
                        }
                    }
                    else if (s.state === "shrinking") {
                        const t = Math.min(s.timer / s.shrinkDuration, 1);
                        this.size = s.maxScale + (s.baseScale - s.maxScale) * t;
                        this.MOBpetal.size = this.size;
                
                        if (t >= 1) {
                            s.state = "idle";
                            s.timer = 0;
                            this.size = s.baseScale;
                            this.MOBpetal.size = this.size;
                        }
                    }
                    this.spawnTriggers = this.spawnTriggers || {};
                
                    const percent = (this.health.health / this.health.maxHealth) * 100 | 0;
                
                    const spawnWave = (rarityOffset, count) => {
                        const spawnList = ["Soldier Ant", "Worker Ant", "Baby Ant", "Hornet","Spider","Dandelion","Rock","Queen Ant","Dirt","Evil Centipede","Centipede"];
                        for (let i = 0; i < count; i++) {
                            const mobName = spawnList[Math.random() * spawnList.length | 0];
                
                            const mobConfig = n.ey.find(m => m.name === mobName);
                            if (!mobConfig) continue;
                
                            const newMob = new y(this);
                            newMob.define(mobConfig, Math.max(this.rarity + rarityOffset, 0));
                            newMob.henchmen = 1;
                        }
                    };
                
                    const spawnSettings = [
                        { threshold: 90, key: 90, rarityOffset: -2, count: 5 },
                        { threshold: 80, key: 80, rarityOffset: -1, count: 5 },
                        { threshold: 70, key: 70, rarityOffset: -2, count: 5 },
                        { threshold: 60, key: 60, rarityOffset: -1, count: 5 },
                        { threshold: 50, key: 50, rarityOffset: -2, count: 5 },
                        { threshold: 40, key: 40, rarityOffset: -1, count: 5 },
                        { threshold: 30, key: 30, rarityOffset: -2, count: 5 },
                        { threshold: 20, key: 20, rarityOffset: -1, count: 5 },
                        { threshold: 10, key: 10, rarityOffset: -2, count: 5 },
                        { threshold: 0, key: 0, rarityOffset: -1, count: 10 },
                    ];
                
                    for (const { threshold, key, rarityOffset, count } of spawnSettings) {
                        if (percent <= threshold && !this.spawnTriggers[key]) {
                            this.spawnTriggers[key] = true;
                            spawnWave(rarityOffset, count);
                        }
                    }
                }
                
                if (this.config.name === "Baby Fire Ant" && this.boss === true) {
                    this.spawnTriggers = this.spawnTriggers || {};
                
                    const percent = (this.health.health / this.health.maxHealth) * 100 | 0;
                
                    const spawnWave = (rarityOffset, count) => {
                        const spawnList = ["Queen Fire Ant", "Worker Fire Ant", "Baby Fire Ant"];
                        for (let i = 0; i < count; i++) {
                            const mobName = spawnList[Math.random() * spawnList.length | 0];
                
                            const mobConfig = n.ey.find(m => m.name === mobName);
                            if (!mobConfig) continue;
                
                            const newMob = new y(this);
                            newMob.define(mobConfig, Math.max(this.rarity + rarityOffset, 0));
                            newMob.henchmen = 1;
                        }
                    };
                
                    const spawnSettings = [
                        { threshold: 14, key: 14, rarityOffset: -1, count: 4 },
                        { threshold: 13, key: 13, rarityOffset: -2, count: 6 },
                        { threshold: 12, key: 12, rarityOffset: -1, count: 4 },
                        { threshold: 11, key: 11, rarityOffset: -2, count: 6 },
                        { threshold: 10, key: 10, rarityOffset: -1, count: 4 },
                        { threshold: 6, key: 9, rarityOffset: -2, count: 6 },
                        { threshold: 8, key: 8, rarityOffset: -1, count: 4 },
                        { threshold: 8, key: 7, rarityOffset: -2, count: 6 },
                        { threshold: 6, key: 6, rarityOffset: -1, count: 4 },
                        { threshold: 6, key: 5, rarityOffset: -2, count: 6 },
                        { threshold: 4, key: 4, rarityOffset: -1, count: 4 },
                        { threshold: 4, key: 3, rarityOffset: -2, count: 6 },
                        { threshold: 2, key: 2, rarityOffset: -1, count: 4 },
                        { threshold: 1, key: 1, rarityOffset: -2, count: 6 },
                        { threshold: 0, key: 0, rarityOffset: -1, count: 4 },
                    ];
                
                    for (const { threshold, key, rarityOffset, count } of spawnSettings) {
                        if (percent <= threshold && !this.spawnTriggers[key]) {
                            this.spawnTriggers[key] = true;
                            spawnWave(rarityOffset, count);
                        }
                    }
                }
                
                if (this.config.name === "Dandelion" && this.boss === true) {
                    const deltaTime = this.tickDelta || 16;
                
                    this._dandelionAttack = this._dandelionAttack || {
                        cooldown: 0,
                        currentPattern: null,
                        active: false
                    };
                
                    if (this._dandelionAttack.active) {
                        if (this._dandelionAttack.currentPattern === "pattern1") {
                            const done = this.spinShootPattern1(deltaTime);
                            if (done) {
                                this._dandelionAttack.active = false;
                                this._dandelionAttack.cooldown = 4000;
                            }
                        } else if (this._dandelionAttack.currentPattern === "pattern2") {
                            const done = this.spinShootPattern2(deltaTime);
                            if (done) {
                                this._dandelionAttack.active = false;
                                this._dandelionAttack.cooldown = 4000;
                            }
                        }
                    } else {
                        this._dandelionAttack.cooldown -= deltaTime;
                        if (this._dandelionAttack.cooldown <= 0) {
                            const patterns = ["pattern1", "pattern2"];
                            this._dandelionAttack.currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
                            this._dandelionAttack.active = true;
                        }
                    }
                }

                if (this.centiMovement) {
                    this.moveStrength = this.speed;
                    this.movementAngle -= 0.01;
                    this.x += Math.cos(this.movementAngle) * this.moveStrength;
                    this.y += Math.sin(this.movementAngle) * this.moveStrength;
                    const previousX = this.x,
                      previousY = this.y;
                        this.bindToRoom();
                        if (previousX != this.x || previousY != this.y)
                this.movementAngle += (Math.atan2(this.y - previousY, this.x - previousX) - this.movementAngle - Math.PI) * 2 + Math.PI
                }
                if (this.healing > 0 && this.health.ratio > 0) {
                    this.health.health = Math.min(
                        this.health.maxHealth,
                        this.health.health + this.healing
                    );
                }
                    if (this.decays == 1 && !this.decayTimerStarted) {
                            this.decayTimerStarted = true;
                        setTimeout(() => {
                            this.destroy({ skipDrops: true });
                        }, 10000);
                    }
                
                    if (this.parent.type === s.wv.PLAYER && this.parent.health.isDead) {
                        this.destroy();
                    } else {
                        if (h.A.mobsExpire && (null === this.head || this.head.health.isDead) &&
                            this.lastSeen + (this.health.ratio <= 0.8 ? 120000 : 30000) < performance.now()) {
                            this.damagedBy = [];
                            return void this.destroy();
                        } 
                        if (null !== this.hatchable) {
                            this.hatchable.time--;
                            if (this.hatchable.time <= 0) {
                                this.destroy();
                                const t = new y(this);
                                t.define(n.ey[this.hatchable.index], this.rarity);
                                t.target = this.parent.target;
                                t.henchmen = true;
                                this.hatchable = null;
                                return;
                            }
                        }
                        if (null !== this.head) {
                            if (this.head.health.isDead) {
                                this.head = null;
                                this.countsTowardsMobCount = true;
                                return;
                            }
                            const t = Math.atan2(this.head.y - this.y, this.head.x - this.x);
                            this.x = this.head.x - Math.cos(t) * (this.size + this.head.size + 1);
                            this.y = this.head.y - Math.sin(t) * (this.size + this.head.size + 1);
                            this.facing = t;
                            } else if (this.speed > 0) {
                                const owner = this.parent?.type === s.wv.PLAYER ? this.parent : null;
                                if (this.friendly && owner) {
                                    let targetX, targetY;
                            
                                    if (owner.defend || owner.defends || owner.body?.defend) {
                                        targetX = owner.x;
                                        targetY = owner.y;
                            
                                    } else if (owner.attack || owner.attacks || owner.body?.attack) {
                                        if (this.health?.health) this.health.health /= 1.005;
                            
                                        if (this.target?.health?.ratio > 0.001) {
                                            targetX = this.target.x;
                                            targetY = this.target.y;
                                        } else {
                                            targetX = owner.x;
                                            targetY = owner.y;
                                        }
                            
                                    } else {
                                        if (this.target?.health?.ratio > 0.001) {
                                            targetX = this.target.x;
                                            targetY = this.target.y;
                                        } else {
                                            targetX = owner.x;
                                            targetY = owner.y;
                                        }
                                    }
                            
                                    const dx = targetX - this.x;
                                    const dy = targetY - this.y;
                                    const angle = Math.atan2(dy, dx);
                                    const dist = Math.hypot(dx, dy);
                                    const pull = Math.max(0.2, Math.min(1, dist / 200));
                            
                                    let speedMult = 1;
                                    if (owner.defend || owner.defends || owner.body?.defend) speedMult = 1.5;
                                    else if (owner.attack || owner.attacks || owner.body?.attack) speedMult = 2.5;
                            
                                    this.movementAngle = angle;
                                    this.moveStrength = !this.friendly ? this.speed : this.speed * speedMult * pull;
                                }
                            else if (this.tick--, this.target?.health.ratio > 0.001) {
                
                                if (null !== this.poopable) {
                                    this.poopable.ticker++;
                                    if (this.poopable.ticker >= this.poopable.interval) {
                                        this.poopable.ticker = 0;
                                        const t = new y(this);
                                        t.x -= Math.cos(this.facing) * this.size * 2;
                                        t.y -= Math.sin(this.facing) * this.size * 2;
                                        t.define(n.ey[this.poopable.index], this.rarity > 0 ? this.rarity - 1 : this.rarity);
                                        t.henchmen = true;
                                        t.team = this.team;
                                        t.parent = this;
                                        h.A.isWaves && h.A.maxMobs++;
                                    }
                                }
                
                                if ("Demon" === this.config.name) {
                                    this.extraTicker--;
                                    if (this.extraTicker <= 0) {
                                        const t = Math.random() * Math.PI * 2;
                                        const e = Math.random() * (8 * this.target.size);
                                        new A(this, { x: this.target.x + Math.cos(t) * e, y: this.target.y + Math.sin(t) * e }, 1.25 * this.size * (1 + 0.2 * Math.random() - 0.1), 1500 + 1500 * Math.random());
                                        this.extraTicker = 100 + 100 * Math.random();
                                    }
                                }
                
                                if (this.config.sandstormMovement) {
                                    const t = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                                    if ((0, a.t1)(this, this.target) > Math.pow(5 * this.size + 4 * this.target.size + 50, 2)) {
                                        this.movementAngle = t;
                                        this.moveStrength = this.speed;
                                        this.extraTicker = t + Math.PI + Math.random() * Math.PI / 1.5 - Math.PI / 3;
                                    } else {
                                        const e = (.7 * Math.sin(this.extraTicker) + .6) * (10 * this.target.size + 5 * this.size);
                                        const i = this.target.x + Math.cos(this.extraTicker) * e;
                                        const s = this.target.y + Math.sin(this.extraTicker) * e;
                                        const n = (0, a.t1)(this, { x: i, y: s });
                                        const h = Math.atan2(s - this.y, i - this.x);
                                        if (n < 1.25 * this.size) this.extraTicker = t + Math.PI + Math.random() * Math.PI - Math.PI / 2;
                                        this.movementAngle = h;
                                        this.moveStrength = this.speed;
                                    }
                                }
                                else if (this.movesInBursts) {
                                    if (this.tick <= 0) {
                                        this.tick = 35 - this.rarity;
                                
                                        this.movementAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                                        this.moveStrength = this.speed;
                                    }
                                
                                    this.moveStrength *= 0.7;
                                } 
                                else if (this.strafes?.cTick < this.strafes?.cooldown) {
                                    this.strafes.cTick++;
                                } 
                                else {
                                    this.movementAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                                
                                    if (this.config.tiers[this.rarity].lightning) {
                                        if ((0, a.t1)(this, this.target) < 0.85 * Math.pow(this.config.tiers[this.rarity].lightning.range, 2)) {
                                            this.moveStrength = 0;
                                        } else {
                                            this.moveStrength = this.speed;
                                        }
                                    } 
                                    else if (this.projectile && (!this.strafes || this.strafes.mTick > this.strafes.length)) {
                                        if (this.projectile.runs === false) {
                                            if ((0, a.t1)(this, this.target) < 0.85 * Math.pow(this.projectile.range * this.projectile.speed, 2)) {
                                                this.moveStrength = 0;
                                            } else {
                                                this.moveStrength = this.speed;
                                            }
                                        } else {
                                            this.moveStrength = this.speed;
                                        }
                                    } 
                                    else {
                                        if (this.neutral == 2 && this.target) {
                                        this.moveStrength = this.speed * 2;
                                        } else {
                                        this.moveStrength = this.speed;
                                        }
                                    }
                                
                                    if (this.health.ratio <= this.fleeAtLowHealth) {
                                        this.movementAngle += Math.PI;
                                        this.moveStrength *= 0.85;
                                    }
                                
                                    if (this.strafes) {
                                        if (this.strafes.mTick < this.strafes.length) {
                                            this.movementAngle += (this.strafes.direction === 0 ? Math.PI : -Math.PI) / 2;
                                            this.moveStrength *= this.strafes.speedMult;
                                            this.strafes.cTick = this.strafes.cooldown;
                                            if (Math.random() < 0.025) this.strafes.direction = !this.strafes.direction;
                                        } else {
                                            this.strafes.mTick = 0;
                                            this.strafes.cTick = 0;
                                        }
                                        this.strafes.mTick++;
                                    }
                                }
                            }
                            else {
                                if (this.movesInBursts) this.moveStrength *= 0.7;
                                else if (this.parent.type === s.wv.PLAYER) {
                                    this.movementAngle = Math.atan2(this.parent.y - this.y, this.parent.x - this.x);
                                    this.moveStrength = (0, a.t1)(this, this.parent) < this.size + 2 * this.parent.size ? 0 : this.speed;
                                } else {
                                    if (this.tick <= 0) {
                                        this.tick = 25 + Math.floor(Math.random() * 100);
                                        this.movementAngle = Math.random() * Math.PI * 2;
                                        this.moveStrength = this.speed;
                                    }
                                    this.moveStrength *= 0.95;
                                }
                            }
                            if (this.config.moveInSines) {
                                this.movementAngle += 0.1 * Math.sin(performance.now() / 120 + this.id) * this.velocity.magnitude;
                            }
                            this.velocity.x += Math.cos(this.movementAngle) * this.moveStrength;
                            this.velocity.y += Math.sin(this.movementAngle) * this.moveStrength;
                
                            if (this.spins) this.facing += (this.spins.constant === 0 ? this.velocity.magnitude : 1) / this.speed * 0.1 * this.spins.rate;
                            else this.facing = this.movementAngle;
                
                            if (this.strafes && this.target && this.strafes.cTick === this.strafes.cooldown) {
                                this.facing -= this.strafes.direction === 0 ? Math.PI : -Math.PI / 2;
                            }
                        }
                        if (null !== this.projectile) {
                            this.projectile.tick++;
                            if (this.projectile.aimbot && this.target?.velocity.magnitude > 0) {
                                const t = Math.sqrt((0, a.t1)(this, this.target)) / this.projectile.speed / 2;
                                const e = this.target.x + this.target.velocity.x * t;
                                const i = this.target.y + this.target.velocity.y * t;
                                this.facing = Math.atan2(i - this.y, e - this.x);
                            }
                
                            if (this.target?.health.ratio > 0.001 && this.projectile.tick >= this.projectile.cooldown) {
                                this.projectile.tick = 0;
                                if (this.projectile.multiShot) {
                                    for (let t = 0; t < this.projectile.multiShot.count; t++) {
                                        setTimeout(() => {
                                            if (this.health.isDead || !this.target || this.target.health.isDead) return;
                                            const p = new g(this, -1, -1);
                                            p.define(n.GJ[this.projectile.petalIndex], this.rarity);
                                            p.team = p.parent.team;
                                            p.index = this.projectile.petalIndex;
                                            p.size = this.size * this.projectile.size;
                                            p.speed = this.projectile.speed * this.rarity * 3 / this.rarity;
                                            p.launched = true;
                                            p.range = this.projectile.range * this.rarity;
                                            p.spinSpeed = 0;
                                            p.nullCollision = this.projectile.nullCollision;
                                            let e = this.facing;
                                            if (this.projectile.multiShot.spread > 0) {
                                                e += (Math.random() - 0.5) * this.projectile.multiShot.spread;
                                                p.speed *= 1 + (Math.random() - 0.5) * this.projectile.multiShot.spread;
                                            }
                                            p.facing = p.moveAngle = e;
                                        }, t * this.projectile.multiShot.delay);
                                    }
                                } else {
                                    const p = new g(this, -1, -1);
                                    p.define(n.GJ[this.projectile.petalIndex], this.rarity);
                                    p.team = p.parent.team;
                                    p.index = this.projectile.petalIndex;
                                    p.size = this.size * this.projectile.size;
                                    p.speed = this.projectile.speed * this.rarity * 3 / this.rarity;
                                    p.launched = true;
                                    p.range = this.projectile.range * this.rarity;
                                    p.spinSpeed = 0;
                                    p.nullCollision = this.projectile.nullCollision;
                                    p.facing = p.moveAngle = this.facing;
                                }
                            }
                        }
                
                        this.bindToRoom();
                        super.update();
                    }
                }
                collide() {
                    if (super.collide(),
                    this.collideTerrain(),
                    this.MOBpetal && (
                        this.MOBpetal.x = this.x,
                        this.MOBpetal.y = this.y,
                        this.MOBpetal.facing = this.facing,
                        this.MOBpetal.hit = this.hit,
                        Object.assign(this.MOBpetal.velocity, this.velocity)
                    ),
                    this.targetTick--,
                    this.aggressive && ((this.targetTick <= 0 || null === this.target || this.target.health.isDead) && (this.targetTick = 10e100,
                    this.target = this.findTarget(12 * this.size + 50)),
                    this.target?.health.ratio > .001 && this.config.tiers[this.rarity].lightning)) {
                        const t = this.config.tiers[this.rarity].lightning;
                        this.extraTicker--,
                        this.extraTicker <= 0 && (new w(this).define(t.damage, t.range, t.bounces).bounce(),
                        this.extraTicker = t.cooldown * (.95 + .1 * Math.random()))
                    }
                }
                destroy({ skipDrops = false } = {}) {
                    if (typeof this.deathEvent === "function") this.deathEvent();
                    super.destroy();
                    
                    if (h?.A?.entities?.has(this.id)) {
                        h.A.entities.delete(this.id);
                    }
                    if (!(this.team == -69)) {
                        skipDrops = true
                    }
                
                    (() => {
                        const head = (this.segments != null) ? this : this.parent;
                        if (head.segments != null) {
                            const segments = head.segments;
                            const index = segments.indexOf(this);
                            let nextSegment = null;
                            segments.length > index + 1 && (
                                nextSegment = segments[index + 1],
                                head.parent != head && (nextSegment.parent = head.parent),
                                nextSegment.segments = segments.slice(index + 2),
                                nextSegment.segments.forEach((t) => { t.parent = nextSegment })
                            ),
                            head.segments = segments.slice(0, index);
                        }
                    })();
                    if (this.henchmen) {
                        if (typeof h?.A?.livingMobCount === "number") {
                            h.A.livingMobCount = Math.max(0, h.A.livingMobCount - 1);
                        }
                    }
                    if (h.A.isBossWave && !this.boss) {
                        if (typeof h?.A?.livingMobCount === "number") {
                            h.A.livingMobCount = Math.max(0, h.A.livingMobCount + 1);
                        }
                    }
                    if (this.MOBpetal) this.MOBpetal.destroy();
                    if (!this.friendly && this.countsTowardsMobCount) h.A.livingMobCount--;
                
                    if (this.friendly || this.henchmen || !this.countsTowardsMobCount) return;
                
                if (!this._beingDestroyed) {
                    this._beingDestroyed = true;
                
                    h.A.entities.forEach(t => {
                        if (new Set([this.type, t.type]).isSupersetOf(new Set([s.wv.MOB, s.wv.PETAL]))) {
                            let petal = null, mob = null;
                            const petLifetime = {
                                0: 10000, 1: 10000, 2: 10000, 3: 10000, 4: 10000, 5: 10000,
                                6: 10000, 7: 10000, 8: 10000, 9: 10000, 10: 10000, 11: 10000,
                                12: 10000, 13: 11500, 14: 15000
                            };
                
                            if (this.type === s.wv.PETAL) {
                                petal = this;
                                mob = t;
                            } else {
                                petal = t;
                                mob = this;
                            }
                
                            const mobName = n.ey[mob.index]?.name;
                            if (["Ant Hole", "Fire Ant Hole", "Queen Ant", "Queen Fire Ant", "Tree", "Small Tree"].includes(mobName)) return;
                
                            if (petal.rubyAbility === 1 && mob.type === s.wv.MOB) {
                                if (mob.hasBeenConvertedByRuby) return;
                
                                let highestRubyRarity = (typeof petal.rarity === "number") ? petal.rarity : 0;
                                for (const entity of h.A.entities.values()) {
                                    if (!entity?.inventory) continue;
                                    for (const p of entity.inventory) {
                                        if (p?.rubyAbility === 1 && typeof p.rarity === "number" && p.rarity > highestRubyRarity) {
                                            highestRubyRarity = p.rarity;
                                        }
                                    }
                                }
                
                                setTimeout(() => {
                                    const name = n.ey[mob.index]?.name || "";
                                    const isLeech = name === "Leech";
                                    const isCentipede = !!mob.config?.segment;
                
                                    if (isLeech && mob.head) return;
                
                                    let targetMob = mob;
                                    if (isCentipede && mob.parent && mob.parent.config?.segment) {
                                        targetMob = mob;
                                    } else if (isCentipede && mob.segments && mob.segments.length > 0) {
                                        mob.segments.forEach(seg => seg.destroy());
                                        mob.segments = null;
                                        targetMob = mob;
                                    }
                
                                    if (mob.hasBeenConvertedByRuby) return;
                                    mob.hasBeenConvertedByRuby = true;
                
                                    const mobRarity = (typeof targetMob.rarity === "number") ? targetMob.rarity : 0;
                
                                    const appliedRarity = (mobRarity > highestRubyRarity) ? highestRubyRarity : mobRarity;
                                    const bursts = mob.movesInBursts;
                                    const sines = mob.moveInSines;
                
                                    const position = { x: targetMob.x, y: targetMob.y };
                                    const config = { ...targetMob.config };
                                    if (config.segment && !isLeech) delete config.segment;
                
                                    const newMob = new y(position);
                                    newMob.config = config;
                                    newMob.moveInSines = sines;
                                    newMob.setMovesInBursts = bursts;
                                    newMob.team = petal.parent.team;
                                    newMob.parent = petal.parent;
                                    newMob.friendly = true;
                                    newMob.isConvertedByRuby = true;
                                    newMob.define(config, appliedRarity);
                
                                    if (isLeech && mob.ropeBodies) {
                                        mob.ropeBodies.forEach(r => {
                                            r.head = null;
                                            r.team = petal.parent.team;
                                            r.friendly = true;
                                            if (r.ropeJoint) r.ropeJoint = null;
                                            setTimeout(() => { if (r.destroy) r.destroy(); }, 500 + Math.random() * 500);
                                        });
                                        mob.ropeBodies = [];
                                    }
                
                                    const lifetime = petLifetime[appliedRarity] || 10000;
                                    setTimeout(() => newMob.destroy(), lifetime);
                
                                    h.A.livingMobCount--;
                                }, 0);
                            }
                        }
                    });
                }
                
                const PETALS = [
                    "Basic","Light","Faster","Heavy","Stinger","Rice","Rock","Cactus","Leaf","Wing",
                    "Bone","Dirt","Magnolia","Corn","Sand","Orange","Missile","Pea","Rose","Yin Yang",
                    "Pollen","Honey","Iris","Web","web.mob.launched","Third Eye","Pincer","Beetle Egg",
                    "Antennae","Peas","Stick","scorpion.projectile","Dahlia","Primrose","Fire Spellbook",
                    "Deity","Lightning","Powder","Ant Egg","Yucca","Magnet","Amulet","Jelly","Yggdrasil",
                    "Glass","Dandelion","Sponge","Pearl","Shell","Bubble","Air","Starfish","Fang","Goo",
                    "Maggot Poo","Lightbulb","Battery","Dust","Armor","wasp.projectile","Shrub","projectile.grape",
                    "Grapes","Lantern","web.player.launched","Branch","Leech Egg","Hornet Egg","Candy",
                    "Claw","projectile.diep_bullet","Square Egg","Triangle Egg","Pentagon Egg","Bud",
                    "Fig","Fig.explosion","Amulet of Divergence","Tree","Bloom","Root.mob","Coconut",
                    "husk","Cinderleaf","Cinder.explosion","Root","Emerald","Blood Stinger","Blood Corn",
                    "Blood Light","Ruby","Fire Missile", "fire.projectile", "Sandstone", "missile.projectile",
                    "Moonlit Frog", "SunlitFrog","Ruby Frog", "Moth","Mandible"
                ];
                
                if (skipDrops || !this.givesXP || this.friendly) return;
                
                const sharedXP = [
                    1,3,9,27,81,243,729,2187,6561,40000,300000,
                    3e6,3e7,5e8,1e10,3e11,9e12,27e13,81e14,243e15,
                    7e18,2e20,6e21,18e22,6e24,1.8e26
                ];
                
                const xpToGive = sharedXP[this.rarity] ?? 0;
                h.A.clients.forEach(client => {
                    if (client?.addXP) client.addXP(xpToGive);
                });
                
                
                    if (this._dropsSpawned) return;
                    this._dropsSpawned = true;
                
                    const dropsToSpawn = [];
                    const jackpotDrops = [];
                
                    const dropDefs = n.ey[this.index]?.drops || [];
                    dropDefs.forEach(dropDef => {
                        let table = (this.boss ? bossRarityDropTable : rarityDropTable)[this.rarity] || [];
                        table = table.filter(entry =>
                            entry.rarity >= (dropDef.minRarity ?? 0)
                            && (typeof dropDef.minMobRarity !== "number" || this.rarity >= dropDef.minMobRarity)
                        );
                        if (!table.length) return;
                
                        const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
                        let roll = Math.random() * totalWeight;
                        let result = null;
                        for (const entry of table) {
                            roll -= entry.weight;
                            if (roll <= 0) {
                                result = entry;
                                break;
                            }
                        }
                        if (!result) result = table[table.length - 1];
                
                        const finalTier = result.rarity;
                        const tierChance = dropDef.tiers?.[finalTier]?.chance ?? 1;
                        if (Math.random() > tierChance) return;
                
                        h.A.clients.forEach(client => {
                            const drop = new f(this, client, dropDef.index, finalTier, result.value);
                            dropsToSpawn.push(drop);
                        });
                
                        if (result.jackpot) {
                            jackpotDrops.push({
                                index: dropDef.index,
                                value: result.value,
                                rarity: finalTier
                            });
                        }
                    });
                
                    const baseAngle = Math.random() * Math.PI * 2;
                    dropsToSpawn.forEach((drop, j) => {
                        const angle = baseAngle + (j / dropsToSpawn.length) * Math.PI * 2;
                        drop.x += 30 * Math.cos(angle);
                        drop.y += 30 * Math.sin(angle);
                    });
                
                    h.A.clients.forEach(client => {
                        if (typeof client.addSharedDrop === "function") {
                            dropsToSpawn.forEach(drop => client.addSharedDrop(drop));
                        }
                    });
                
                    jackpotDrops.forEach(drop => {
                        const petalName = PETALS[drop.index] || `Petal_${drop.index}`;
                        const msg = `${this.config.name} dropped a JACKPOT! ×${drop.value} ${petalName}`;
                        h.A.clients.forEach(client => {
                            if (typeof client.systemMessage === "function") {
                                client.systemMessage(msg, s.cK[drop.rarity].color);
                            }
                        });
                    });
                
                    setTimeout(() => { this._dropsSpawned = false; }, 100);
                   
                    if (
                        !this.config.isSystem &&
                        !this.friendly &&
                        !["Queen Ant Egg", "Termite Overmind Egg", "Queen Fire Ant Egg"].includes(this.config.name) &&
                        this.rarity >= h.A.announceRarity
                    ) {
                        let message;
                    
                        const killers = this.getTopDamagers(3, s.wv.PLAYER);
                    
                        if (killers.length > 0) {
                            message = (0, a.Br)(s.cK[this.rarity].name, true) + " " + this.config.name + " was killed by ";
                    
                            for (let i = 0; i < killers.length; i++) {
                                const killerData = killers[i];
                                const killerClient = h.A.clients.get(killerData.clientID);
                                if (!killerClient) continue;
                    
                                const username = killerClient.username;
                                const total = killers.length;
                    
                                if (i === total - 1) {
                                    message += total === 1 ? username : total === 2 ? " and " + username : ", and " + username;
                                } else {
                                    message += i === 0 ? username : ", " + username;
                                }
                            }
                        } else {
                            message = (0, a.Br)(s.cK[this.rarity].name, true) + " " + this.config.name + " despawned";
                        }
                    
                        h.A.clients.forEach(client => client.systemMessage(message, s.cK[this.rarity].color));
                    }
                }
            }
            class f {
                static idAccumulator = 1;
                constructor(t={
                    x: 0,
                    y: 0
                }, e, i, s, value = 1) {
                    this.id = f.idAccumulator++,
                    this.x = t.x,
                    this.y = t.y,
                    this.client = e,
                    this.size = 30,
                    this.index = i,
                    this.rarity = s,
                    this.value = value;
                    this.lifetime = 100e3 * Math.pow(1.2, s),
                    this.creation = performance.now(),
                    this.client.addDrop(this),
                    h.A.drops.set(this.id, this)
                }
                update() {
                    if (this.creation + this.lifetime < performance.now() && this.destroy(),
                    null === this.client.body || this.client.body.health.isDead)
                        return;
                    const t = this.x - this.client.body.x
                      , e = this.y - this.client.body.y;
                    t * t + e * e < Math.pow(this.size + this.client.body.size + this.client.body.extraPickupRange, 2) && this.client.pickupDrop(this) && this.destroy()
                }
                destroy() {
                    this.client.removeDrop(this),
                    h.A.drops.delete(this.id)
                }
            }
            class A {
                static idAccum = 1;
                constructor(t, e, i, s, a=t.rarity ?? 0) {
                    this.id = A.idAccum++,
                    this.parent = t,
                    this.x = e.x,
                    this.y = e.y,
                    this.size = i,
                    this.createdAt = Date.now(),
                    this.timer = s,
                    this.rarity = a,
                    h.A.pentagrams.set(this.id, this),
                    setTimeout(this.destroy.bind(this), s),
                    this.damage = Math.pow(this.rarity + 1, 3),
                    this.poisonDamage = .5 / 22.5 * Math.pow(this.rarity + 1, 3),
                    this.poisonTime = 112.5,
                    this.speedDebuff = .75,
                    this.speedDebuffTime = 112.5
                }
                define(t, e, i, s, a) {
                    return this.damage = t,
                    this.poisonDamage = e,
                    this.poisonTime = i,
                    this.speedDebuff = s,
                    this.speedDebuffTime = a,
                    this
                }
                destroy() {
                    h.A.pentagrams.delete(this.id),
                    this.parent.health.isDead || h.A.entities.forEach((t => {
                        if (t.parent.id === this.parent.id || t.parent.team === this.parent.team)
                            return;
                        const e = this.x - t.x
                          , i = this.y - t.y;
                        e * e + i * i < this.size * this.size && (t.health.damage(this.damage),
                        t.parent && "Leech" === t.config?.name ? (t.parent.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                        t.parent.damagedBy[this.parent.id][0] += this.damage) : (t.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                        t.damagedBy[this.parent.id][0] += this.damage),
                        t.poison.timer = this.poisonTime,
                        t.poison.damage = this.poisonDamage,
                        t.speedDebuff.timer = this.speedDebuffTime,
                        t.speedDebuff.multiplier = this.speedDebuff)
                    }
                    ))
                }
            }
            class w {
                static idAccum = 1;
                constructor(t) {
                    this.id = w.idAccum++,
                    this.parent = t,
                    this.points = [{
                        x: t.x,
                        y: t.y,
                        id: -1
                    }],
                    this.damage = 0,
                    this.range = 0,
                    this.bounces = 0,
                    this.remainTick = 3,
                    h.A.lightning.set(this.id, this)
                }
                define(t, e, i) {
                    return this.damage = t,
                    this.range = e,
                    this.bounces = i,
                    this
                }
                bounce() {
                    for (let t = 0; t < this.bounces; t++) {
                        const t = this.points[this.points.length - 1]
                          , e = h.A.spatialHash.retrieve({
                            _AABB: {
                                x1: t.x - this.range,
                                y1: t.y - this.range,
                                x2: t.x + this.range,
                                y2: t.y + this.range
                            }
                        });
                        let i = null
                          , a = 1 / 0;
                        if (e.forEach((e => {
                            if (e.parent.id === this.parent.id || e.parent.team === this.parent.team || this.points.some((t => t.id === e.id)) || e.type === s.wv.PETAL && !e.attractsLightning)
                                return;
                            if (e.type === s.wv.PETAL)
                                return i = e,
                                void (a = 0);
                            const n = t.x - e.x
                              , h = t.y - e.y
                              , r = n * n + h * h;
                            r < a && (i = e,
                            a = r)
                        }
                        )),
                        null === i)
                            break;
                        if (this.points.push({
                            x: i.x,
                            y: i.y,
                            id: i.id
                        }),
                        i.type === s.wv.PETAL)
                            break
                    }
                    for (let t = 1; t < this.points.length; t++) {
                        const e = h.A.entities.get(this.points[t].id);
                        if (e) {
                            if (e.type === s.wv.PLAYER) {
                                this.points[t].x += Math.random() * e.size * 2 - e.size,
                                this.points[t].y += Math.random() * e.size * 2 - e.size;
                                if ((0,
                                a.t1)(this.points[t], e) > e.size * e.size)
                                    continue
                            }
                            e.health.damage(this.damage),
                            e.parent && "Leech" === e.config?.name ? (e.parent.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                            e.parent.damagedBy[this.parent.id][0] += this.damage) : (e.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                            e.damagedBy[this.parent.id][0] += this.damage),
                            e.type === s.wv.MOB && e.neutral && (e.target = this.parent)
                        }
                    }
                }
                update() {
                    this.remainTick-- <= 0 && this.destroy()
                }
                destroy() {
                    h.A.lightning.delete(this.id)
                }
            }
            class b {
                constructor(t, e, i, s, a) {
                    this.numSides = t.length,
                    this.numPoints = 2 * this.numSides,
                    this.sides = new Float32Array(this.numPoints),
                    this.points = new Float32Array(this.numPoints),
                    this.x = 0,
                    this.y = 0,
                    this.radius = 0,
                    this.rotation = 0,
                    this._AABB = {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    };
                    for (let e = 0; e < this.numSides; e++)
                        this.sides[2 * e] = t[e].x,
                        this.sides[2 * e + 1] = t[e].y;
                    this.transform(e, i, s, a)
                }
                transform(t, e, i, s) {
                    if (this.x === t && this.y === e && this.radius === i && this.rotation === s)
                        return;
                    const a = Math.cos(s)
                      , n = Math.sin(s);
                    for (let s = 0; s < this.numPoints; s += 2) {
                        const h = this.sides[s]
                          , r = this.sides[s + 1];
                        this.points[s] = t + (h * a - r * n) * i,
                        this.points[s + 1] = e + (h * n + r * a) * i
                    }
                    this.x = t,
                    this.y = e,
                    this.radius = i,
                    this.rotation = s,
                    this._AABB = this.getAABB()
                }
                getAABB() {
                    let t = 1 / 0
                      , e = 1 / 0
                      , i = -1 / 0
                      , s = -1 / 0;
                    for (let a = 0; a < this.numPoints; a += 2) {
                        const n = this.points[a]
                          , h = this.points[a + 1];
                        n < t && (t = n),
                        h < e && (e = h),
                        n > i && (i = n),
                        h > s && (s = h)
                    }
                    return {
                        x1: t,
                        y1: e,
                        x2: i,
                        y2: s
                    }
                }
                pointIsInside(t, e) {
                    let i = !1
                      , s = this.points[this.numPoints - 2]
                      , a = this.points[this.numPoints - 1];
                    for (let n = 0; n < this.numPoints; n += 2) {
                        let h = this.points[n]
                          , r = this.points[n + 1];
                        e < a != e < r && t < (h - s) * (e - a) / (r - a) + s && (i = !i),
                        s = h,
                        a = r
                    }
                    return i
                }
                circleIntersectsEdge(t, e, i, s, a, n, h) {
                    const r = i - t
                      , o = s - e
                      , l = a - t
                      , d = n - e
                      , c = Math.max(0, Math.min(1, (r * l + o * d) / (r * r + o * o)))
                      , g = t + r * c - a
                      , p = e + o * c - n;
                    return g * g + p * p <= h * h
                }
                circleIntersects(t, e, i) {
                    if (this.pointIsInside(t, e))
                        return !0;
                    for (let s = 0; s < this.numPoints; s += 2)
                        if (this.circleIntersectsEdge(this.points[s], this.points[s + 1], this.points[(s + 2) % this.numPoints], this.points[(s + 3) % this.numPoints], t, e, i))
                            return !0;
                    return !1
                }
                getClosestPointOnEdge(t, e, i, s, a, n) {
                    const h = i - t
                      , r = s - e
                      , o = (h * (a - t) + r * (n - e)) / (h * h + r * r)
                      , l = Math.max(0, Math.min(1, o));
                    return {
                        x: t + h * l,
                        y: e + r * l
                    }
                }
                resolve(t, e, i) {
                    i += 3;
                    let s = 1 / 0
                      , a = null;
                    for (let i = 0; i < this.numPoints; i += 2) {
                        const n = this.getClosestPointOnEdge(this.points[i], this.points[i + 1], this.points[(i + 2) % this.numPoints], this.points[(i + 3) % this.numPoints], t, e)
                          , h = n.x - t
                          , r = n.y - e
                          , o = h * h + r * r;
                        o < s && (s = o,
                        a = n)
                    }
                    const n = a.x - t
                      , h = a.y - e
                      , r = Math.atan2(h, n);
                    t = a.x - Math.cos(r) * i,
                    e = a.y - Math.sin(r) * i;
                    let o = Math.atan2(e - a.y, t - a.x);
                    return this.pointIsInside(t, e) && (o += Math.PI),
                    {
                        x: a.x + Math.cos(o) * i,
                        y: a.y + Math.sin(o) * i,
                        angle: o
                    }
                }
            }
            class M {
                static idAccum = 1;
                constructor(t, e, i) {
                    this.id = M.idAccum++,
                    this.x = t.x,
                    this.y = t.y,
                    this.size = e;
                    const a = (0,
                    s.ai)(i);
                    this.type = a.id,
                    this.polygon = new b(a.terrain,this.x,this.y,this.size,0),
                    this.gridX = 0,
                    this.gridY = 0,
                    h.A.terrain.set(this.id, this)
                }
                destroy() {
                    h.A.terrain.delete(this.id),
                    h.A.updateTerrain()
                }
            }
        }
    }, n = {};
    function h(t) {
        var e = n[t];
        if (void 0 !== e)
            return e.exports;
        var i = n[t] = {
            exports: {}
        };
        return a[t](i, i.exports, h),
        i.exports
    }
    t = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__",
    e = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__",
    i = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__",
    s = t => {
        t && t.d < 1 && (t.d = 1,
        t.forEach((t => t.r--)),
        t.forEach((t => t.r-- ? t.r++ : t())))
    }
    ,
    h.a = (a, n, h) => {
        var r;
        h && ((r = []).d = -1);
        var o, l, d, c = new Set, g = a.exports, p = new Promise(( (t, e) => {
            d = e,
            l = t
        }
        ));
        p[e] = g,
        p[t] = t => (r && t(r),
        c.forEach(t),
        p.catch((t => {}
        ))),
        a.exports = p,
        n((a => {
            var n;
            o = (a => a.map((a => {
                if (null !== a && "object" == typeof a) {
                    if (a[t])
                        return a;
                    if (a.then) {
                        var n = [];
                        n.d = 0,
                        a.then((t => {
                            h[e] = t,
                            s(n)
                        }
                        ), (t => {
                            h[i] = t,
                            s(n)
                        }
                        ));
                        var h = {};
                        return h[t] = t => t(n),
                        h
                    }
                }
                var r = {};
                return r[t] = t => {}
                ,
                r[e] = a,
                r
            }
            )))(a);
            var h = () => o.map((t => {
                if (t[i])
                    throw t[i];
                return t[e]
            }
            ))
              , l = new Promise((e => {
                (n = () => e(h)).r = 0;
                var i = t => t !== r && !c.has(t) && (c.add(t),
                t && !t.d && (n.r++,
                t.push(n)));
                o.map((e => e[t](i)))
            }
            ));
            return n.r ? l : h()
        }
        ), (t => (t ? d(p[i] = t) : l(g),
        s(r)))),
        r && r.d < 0 && (r.d = 0)
    }
    ,
    h.d = (t, e) => {
        for (var i in e)
            h.o(e, i) && !h.o(t, i) && Object.defineProperty(t, i, {
                enumerable: !0,
                get: e[i]
            })
    }
    ,
    h.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
    h(58)
}
)();
 