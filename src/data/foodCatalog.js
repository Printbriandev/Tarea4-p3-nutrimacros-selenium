// Precios de referencia en pesos dominicanos (RD$). Son valores ilustrativos con
// fines academicos, NO provienen de una integracion en tiempo real con supermercados.
const foodCatalog = [
  { id: 1, nombre: 'Huevo', porcion: '1 unidad', precioRD: 12, kcal: 78, proteinaG: 6.3, carbosG: 0.6, grasaG: 5.3 },
  { id: 2, nombre: 'Arroz blanco cocido', porcion: '1 taza', precioRD: 18, kcal: 205, proteinaG: 4.3, carbosG: 45, grasaG: 0.4 },
  { id: 3, nombre: 'Yuca hervida', porcion: '100 g', precioRD: 16, kcal: 160, proteinaG: 1.4, carbosG: 38, grasaG: 0.3 },
  { id: 4, nombre: 'Guineo maduro', porcion: '1 unidad', precioRD: 15, kcal: 105, proteinaG: 1.3, carbosG: 27, grasaG: 0.4 },
  { id: 5, nombre: 'Batata', porcion: '100 g', precioRD: 20, kcal: 86, proteinaG: 1.6, carbosG: 20, grasaG: 0.1 },
  { id: 6, nombre: 'Avena en hojuelas', porcion: '1/2 taza seca', precioRD: 22, kcal: 150, proteinaG: 5, carbosG: 27, grasaG: 3 },
  { id: 7, nombre: 'Platano verde', porcion: '1 unidad', precioRD: 25, kcal: 220, proteinaG: 2.3, carbosG: 57, grasaG: 0.7 },
  { id: 8, nombre: 'Leche entera', porcion: '1 taza', precioRD: 28, kcal: 149, proteinaG: 8, carbosG: 12, grasaG: 8 },
  { id: 9, nombre: 'Pan integral', porcion: '2 rebanadas', precioRD: 30, kcal: 160, proteinaG: 8, carbosG: 28, grasaG: 2 },
  { id: 10, nombre: 'Habichuelas rojas', porcion: '1 taza', precioRD: 32, kcal: 225, proteinaG: 15, carbosG: 40, grasaG: 0.9 },
  { id: 11, nombre: 'Aguacate', porcion: '1/2 unidad', precioRD: 35, kcal: 160, proteinaG: 2, carbosG: 9, grasaG: 15 },
  { id: 12, nombre: 'Lentejas', porcion: '1 taza', precioRD: 38, kcal: 230, proteinaG: 18, carbosG: 40, grasaG: 0.8 },
  { id: 13, nombre: 'Brocoli', porcion: '1 taza', precioRD: 40, kcal: 55, proteinaG: 3.7, carbosG: 11, grasaG: 0.6 },
  { id: 14, nombre: 'Queso fresco', porcion: '50 g', precioRD: 42, kcal: 145, proteinaG: 10, carbosG: 2, grasaG: 11 },
  { id: 15, nombre: 'Mantequilla de mani', porcion: '2 cucharadas', precioRD: 45, kcal: 190, proteinaG: 8, carbosG: 6, grasaG: 16 },
  { id: 16, nombre: 'Pechuga de pollo', porcion: '100 g', precioRD: 55, kcal: 165, proteinaG: 31, carbosG: 0, grasaG: 3.6 },
  { id: 17, nombre: 'Carne de res molida', porcion: '100 g', precioRD: 78, kcal: 250, proteinaG: 26, carbosG: 0, grasaG: 15 },
  { id: 18, nombre: 'Yogurt griego', porcion: '150 g', precioRD: 85, kcal: 100, proteinaG: 17, carbosG: 6, grasaG: 0.7 },
  { id: 19, nombre: 'Atun en lata', porcion: '142 g', precioRD: 95, kcal: 179, proteinaG: 39, carbosG: 0, grasaG: 1.3 },
  { id: 20, nombre: 'Salmon', porcion: '100 g', precioRD: 320, kcal: 208, proteinaG: 20, carbosG: 0, grasaG: 13 },
];

module.exports = { foodCatalog };
