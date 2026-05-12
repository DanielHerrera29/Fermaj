// Este es un placeholder para la plantilla
// En producción, descarga una plantilla real desde:
// https://docs.google.com/spreadsheets/export?id=TU_ID

// Columnas requeridas:
/*
| nui | nombre_cliente | telefono | direccion | ciudad | modelo | tipo_servicio | descripcion | prioridad |
|---|---|---|---|---|---|---|---|---|---|
| NUI001 | Juan Perez | 3001234567 | Calle 10 #20-30 | Bogota | LED 55" | instalacion | Instalar TV en sala | 1 |
| NUI002 | Maria Gomez | 3109876543 | Carrera 15 #40-50 | Medellin | Refrigerador | mantenimiento | Mantenimiento fridge | 2 |
*/

// Por ahora, el usuario debe crear su propia plantilla o descargarla desde el sistema
// Cuando acceda a /portal/dashboard/upload verá el enlace a /plantilla/fermaj_plantilla_ordenes.xlsx

// Para crear el archivo real, puedes usar xlsx en Node.js:
// const XLSX = require('xlsx')
// const ws = XLSX.utils.aoa_to_sheet([["nui","nombre_cliente",...]])
// const wb = XLSX.utils.book_new()
// XLSX.writeFile(wb, "public/plantilla/fermaj_plantilla_ordenes.xlsx")