let items = require('../packages/server/data/items.json');
let tiers = {};
for (let [key, data] of Object.entries(items)) {
  if (data.type === 'object' || data.type === 'skin' || data.type === 'weaponskin' || data.type === 'pet') continue;
  let tier = 'other';
  if (key.startsWith('copper')) tier = 'copper';
  else if (key.startsWith('tin')) tier = 'tin';
  else if (key.startsWith('bronze')) tier = 'bronze';
  else if (key.startsWith('iron')) tier = 'iron';
  else if (key.startsWith('gold') && !key.includes('golem')) tier = 'gold';
  else if (key.startsWith('nisoc')) tier = 'nisoc';
  else if (key.startsWith('cinnabar')) tier = 'cinnabar';
  else if (key.startsWith('pythar')) tier = 'pythar';
  else if (key.startsWith('ibo')) tier = 'ibo';
  else if (key.startsWith('cobalt')) tier = 'cobalt';
  else if (key.startsWith('leather')) tier = 'leather';
  else if (key.startsWith('wooden')) tier = 'wooden';
  if (!tiers[tier]) tiers[tier] = [];
  tiers[tier].push({key, type: data.type, level: data.level || 0});
}
for (let [tier, items] of Object.entries(tiers)) {
  if (tier === 'other') continue;
  console.log('\n=== ' + tier.toUpperCase() + ' ===');
  for (let i of items) {
    console.log('  ' + i.key + ' ('+i.type+', lv'+i.level+')');
  }
}
