// Mock data for the frontend-only demo. Replace with React Query + API layer.

export const ingresosMensuales = [
  { mes: 'Ene', ingresos: 18200, citas: 142 },
  { mes: 'Feb', ingresos: 21100, citas: 168 },
  { mes: 'Mar', ingresos: 19850, citas: 155 },
  { mes: 'Abr', ingresos: 24300, citas: 191 },
  { mes: 'May', ingresos: 26750, citas: 210 },
  { mes: 'Jun', ingresos: 25400, citas: 198 },
  { mes: 'Jul', ingresos: 29800, citas: 234 },
  { mes: 'Ago', ingresos: 31200, citas: 247 },
  { mes: 'Sep', ingresos: 28900, citas: 221 },
  { mes: 'Oct', ingresos: 33100, citas: 260 },
  { mes: 'Nov', ingresos: 35600, citas: 278 },
  { mes: 'Dic', ingresos: 38400, citas: 295 },
]

export const serviciosPorTipo = [
  { tipo: 'Consultas', valor: 420, fill: 'var(--color-chart-1)' },
  { tipo: 'Vacunación', valor: 285, fill: 'var(--color-chart-2)' },
  { tipo: 'Cirugías', valor: 96, fill: 'var(--color-chart-3)' },
  { tipo: 'Estética', valor: 168, fill: 'var(--color-chart-4)' },
  { tipo: 'Urgencias', valor: 74, fill: 'var(--color-chart-5)' },
]

export type Cliente = {
  id: string
  nombre: string
  email: string
  telefono: string
  mascotas: number
  estado: 'Activo' | 'Inactivo' | 'Moroso'
  ultimaVisita: string
  saldo: number
}

export const clientes: Cliente[] = [
  { id: 'CLI-1042', nombre: 'María Fernández', email: 'maria.f@correo.com', telefono: '+52 55 1234 5678', mascotas: 2, estado: 'Activo', ultimaVisita: '2026-05-22', saldo: 0 },
  { id: 'CLI-1043', nombre: 'Jorge Ramírez', email: 'jorge.r@correo.com', telefono: '+52 55 2345 6789', mascotas: 1, estado: 'Activo', ultimaVisita: '2026-05-19', saldo: 0 },
  { id: 'CLI-1044', nombre: 'Lucía Mendoza', email: 'lucia.m@correo.com', telefono: '+52 55 3456 7890', mascotas: 3, estado: 'Moroso', ultimaVisita: '2026-04-30', saldo: 1240 },
  { id: 'CLI-1045', nombre: 'Andrés Castillo', email: 'andres.c@correo.com', telefono: '+52 55 4567 8901', mascotas: 1, estado: 'Activo', ultimaVisita: '2026-05-25', saldo: 0 },
  { id: 'CLI-1046', nombre: 'Paola Núñez', email: 'paola.n@correo.com', telefono: '+52 55 5678 9012', mascotas: 2, estado: 'Inactivo', ultimaVisita: '2026-02-11', saldo: 0 },
  { id: 'CLI-1047', nombre: 'Diego Salazar', email: 'diego.s@correo.com', telefono: '+52 55 6789 0123', mascotas: 1, estado: 'Activo', ultimaVisita: '2026-05-28', saldo: 320 },
  { id: 'CLI-1048', nombre: 'Renata Ibáñez', email: 'renata.i@correo.com', telefono: '+52 55 7890 1234', mascotas: 4, estado: 'Activo', ultimaVisita: '2026-05-27', saldo: 0 },
  { id: 'CLI-1049', nombre: 'Tomás Aguilar', email: 'tomas.a@correo.com', telefono: '+52 55 8901 2345', mascotas: 1, estado: 'Activo', ultimaVisita: '2026-05-15', saldo: 0 },
]

export type Mascota = {
  id: string
  nombre: string
  especie: string
  raza: string
  edad: string
  peso: string
  dueno: string
  estado: 'Sano' | 'En tratamiento' | 'Observación'
  proximaCita: string | null
}

