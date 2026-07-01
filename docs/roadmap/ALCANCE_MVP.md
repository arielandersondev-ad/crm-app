# Alcance del MVP — Sistema Oftalmológico

## Módulos del MVP

| Módulo | Descripción |
|--------|-------------|
| Dashboard | Resumen de métricas clínicas (pacientes, citas, consultas) |
| Pacientes | CRUD de pacientes + ficha clínica (antecedentes, alergias) |
| Historial Clínico | Registro y consulta de consultas + refracciones |
| Agenda / Controles | Gestión de citas y conversión a consulta |
| Servicios | Catálogo de procedimientos oftalmológicos |
| Consultas | Registro de atención con motivo, diagnóstico y receta |
| Reportes PDF | Exportación de pacientes atendidos por período |
| Chatbot FAQ | Preguntas frecuentes con disclaimer médico |
| Personal | Administración de usuarios del sistema |

## Actores

| Actor | Rol en backend | Permisos |
|-------|---------------|----------|
| Administrador | OWNER / ADMIN | Acceso completo al sistema |
| Médico | EMPLOYEE | Consultas, historial, recetas |
| Asistente / Recepcionista | MANAGER | Agenda, registro de pacientes |
| Paciente | (vista pública futura) | Consulta de citas y chatbot |

## Flujos principales

1. Recepcionista registra paciente → crea cita en agenda
2. Médico recibe paciente → convierte cita en consulta → registra motivo, diagnóstico, refracción → programa próximo control
3. Administrador genera reportes PDF por período
4. Paciente/usuario consulta FAQ vía chatbot

## Límites del MVP

- Sin facturación electrónica
- Sin integración con laboratorios externos
- Sin recetas electrónicas imprimibles (se implementa en S7)
- Sin telemedicina / videoconsulta
- Sin módulo de inventario de insumos
- Sin integración con historias clínicas externas

## Mapeo conceptual CRM → Clínico

| CRM (código interno) | UI (Sistema Oftalmológico) |
|---------------------|---------------------------|
| Client | Paciente |
| Appointment | Cita / Control |
| Visit | Consulta / Atención |
| VisitDetail | Detalle de Consulta |
| Service | Servicio / Procedimiento |
| User | Personal de la Clínica |
| Sucursal | Consultorio |
