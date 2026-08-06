function todayISO() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function makeSeed(name) {
  if (name === 'empty') return [];
  if (name === 'single') {
    return [{ date: daysAgoISO(1), weightLb: 180, heightIn: 70, chestCm: 100, armCm: 35, goal: 'mantener' }];
  }
  return [
    { date: daysAgoISO(30), weightLb: 195, heightIn: 70, chestCm: 108, armCm: 36, goal: 'bajar' },
    { date: daysAgoISO(15), weightLb: 188, heightIn: 70, chestCm: 105, armCm: 36, goal: 'bajar' },
    { date: daysAgoISO(2), weightLb: 182, heightIn: 70, chestCm: 102, armCm: 37, goal: 'mantener' },
  ];
}

let measurements = [];
let nextId = 1;

function resetMeasurements(seedName = 'default') {
  nextId = 1;
  measurements = makeSeed(seedName).map((m) => ({ id: nextId++, ...m }));
}

function getAll() {
  return [...measurements].sort((a, b) => b.date.localeCompare(a.date));
}

function getLatest() {
  return getAll()[0] || null;
}

function findById(id) {
  return measurements.find((m) => m.id === Number(id)) || null;
}

function add(data) {
  const created = { id: nextId++, ...data };
  measurements.push(created);
  return created;
}

function update(id, data) {
  const existing = findById(id);
  if (!existing) return null;
  Object.assign(existing, data);
  return existing;
}

function remove(id) {
  const index = measurements.findIndex((m) => m.id === Number(id));
  if (index === -1) return false;
  measurements.splice(index, 1);
  return true;
}

resetMeasurements('default');

module.exports = { getAll, getLatest, findById, add, update, remove, resetMeasurements, todayISO };
