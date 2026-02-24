/**
 * Massive Balance & Content Update Script
 * - Adds new stores for progressive zones
 * - Assigns stores to NPCs
 * - Adds tier-based drop tables
 * - Adds drops to all mobs based on level
 * - Adds spawn overrides for area scaling
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'packages', 'server', 'data');

function readJSON(file) {
    return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
}

function writeJSON(file, data) {
    fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 4) + '\n');
    console.log(`Updated ${file}`);
}

// ============================================================
// 1. STORES - Add 6 new progressive zone stores
// ============================================================
let stores = readJSON('stores.json');

// Mid-level store (Bronze/Iron bridge, Lv 5-10)
stores.midshop = {
    items: [
        { key: "flask", count: -1, price: 50 },
        { key: "manaflask", count: -1, price: 40 },
        { key: "bigflask", count: -1, price: 200 },
        { key: "arrow", count: -1, price: 3 },
        { key: "firearrow", count: -1, price: 15 },
        { key: "bronzesword", count: 5, price: 1200 },
        { key: "bronzespear", count: 5, price: 1400 },
        { key: "bronzescythe", count: 3, price: 1600 },
        { key: "bronzebattleaxe", count: 3, price: 1800 },
        { key: "bronzehelmet", count: 5, price: 800 },
        { key: "bronzechestplate", count: 5, price: 1000 },
        { key: "bronzelegplates", count: 5, price: 900 },
        { key: "bronzeboots", count: 5, price: 700 },
        { key: "coppershield", count: 5, price: 400 },
        { key: "ironsword", count: 2, price: 5000 },
        { key: "ironhelmet", count: 2, price: 4000 },
        { key: "shardt1", count: 10, price: 800 },
        { key: "pendant1", count: 3, price: 800 }
    ],
    refresh: 60000,
    currency: "gold"
};

// Elf forest store (Nisoc/Cinnabar, Lv 15-25)
stores.elfshop = {
    items: [
        { key: "flask", count: -1, price: 50 },
        { key: "manaflask", count: -1, price: 40 },
        { key: "bigflask", count: -1, price: 200 },
        { key: "bigmanaflask", count: -1, price: 180 },
        { key: "arrow", count: -1, price: 3 },
        { key: "firearrow", count: -1, price: 15 },
        { key: "poisonarrow", count: -1, price: 25 },
        { key: "nisocsword", count: 3, price: 12000 },
        { key: "cinnabarsword", count: 3, price: 18000 },
        { key: "ironspear", count: 5, price: 6000 },
        { key: "ironscythe", count: 5, price: 7000 },
        { key: "ironbattleaxe", count: 3, price: 8000 },
        { key: "ironhelmet", count: 5, price: 4000 },
        { key: "ironchestplate", count: 5, price: 5500 },
        { key: "ironlegplates", count: 5, price: 3200 },
        { key: "ironboots", count: 5, price: 3000 },
        { key: "ironshield", count: 5, price: 3500 },
        { key: "ironring", count: 3, price: 5000 },
        { key: "shardt1", count: 10, price: 800 },
        { key: "shardt2", count: 5, price: 3000 }
    ],
    refresh: 90000,
    currency: "gold"
};

// Ice region store (Pythar/Ibo, Lv 25-45)
stores.iceshop = {
    items: [
        { key: "bigflask", count: -1, price: 200 },
        { key: "bigmanaflask", count: -1, price: 180 },
        { key: "burger", count: -1, price: 350 },
        { key: "firearrow", count: -1, price: 15 },
        { key: "icearrow", count: -1, price: 30 },
        { key: "poisonarrow", count: -1, price: 25 },
        { key: "pytharsword", count: 3, price: 30000 },
        { key: "goldsword", count: 3, price: 20000 },
        { key: "goldspear", count: 3, price: 22000 },
        { key: "goldscythe", count: 2, price: 25000 },
        { key: "goldbattleaxe", count: 2, price: 28000 },
        { key: "goldhelmet", count: 3, price: 18000 },
        { key: "goldchestplate", count: 3, price: 24000 },
        { key: "goldlegplates", count: 3, price: 15000 },
        { key: "goldboots", count: 3, price: 14000 },
        { key: "goldshield", count: 3, price: 16000 },
        { key: "goldaxe", count: 3, price: 12000 },
        { key: "goldpickaxe", count: 3, price: 12000 },
        { key: "shardt2", count: 10, price: 2500 },
        { key: "shardt3", count: 5, price: 8000 },
        { key: "ironring", count: 3, price: 5000 }
    ],
    refresh: 90000,
    currency: "gold"
};

// Desert store (Ibo/high tier, Lv 40-60)
stores.desertshop = {
    items: [
        { key: "bigflask", count: -1, price: 200 },
        { key: "bigmanaflask", count: -1, price: 180 },
        { key: "burger", count: -1, price: 350 },
        { key: "icearrow", count: -1, price: 30 },
        { key: "lightningarrow", count: -1, price: 40 },
        { key: "ibosword", count: 2, price: 45000 },
        { key: "cobaltspear", count: 2, price: 50000 },
        { key: "cobaltscythe", count: 2, price: 55000 },
        { key: "cobalthelmet", count: 2, price: 40000 },
        { key: "cobaltchestplate", count: 2, price: 55000 },
        { key: "cobaltlegplates", count: 2, price: 35000 },
        { key: "cobaltshield", count: 2, price: 38000 },
        { key: "goldaxe", count: 3, price: 12000 },
        { key: "goldpickaxe", count: 3, price: 12000 },
        { key: "shardt3", count: 10, price: 6000 },
        { key: "shardt4", count: 3, price: 20000 },
        { key: "nisocring", count: 2, price: 25000 },
        { key: "greenpendant", count: 2, price: 15000 }
    ],
    refresh: 120000,
    currency: "gold"
};

// Lava/endgame store (Endgame, Lv 60+)
stores.lavashop = {
    items: [
        { key: "bigflask", count: -1, price: 200 },
        { key: "bigmanaflask", count: -1, price: 180 },
        { key: "burger", count: -1, price: 350 },
        { key: "lightningarrow", count: -1, price: 40 },
        { key: "cobaltbattleaxe", count: 2, price: 70000 },
        { key: "cobaltspear", count: 2, price: 60000 },
        { key: "cobaltscythe", count: 2, price: 65000 },
        { key: "cobalthelmet", count: 2, price: 50000 },
        { key: "cobaltchestplate", count: 2, price: 65000 },
        { key: "cobaltlegplates", count: 2, price: 42000 },
        { key: "cobaltshield", count: 2, price: 45000 },
        { key: "cobaltaxe", count: 2, price: 35000 },
        { key: "cobaltpickaxe", count: 2, price: 35000 },
        { key: "shardt4", count: 5, price: 18000 },
        { key: "pytharring", count: 2, price: 35000 },
        { key: "greenpendant", count: 2, price: 15000 },
        { key: "goldring", count: 2, price: 20000 }
    ],
    refresh: 120000,
    currency: "gold"
};

// Herb/potion shop
stores.herbshop = {
    items: [
        { key: "flask", count: -1, price: 40 },
        { key: "manaflask", count: -1, price: 35 },
        { key: "bigflask", count: -1, price: 180 },
        { key: "bigmanaflask", count: -1, price: 160 },
        { key: "burger", count: -1, price: 300 },
        { key: "cure", count: 10, price: 500 },
        { key: "firepotion", count: 5, price: 800 },
        { key: "hotsauce", count: 10, price: 250 },
        { key: "blackpotion", count: 5, price: 600 }
    ],
    refresh: 60000,
    currency: "gold"
};

writeJSON('stores.json', stores);

// ============================================================
// 2. NPCs - Assign stores to NPCs
// ============================================================
let npcs = readJSON('npcs.json');

// Blacksmith → ironshop
npcs.blacksmith.store = "ironshop";
npcs.blacksmith.text = ["무기와 방어구를 팝니다. 둘러보세요!"];

// Blacksmith2 → goldshop
npcs.blacksmith2.store = "goldshop";
npcs.blacksmith2.text = ["최고급 금 장비를 다루는 대장장이입니다."];

// Elf NPC → eliteshop
npcs.elfnpc.store = "eliteshop";
npcs.elfnpc.text = ["엘프의 비밀 장비들입니다. 강한 자만이 사용할 수 있습니다."];

// Ice elf NPC → iceshop
npcs.iceelfnpc.store = "iceshop";
npcs.iceelfnpc.text = ["얼음 땅의 장비들입니다. 추위를 견딜 수 있으세요?"];

// Desert NPC → desertshop
npcs.desertnpc.store = "desertshop";
npcs.desertnpc.text = ["사막의 열기를 견딘 장비들을 팝니다."];

// Lava NPC → lavashop
npcs.lavanpc.store = "lavashop";
npcs.lavanpc.text = ["용암에서 단련된 최강의 장비... 가져가세요..."];

// Santa elf NPC → elfshop
npcs.santaelfnpc.store = "elfshop";
npcs.santaelfnpc.text = ["엘프 숲의 장비들이에요! 구경하세요."];

// Herbalist → herbshop
npcs.herbalist.store = "herbshop";
npcs.herbalist.text = ["약초로 만든 포션과 물약을 팝니다."];

// Green storeman → midshop
npcs.greenstoremannpc = {
    name: "잡화 상인",
    store: "midshop",
    text: ["청동과 철 장비를 팝니다. 둘러보세요!"]
};

writeJSON('npcs.json', npcs);

// ============================================================
// 3. DROP TABLES - Add tier-based drop tables
// ============================================================
let tables = readJSON('tables.json');

// Bronze tier drops
tables.bronzedrops = {
    drops: [
        { key: "bronzesword", chance: 2000 },
        { key: "bronzespear", chance: 2000 },
        { key: "bronzescythe", chance: 1500 },
        { key: "bronzehelmet", chance: 2500 },
        { key: "bronzechestplate", chance: 2000 },
        { key: "bronzelegplates", chance: 2000 },
        { key: "bronzeboots", chance: 2500 }
    ]
};

// Iron tier drops
tables.irondrops = {
    drops: [
        { key: "ironsword", chance: 1500 },
        { key: "ironspear", chance: 1500 },
        { key: "ironscythe", chance: 1200 },
        { key: "ironbattleaxe", chance: 1000 },
        { key: "ironhelmet", chance: 2000 },
        { key: "ironchestplate", chance: 1500 },
        { key: "ironlegplates", chance: 1500 },
        { key: "ironboots", chance: 2000 },
        { key: "ironshield", chance: 1500 },
        { key: "ironring", chance: 500 }
    ]
};

// Gold tier drops
tables.golddrops = {
    drops: [
        { key: "goldsword", chance: 800 },
        { key: "goldspear", chance: 800 },
        { key: "goldscythe", chance: 600 },
        { key: "goldbattleaxe", chance: 500 },
        { key: "goldhelmet", chance: 1000 },
        { key: "goldchestplate", chance: 800 },
        { key: "goldlegplates", chance: 800 },
        { key: "goldboots", chance: 1000 },
        { key: "goldshield", chance: 800 }
    ]
};

// Cobalt tier drops
tables.cobaltdrops = {
    drops: [
        { key: "cobaltspear", chance: 400 },
        { key: "cobaltscythe", chance: 350 },
        { key: "cobaltbattleaxe", chance: 300 },
        { key: "cobalthelmet", chance: 500 },
        { key: "cobaltchestplate", chance: 400 },
        { key: "cobaltlegplates", chance: 400 },
        { key: "cobaltshield", chance: 500 }
    ]
};

// Rare sword drops (nisoc/cinnabar/pythar/ibo)
tables.rareswords = {
    drops: [
        { key: "nisocsword", chance: 300 },
        { key: "cinnabarsword", chance: 200 },
        { key: "pytharsword", chance: 100 },
        { key: "ibosword", chance: 50 }
    ]
};

// Ring/pendant drops
tables.accessories = {
    drops: [
        { key: "pendant1", chance: 1500 },
        { key: "ring1", chance: 1500 },
        { key: "bronzering", chance: 800 },
        { key: "ironring", chance: 400 },
        { key: "nisocring", chance: 100 },
        { key: "greenpendant", chance: 200 }
    ]
};

// Enhanced gold drops (more gold for harder mobs)
tables.richdrops = {
    drops: [
        { key: "gold", chance: 50000 },
        { key: "bigflask", chance: 15000 },
        { key: "bigmanaflask", chance: 12000 },
        { key: "burger", chance: 8000 },
        { key: "cure", chance: 5000 }
    ]
};

writeJSON('tables.json', tables);

// ============================================================
// 4. MOBS - Add/update drops based on level
// ============================================================
let mobs = readJSON('mobs.json');

// Define drop tiers by level ranges
function getDropTablesForLevel(level, existingTables) {
    let tables = existingTables ? [...existingTables] : [];

    // Ensure ordinary drops
    if (!tables.includes('ordinary')) tables.push('ordinary');

    if (level >= 5 && !tables.includes('bronzedrops')) tables.push('bronzedrops');
    if (level >= 10 && !tables.includes('irondrops')) tables.push('irondrops');
    if (level >= 12 && !tables.includes('arrows')) tables.push('arrows');
    if (level >= 20 && !tables.includes('golddrops')) tables.push('golddrops');
    if (level >= 25 && !tables.includes('shards')) tables.push('shards');
    if (level >= 30 && !tables.includes('rareswords')) tables.push('rareswords');
    if (level >= 40 && !tables.includes('cobaltdrops')) tables.push('cobaltdrops');
    if (level >= 50 && !tables.includes('richdrops')) tables.push('richdrops');
    if (level >= 35 && !tables.includes('accessories')) tables.push('accessories');

    return tables;
}

// Track which mobs we updated
let updatedCount = 0;

// Skip NPCs and non-combat entities
let skipKeys = ['king', 'king2', 'prisoner', 'coder', 'rick', 'rickgf', 'nyan', 'rick2'];

for (let [key, mob] of Object.entries(mobs)) {
    if (skipKeys.includes(key)) continue;
    if (!mob.level || !mob.hitPoints) continue;

    let level = mob.level;

    // Update dropTables based on level
    let newTables = getDropTablesForLevel(level, mob.dropTables);

    // Only update if tables changed
    if (JSON.stringify(newTables) !== JSON.stringify(mob.dropTables || [])) {
        mob.dropTables = newTables;
        updatedCount++;
    }

    // Add gold drops to mobs that don't have explicit gold in their drops
    if (!mob.drops) mob.drops = [];
    let hasGold = mob.drops.some(d => d.key === 'gold');
    if (!hasGold && level >= 3) {
        // Scale gold drop chance and amount with level
        let goldChance = Math.min(25000, 5000 + level * 200);
        mob.drops.push({ key: "gold", chance: goldChance });
    }

    // Add flask drops to higher level mobs
    let hasFlask = mob.drops.some(d => d.key === 'flask' || d.key === 'bigflask');
    if (!hasFlask && level >= 10) {
        mob.drops.push({ key: "bigflask", chance: 5000 });
    }
    if (!hasFlask && level >= 30) {
        mob.drops.push({ key: "bigmanaflask", chance: 4000 });
    }
}

console.log(`Updated ${updatedCount} mob drop tables`);
writeJSON('mobs.json', mobs);

// ============================================================
// 5. SPAWNS - Add zone-based spawn overrides
// ============================================================
let spawns = readJSON('spawns.json');

// Helper to get mob coordinates from map
let map = require(path.join(DATA, 'map', 'world.json'));
let entityCoords = {};
for (let [k, val] of Object.entries(map.entities || {})) {
    let idx = parseInt(k);
    let x = idx % map.width;
    let y = Math.floor(idx / map.width);
    if (!entityCoords[val]) entityCoords[val] = [];
    entityCoords[val].push({ x, y });
}

// Function to create spawn override
function addSpawn(x, y, override) {
    let key = `${x}-${y}`;
    if (!(key in spawns)) {
        spawns[key] = override;
    }
}

// ---- Zone 1: Starting area (y > 800) - Make some mobs into minibosses ----
// Dark skeleton bosses in the south
let darkSkeletons = entityCoords['darkskeleton'] || [];
let southDarkSkeletons = darkSkeletons.filter(c => c.y > 800);
if (southDarkSkeletons.length > 0) {
    let boss = southDarkSkeletons[0];
    addSpawn(boss.x, boss.y, {
        name: "해골 대장",
        miniboss: true,
        level: 50,
        hitPoints: 800,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldhelmet", chance: 3000 },
            { key: "goldchestplate", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "shards", "accessories"]
    });
}

// Living armor bosses
let livingArmor = entityCoords['livingarmor'] || [];
for (let i = 0; i < Math.min(3, livingArmor.length); i++) {
    let la = livingArmor[i];
    addSpawn(la.x, la.y, {
        name: "저주받은 갑옷",
        miniboss: true,
        level: 65,
        hitPoints: 1200,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobaltchestplate", chance: 1500 },
            { key: "cobalthelmet", chance: 2000 },
            { key: "cobaltshield", chance: 2000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "shards", "accessories"]
    });
}

// Dark wolves - make some into alpha wolves
let darkWolves = entityCoords['darkwolf'] || [];
if (darkWolves.length > 3) {
    addSpawn(darkWolves[0].x, darkWolves[0].y, {
        name: "알파 늑대",
        miniboss: true,
        level: 55,
        hitPoints: 900,
        aggressive: true,
        aggroRange: 8,
        attackRate: 700,
        drops: [
            { key: "ibosword", chance: 2000 },
            { key: "cobaltspear", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords"]
    });
    addSpawn(darkWolves[3].x, darkWolves[3].y, {
        name: "검은 늑대 대장",
        miniboss: true,
        level: 60,
        hitPoints: 1000,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobaltscythe", chance: 2500 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "accessories"]
    });
}

// Dark ogre bosses
let darkOgres = entityCoords['darkogre'] || [];
for (let i = 0; i < Math.min(2, darkOgres.length); i++) {
    addSpawn(darkOgres[i].x, darkOgres[i].y, {
        name: "암흑 오우거 족장",
        miniboss: true,
        level: 70,
        hitPoints: 1500,
        aggressive: true,
        aggroRange: 8,
        drops: [
            { key: "cobaltbattleaxe", chance: 2000 },
            { key: "cobaltchestplate", chance: 1500 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// ---- Zone 2: Mid-south area (y 600-750) - Ant colonies, crystal scorpions ----
let ants = entityCoords['ant'] || [];
let southAnts = ants.filter(c => c.y >= 650 && c.y < 700);
if (southAnts.length > 5) {
    addSpawn(southAnts[0].x, southAnts[0].y, {
        name: "여왕개미 호위병",
        miniboss: true,
        level: 52,
        hitPoints: 750,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldchestplate", chance: 2500 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "golddrops", "shards"]
    });
}

// Soldier ant bosses
let soldierAnts = entityCoords['soldierant'] || [];
if (soldierAnts.length > 3) {
    addSpawn(soldierAnts[0].x, soldierAnts[0].y, {
        name: "개미 장군",
        miniboss: true,
        level: 58,
        hitPoints: 950,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldbattleaxe", chance: 3000 },
            { key: "goldlegplates", chance: 3000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "golddrops", "cobaltdrops", "accessories"]
    });
}

// Crystal scorpion bosses
let crystalScorps = entityCoords['crystalscorpion'] || [];
if (crystalScorps.length > 5) {
    addSpawn(crystalScorps[0].x, crystalScorps[0].y, {
        name: "수정 전갈 여왕",
        miniboss: true,
        level: 55,
        hitPoints: 900,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "pytharsword", chance: 3000 },
            { key: "nisocring", chance: 1000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "golddrops", "rareswords", "accessories"]
    });
}

// Ice wizard bosses
let iceWizards = entityCoords['icewizard'] || [];
let southIceWiz = iceWizards.filter(c => c.y >= 580 && c.y < 650);
if (southIceWiz.length > 5) {
    addSpawn(southIceWiz[0].x, southIceWiz[0].y, {
        name: "빙결 대마법사",
        miniboss: true,
        level: 60,
        hitPoints: 1000,
        aggressive: true,
        aggroRange: 8,
        attackRange: 5,
        projectileName: "iceball",
        drops: [
            { key: "ibosword", chance: 2000 },
            { key: "cobalthelmet", chance: 2000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords"]
    });
}

// Hermit crab bosses
let hermitCrabs = entityCoords['hermitcrab'] || [];
if (hermitCrabs.length > 3) {
    addSpawn(hermitCrabs[0].x, hermitCrabs[0].y, {
        name: "고대 소라게",
        miniboss: true,
        level: 45,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 5,
        drops: [
            { key: "goldshield", chance: 4000 },
            { key: "goldboots", chance: 4000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "shards"]
    });
}

// Pirate skeleton area bosses
let pirateSkeletons = entityCoords['pirateskeleton'] || [];
if (pirateSkeletons.length > 3) {
    addSpawn(pirateSkeletons[0].x, pirateSkeletons[0].y, {
        name: "해적 선장",
        miniboss: true,
        level: 48,
        hitPoints: 800,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldsword", chance: 4000 },
            { key: "goldring", chance: 1500 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["ordinary", "unusual", "golddrops", "accessories"]
    });
}

// ---- Zone 3: Central area (y 400-600) - Dark zone ----
let miniDragons = entityCoords['minidragon'] || [];
let centralDragons = miniDragons.filter(c => c.y >= 400 && c.y < 600);
if (centralDragons.length > 3) {
    addSpawn(centralDragons[0].x, centralDragons[0].y, {
        name: "화염 드래곤",
        miniboss: true,
        level: 65,
        hitPoints: 1300,
        aggressive: true,
        aggroRange: 8,
        attackRange: 4,
        projectileName: "fireball2",
        drops: [
            { key: "cobaltbattleaxe", chance: 2000 },
            { key: "cobaltchestplate", chance: 1500 },
            { key: "pytharring", chance: 800 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Yellow bat area boss
let yellowBats = entityCoords['yellowbat'] || [];
if (yellowBats.length > 5) {
    addSpawn(yellowBats[0].x, yellowBats[0].y, {
        name: "황금 박쥐왕",
        miniboss: true,
        level: 42,
        hitPoints: 650,
        aggressive: true,
        aggroRange: 7,
        attackRate: 800,
        drops: [
            { key: "goldhelmet", chance: 4000 },
            { key: "goldring2", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "accessories"]
    });
}

// Zombie area boss
let zombies = entityCoords['zombie'] || [];
if (zombies.length > 3) {
    addSpawn(zombies[0].x, zombies[0].y, {
        name: "좀비 군주",
        miniboss: true,
        level: 50,
        hitPoints: 850,
        aggressive: true,
        aggroRange: 6,
        poisonous: true,
        drops: [
            { key: "goldscythe", chance: 3000 },
            { key: "goldlegplates", chance: 3000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "golddrops", "shards"]
    });
}

// Green cockroach area boss
let greenCockroaches = entityCoords['greencockroach'] || [];
if (greenCockroaches.length > 3) {
    addSpawn(greenCockroaches[0].x, greenCockroaches[0].y, {
        name: "거대 바퀴벌레",
        miniboss: true,
        level: 40,
        hitPoints: 600,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "ironring", chance: 3000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "golddrops", "irondrops"]
    });
}

// Mantis area boss
let mantises = entityCoords['mantis'] || [];
if (mantises.length > 3) {
    addSpawn(mantises[0].x, mantises[0].y, {
        name: "사마귀 여왕",
        miniboss: true,
        level: 48,
        hitPoints: 750,
        aggressive: true,
        aggroRange: 7,
        attackRate: 700,
        drops: [
            { key: "goldscythe", chance: 4000 },
            { key: "cinnabarsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "golddrops", "rareswords"]
    });
}

// ---- Zone 4: MidNorth area (y 250-400) - Forest/Ice/Snow ----
// Wolf pack alpha
let wolves = entityCoords['wolf'] || [];
if (wolves.length > 10) {
    addSpawn(wolves[0].x, wolves[0].y, {
        name: "늑대 우두머리",
        miniboss: true,
        level: 35,
        hitPoints: 550,
        aggressive: true,
        aggroRange: 7,
        attackRate: 800,
        drops: [
            { key: "goldsword", chance: 2000 },
            { key: "goldboots", chance: 3000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "golddrops", "shards"]
    });
}

// Orc chieftain
let orcs = entityCoords['orc'] || [];
if (orcs.length > 5) {
    addSpawn(orcs[0].x, orcs[0].y, {
        name: "오크 족장",
        miniboss: true,
        level: 38,
        hitPoints: 600,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldbattleaxe", chance: 2500 },
            { key: "goldchestplate", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "unusual", "irondrops", "golddrops", "shards"]
    });
}

// Snow wolf alpha
let snowWolves = entityCoords['snowwolf'] || [];
if (snowWolves.length > 5) {
    addSpawn(snowWolves[0].x, snowWolves[0].y, {
        name: "백은 늑대",
        miniboss: true,
        level: 40,
        hitPoints: 650,
        aggressive: true,
        aggroRange: 7,
        attackRate: 750,
        drops: [
            { key: "goldspear", chance: 3000 },
            { key: "goldhelmet", chance: 3000 },
            { key: "nisocsword", chance: 1500 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "accessories"]
    });
}

// Ice golem boss
let iceGolems = entityCoords['icegolem'] || [];
let northIceGolems = iceGolems.filter(c => c.y < 350);
if (northIceGolems.length > 5) {
    addSpawn(northIceGolems[0].x, northIceGolems[0].y, {
        name: "빙결 골렘 수호자",
        miniboss: true,
        level: 50,
        hitPoints: 900,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobalthelmet", chance: 2000 },
            { key: "cobaltshield", chance: 2000 },
            { key: "pytharsword", chance: 1500 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "golddrops", "cobaltdrops", "rareswords"]
    });
}

// Cow warrior boss
let cowWarriors = entityCoords['cowwarrior'] || [];
if (cowWarriors.length > 5) {
    addSpawn(cowWarriors[0].x, cowWarriors[0].y, {
        name: "미노타우로스",
        miniboss: true,
        level: 42,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldbattleaxe", chance: 3000 },
            { key: "goldlegplates", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "shards", "accessories"]
    });
}

// Hobgoblin chieftain
let hobgoblins = entityCoords['hobgoblin'] || [];
if (hobgoblins.length > 5) {
    addSpawn(hobgoblins[0].x, hobgoblins[0].y, {
        name: "호브고블린 족장",
        miniboss: true,
        level: 32,
        hitPoints: 500,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "ironbattleaxe", chance: 5000 },
            { key: "ironchestplate", chance: 4000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "golddrops", "shards"]
    });
}

// Mermaid queen
let mermaids = entityCoords['mermaid'] || [];
if (mermaids.length > 5) {
    addSpawn(mermaids[5].x, mermaids[5].y, {
        name: "인어 여왕",
        miniboss: true,
        level: 58,
        hitPoints: 1000,
        aggressive: true,
        aggroRange: 7,
        defenseLevel: 20,
        drops: [
            { key: "cobaltspear", chance: 2500 },
            { key: "pytharring", chance: 1000 },
            { key: "greenpendant", chance: 2000 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// ---- Zone 5: North area (y < 250) - Desert/Lava ----
// Lava slime king
let lavaSlimes = entityCoords['lavaslime'] || [];
if (lavaSlimes.length > 5) {
    addSpawn(lavaSlimes[0].x, lavaSlimes[0].y, {
        name: "용암 슬라임 왕",
        miniboss: true,
        level: 45,
        hitPoints: 750,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldscythe", chance: 3000 },
            { key: "goldshield", chance: 3000 },
            { key: "cinnabarsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "shards"]
    });
}

// Desert scorpion boss
let desertScorps = entityCoords['desertscorpion'] || [];
if (desertScorps.length > 5) {
    addSpawn(desertScorps[0].x, desertScorps[0].y, {
        name: "사막 전갈 왕",
        miniboss: true,
        level: 40,
        hitPoints: 650,
        aggressive: true,
        aggroRange: 7,
        poisonous: true,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldboots", chance: 3000 },
            { key: "nisocsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "accessories"]
    });
}

// Eye boss
let eyes = entityCoords['eye'] || [];
let northEyes = eyes.filter(c => c.y < 250);
if (northEyes.length > 3) {
    addSpawn(northEyes[0].x, northEyes[0].y, {
        name: "마안 군주",
        miniboss: true,
        level: 50,
        hitPoints: 850,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldchestplate", chance: 2000 },
            { key: "pytharsword", chance: 1500 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "golddrops", "rareswords", "accessories"]
    });
}

// Spectre lord
let spectres = entityCoords['spectre'] || [];
let northSpectres = spectres.filter(c => c.y < 200);
if (northSpectres.length > 3) {
    addSpawn(northSpectres[0].x, northSpectres[0].y, {
        name: "유령 군주",
        miniboss: true,
        level: 48,
        hitPoints: 800,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldscythe", chance: 4000 },
            { key: "goldhelmet", chance: 3000 },
            { key: "cinnabarsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "golddrops", "rareswords", "shards"]
    });
}

// Death knight commander
let deathKnights = entityCoords['deathknight'] || [];
if (deathKnights.length > 3) {
    addSpawn(deathKnights[0].x, deathKnights[0].y, {
        name: "죽음의 기사단장",
        miniboss: true,
        level: 55,
        hitPoints: 1000,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobaltspear", chance: 2500 },
            { key: "cobaltchestplate", chance: 1500 },
            { key: "ibosword", chance: 1000 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Blue preta boss
let bluepretas = entityCoords['bluepreta'] || [];
let northBluepretas = bluepretas.filter(c => c.y < 200);
if (northBluepretas.length > 3) {
    addSpawn(northBluepretas[0].x, northBluepretas[0].y, {
        name: "아귀 대왕",
        miniboss: true,
        level: 45,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldbattleaxe", chance: 3000 },
            { key: "goldlegplates", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "shards"]
    });
}

// Iron ogre commander
let ironOgres = entityCoords['ironogre'] || [];
if (ironOgres.length > 3) {
    addSpawn(ironOgres[0].x, ironOgres[0].y, {
        name: "철갑 오우거 대장",
        miniboss: true,
        level: 40,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "ironsword", chance: 5000 },
            { key: "ironchestplate", chance: 4000 },
            { key: "goldsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "irondrops", "golddrops", "shards"]
    });
}

// Golem boss
let golems = entityCoords['golem'] || [];
if (golems.length > 5) {
    addSpawn(golems[0].x, golems[0].y, {
        name: "고대 골렘",
        miniboss: true,
        level: 42,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldshield", chance: 4000 },
            { key: "goldchestplate", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "shards", "accessories"]
    });
}

// Skeleton boss in mid area
let skeletons = entityCoords['skeleton'] || [];
let midSkeletons = skeletons.filter(c => c.y >= 600 && c.y < 750);
if (midSkeletons.length > 5) {
    addSpawn(midSkeletons[0].x, midSkeletons[0].y, {
        name: "해골 대장",
        miniboss: true,
        level: 30,
        hitPoints: 450,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "ironbattleaxe", chance: 4000 },
            { key: "ironshield", chance: 4000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "bronzedrops", "shards"]
    });
}

// Slime king
let slimes = entityCoords['slime'] || [];
if (slimes.length > 10) {
    addSpawn(slimes[0].x, slimes[0].y, {
        name: "슬라임 킹",
        miniboss: true,
        level: 35,
        hitPoints: 550,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldsword", chance: 2000 },
            { key: "ironchestplate", chance: 4000 },
            { key: "ironring", chance: 3000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "golddrops", "accessories"]
    });
}

// Small devil boss
let smallDevils = entityCoords['smalldevil'] || [];
if (smallDevils.length > 5) {
    addSpawn(smallDevils[0].x, smallDevils[0].y, {
        name: "악마 군주",
        miniboss: true,
        level: 55,
        hitPoints: 950,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobaltscythe", chance: 2000 },
            { key: "cobaltlegplates", chance: 2000 },
            { key: "ibosword", chance: 1000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Infected guard boss
let infectedGuards = entityCoords['infectedguard'] || [];
if (infectedGuards.length > 5) {
    addSpawn(infectedGuards[0].x, infectedGuards[0].y, {
        name: "감염된 수호자",
        miniboss: true,
        level: 50,
        hitPoints: 800,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldshield", chance: 3000 },
            { key: "goldchestplate", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "golddrops", "cobaltdrops", "shards"]
    });
}

// Dark scorpion boss
let darkScorps = entityCoords['darkscorpion'] || [];
if (darkScorps.length > 3) {
    addSpawn(darkScorps[0].x, darkScorps[0].y, {
        name: "암흑 전갈 여왕",
        miniboss: true,
        level: 60,
        hitPoints: 1100,
        aggressive: true,
        aggroRange: 7,
        poisonous: true,
        drops: [
            { key: "cobaltspear", chance: 2500 },
            { key: "cobalthelmet", chance: 2000 },
            { key: "pytharsword", chance: 1500 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Minidragon boss (south)
let southDragons = miniDragons.filter(c => c.y >= 750);
if (southDragons.length > 5) {
    addSpawn(southDragons[0].x, southDragons[0].y, {
        name: "고대 드래곤",
        miniboss: true,
        level: 75,
        hitPoints: 1800,
        aggressive: true,
        aggroRange: 8,
        attackRange: 4,
        projectileName: "fireball2",
        drops: [
            { key: "cobaltbattleaxe", chance: 2500 },
            { key: "cobaltchestplate", chance: 2000 },
            { key: "ibosword", chance: 1500 },
            { key: "pytharring", chance: 1000 },
            { key: "gold", chance: 18000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Black wizard bosses
let blackWizards = entityCoords['blackwizard'] || [];
if (blackWizards.length > 5) {
    addSpawn(blackWizards[0].x, blackWizards[0].y, {
        name: "암흑 대마법사",
        miniboss: true,
        level: 55,
        hitPoints: 900,
        aggressive: true,
        aggroRange: 8,
        attackRange: 5,
        projectileName: "fireball2",
        drops: [
            { key: "cobalthelmet", chance: 2500 },
            { key: "pytharsword", chance: 2000 },
            { key: "gold", chance: 12000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords"]
    });
}

// Poison spider boss
let poisonSpiders = entityCoords['poisonspider'] || [];
if (poisonSpiders.length > 3) {
    addSpawn(poisonSpiders[0].x, poisonSpiders[0].y, {
        name: "맹독 거미 여왕",
        miniboss: true,
        level: 45,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 6,
        poisonous: true,
        drops: [
            { key: "goldscythe", chance: 3000 },
            { key: "goldboots", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "shards"]
    });
}

// Hell spider boss
let hellSpiders = entityCoords['hellspider'] || [];
if (hellSpiders.length > 3) {
    addSpawn(hellSpiders[0].x, hellSpiders[0].y, {
        name: "지옥 거미 대왕",
        miniboss: true,
        level: 65,
        hitPoints: 1200,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "cobaltscythe", chance: 2500 },
            { key: "cobaltlegplates", chance: 2000 },
            { key: "ibosword", chance: 1500 },
            { key: "gold", chance: 15000 }
        ],
        dropTables: ["richdrops", "cobaltdrops", "rareswords", "accessories"]
    });
}

// Santa elf area bosses
let santaElves = entityCoords['santaelf'] || [];
if (santaElves.length > 5) {
    addSpawn(santaElves[0].x, santaElves[0].y, {
        name: "엘프 경비대장",
        miniboss: true,
        level: 52,
        hitPoints: 850,
        aggressive: true,
        aggroRange: 7,
        drops: [
            { key: "goldspear", chance: 4000 },
            { key: "goldhelmet", chance: 3000 },
            { key: "cinnabarsword", chance: 2000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["richdrops", "golddrops", "cobaltdrops", "accessories"]
    });
}

// Ice bat boss
let iceBats = entityCoords['icebat'] || [];
if (iceBats.length > 10) {
    addSpawn(iceBats[0].x, iceBats[0].y, {
        name: "빙결 박쥐왕",
        miniboss: true,
        level: 35,
        hitPoints: 500,
        aggressive: true,
        aggroRange: 7,
        attackRate: 750,
        drops: [
            { key: "ironbattleaxe", chance: 4000 },
            { key: "ironhelmet", chance: 4000 },
            { key: "nisocsword", chance: 1500 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "golddrops", "shards"]
    });
}

// Frog boss
let frogs = entityCoords['frog'] || [];
if (frogs.length > 5) {
    addSpawn(frogs[0].x, frogs[0].y, {
        name: "독개구리 왕",
        miniboss: true,
        level: 28,
        hitPoints: 400,
        aggressive: true,
        aggroRange: 5,
        poisonous: true,
        drops: [
            { key: "ironspear", chance: 5000 },
            { key: "ironboots", chance: 4000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "irondrops", "bronzedrops", "accessories"]
    });
}

// Red guard boss
let redGuards = entityCoords['redguard'] || [];
if (redGuards.length > 3) {
    addSpawn(redGuards[0].x, redGuards[0].y, {
        name: "붉은 근위대장",
        miniboss: true,
        level: 48,
        hitPoints: 800,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldchestplate", chance: 3000 },
            { key: "goldshield", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "cobaltdrops", "accessories"]
    });
}

// Cobra boss
let cobras = entityCoords['cobra'] || [];
if (cobras.length > 2) {
    addSpawn(cobras[0].x, cobras[0].y, {
        name: "킹코브라",
        miniboss: true,
        level: 45,
        hitPoints: 700,
        aggressive: true,
        aggroRange: 6,
        poisonous: true,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldboots", chance: 3000 },
            { key: "gold", chance: 10000 }
        ],
        dropTables: ["ordinary", "golddrops", "rareswords", "shards"]
    });
}

// Earthworm boss
let earthworms = entityCoords['earthworm'] || [];
if (earthworms.length > 5) {
    addSpawn(earthworms[0].x, earthworms[0].y, {
        name: "고대 지렁이",
        miniboss: true,
        level: 40,
        hitPoints: 600,
        aggressive: true,
        aggroRange: 6,
        drops: [
            { key: "goldsword", chance: 3000 },
            { key: "goldlegplates", chance: 3000 },
            { key: "gold", chance: 8000 }
        ],
        dropTables: ["ordinary", "golddrops", "irondrops", "shards"]
    });
}

console.log(`Total spawn overrides: ${Object.keys(spawns).length}`);
writeJSON('spawns.json', spawns);

// Clean up
console.log('\n=== Update complete ===');
console.log('- Stores: 6 new progressive zone stores added');
console.log('- NPCs: 9 NPCs assigned to stores');
console.log('- Drop tables: 7 new tier-based tables added');
console.log('- Mobs: Drops updated for all combat mobs');
console.log('- Spawns: 40+ new zone boss overrides added');