export const mascotas: Mascota[] = [
  { id: 'MAS-2201', nombre: 'Luna', especie: 'Perro', raza: 'Labrador', edad: '4 años', peso: '28.5 kg', dueno: 'María Fernández', estado: 'Sano', proximaCita: '2026-06-10' },
  { id: 'MAS-2202', nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: '2 años', peso: '4.2 kg', dueno: 'Jorge Ramírez', estado: 'En tratamiento', proximaCita: '2026-06-02' },
  { id: 'MAS-2203', nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog', edad: '6 años', peso: '23.1 kg', dueno: 'Lucía Mendoza', estado: 'Observación', proximaCita: '2026-06-05' },
  { id: 'MAS-2204', nombre: 'Coco', especie: 'Ave', raza: 'Calopsita', edad: '1 año', peso: '0.09 kg', dueno: 'Andrés Castillo', estado: 'Sano', proximaCita: null },
  { id: 'MAS-2205', nombre: 'Nube', especie: 'Gato', raza: 'Persa', edad: '5 años', peso: '5.1 kg', dueno: 'Renata Ibáñez', estado: 'Sano', proximaCita: '2026-06-12' },
  { id: 'MAS-2206', nombre: 'Bruno', especie: 'Perro', raza: 'Golden', edad: '3 años', peso: '31.0 kg', dueno: 'Diego Salazar', estado: 'En tratamiento', proximaCita: '2026-06-01' },
]

export type Cita = {
  id: string
  hora: string
  duracion: number
  mascota: string
  dueno: string
  tipo: string
  veterinario: string
  estado: 'Confirmada' | 'Pendiente' | 'En curso' | 'Completada'
}

export const citasHoy: Cita[] = [
  { id: 'A1', hora: '09:00', duracion: 30, mascota: 'Luna', dueno: 'María Fernández', tipo: 'Consulta general', veterinario: 'Dra. Reyes', estado: 'Completada' },
  { id: 'A2', hora: '09:45', duracion: 45, mascota: 'Michi', dueno: 'Jorge Ramírez', tipo: 'Control tratamiento', veterinario: 'Dr. Vargas', estado: 'En curso' },
  { id: 'A3', hora: '10:30', duracion: 30, mascota: 'Rocky', dueno: 'Lucía Mendoza', tipo: 'Radiografía', veterinario: 'Dra. Reyes', estado: 'Confirmada' },
  { id: 'A4', hora: '11:15', duracion: 60, mascota: 'Bruno', dueno: 'Diego Salazar', tipo: 'Cirugía menor', veterinario: 'Dr. Vargas', estado: 'Confirmada' },
  { id: 'A5', hora: '12:30', duracion: 30, mascota: 'Nube', dueno: 'Renata Ibáñez', tipo: 'Vacunación', veterinario: 'Dra. Reyes', estado: 'Pendiente' },
  { id: 'A6', hora: '16:00', duracion: 30, mascota: 'Coco', dueno: 'Andrés Castillo', tipo: 'Consulta general', veterinario: 'Dr. Vargas', estado: 'Pendiente' },
]

export type Producto = {
  sku: string
  nombre: string
  categoria: string
  stock: number
  minimo: number
  precio: number
  costo: number
  proveedor: string
  vence: string
}

export const inventario: Producto[] = [
  { sku: 'MED-0091', nombre: 'Antibiótico Amoxicilina 500mg', categoria: 'Medicamentos', stock: 8, minimo: 20, precio: 185, costo: 96, proveedor: 'FarmaVet', vence: '2026-11-30' },
  { sku: 'VAC-0044', nombre: 'Vacuna Séxtuple Canina', categoria: 'Vacunas', stock: 42, minimo: 15, precio: 320, costo: 170, proveedor: 'BioCan', vence: '2026-09-15' },
  { sku: 'ALI-0123', nombre: 'Alimento Premium Adulto 15kg', categoria: 'Alimentos', stock: 6, minimo: 10, precio: 980, costo: 640, proveedor: 'NutriPet', vence: '2027-03-01' },
  { sku: 'INS-0210', nombre: 'Jeringa estéril 5ml (caja 100)', categoria: 'Insumos', stock: 35, minimo: 12, precio: 145, costo: 78, proveedor: 'MedSupply', vence: '2028-01-01' },
  { sku: 'MED-0102', nombre: 'Antiparasitario Externo Pipeta', categoria: 'Medicamentos', stock: 4, minimo: 15, precio: 210, costo: 110, proveedor: 'FarmaVet', vence: '2026-08-20' },
  { sku: 'EST-0033', nombre: 'Shampoo Dermatológico 250ml', categoria: 'Estética', stock: 28, minimo: 8, precio: 165, costo: 82, proveedor: 'NutriPet', vence: '2027-06-10' },
  { sku: 'VAC-0051', nombre: 'Vacuna Triple Felina', categoria: 'Vacunas', stock: 19, minimo: 10, precio: 295, costo: 155, proveedor: 'BioCan', vence: '2026-10-05' },
]

export type Venta = {
  folio: string
  fecha: string
  cliente: string
  items: number
  metodo: 'Efectivo' | 'Tarjeta' | 'Transferencia'
  estado: 'Pagada' | 'Pendiente' | 'Reembolsada'
  total: number
}

export const ventas: Venta[] = [
  { folio: 'V-8841', fecha: '2026-05-29 12:42', cliente: 'María Fernández', items: 3, metodo: 'Tarjeta', estado: 'Pagada', total: 685 },
  { folio: 'V-8840', fecha: '2026-05-29 11:18', cliente: 'Diego Salazar', items: 1, metodo: 'Efectivo', estado: 'Pagada', total: 320 },
  { folio: 'V-8839', fecha: '2026-05-29 10:05', cliente: 'Renata Ibáñez', items: 5, metodo: 'Transferencia', estado: 'Pendiente', total: 1480 },
  { folio: 'V-8838', fecha: '2026-05-28 17:53', cliente: 'Jorge Ramírez', items: 2, metodo: 'Tarjeta', estado: 'Pagada', total: 505 },
  { folio: 'V-8837', fecha: '2026-05-28 16:20', cliente: 'Lucía Mendoza', items: 4, metodo: 'Tarjeta', estado: 'Reembolsada', total: 940 },
  { folio: 'V-8836', fecha: '2026-05-28 14:11', cliente: 'Andrés Castillo', items: 1, metodo: 'Efectivo', estado: 'Pagada', total: 185 },
  { folio: 'V-8835', fecha: '2026-05-28 12:47', cliente: 'Tomás Aguilar', items: 2, metodo: 'Transferencia', estado: 'Pagada', total: 610 },
]
