const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;
const FACTOR_ACTIVIDAD = 1.55;

const AJUSTE_POR_OBJETIVO = {
  bajar: 0.8,
  mantener: 1.0,
  subir: 1.15,
};

function calcularTMB({ weightLb, heightIn, age, sex }) {
  const kg = weightLb * LB_TO_KG;
  const cm = heightIn * IN_TO_CM;
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return sex === 'femenino' ? base - 161 : base + 5;
}

function calcularMacros({ weightLb, heightIn, age, sex, goal }) {
  const tmb = calcularTMB({ weightLb, heightIn, age, sex });
  const kcal = tmb * FACTOR_ACTIVIDAD * AJUSTE_POR_OBJETIVO[goal];

  const kg = weightLb * LB_TO_KG;
  const proteinaG = 2 * kg;
  const grasaG = (kcal * 0.25) / 9;
  const carbosG = (kcal - proteinaG * 4 - grasaG * 9) / 4;

  return {
    tmb: Math.round(tmb),
    kcal: Math.round(kcal),
    proteinaG: Math.round(proteinaG),
    grasaG: Math.round(grasaG),
    carbosG: Math.round(carbosG),
  };
}

module.exports = { calcularTMB, calcularMacros };
