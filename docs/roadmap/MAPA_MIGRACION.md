# Mapa de Migración — CRM → Sistema Oftalmológico

## Estrategia general

- **No se renombra nada en código.** Solo se cambian labels en la UI.
- **No se modifican tablas existentes.** Se crean tablas nuevas para extender el modelo.
- **Se mapean roles existentes** sin crear nuevos en la base de datos.

## Mapeo de conceptos

| CRM (backend) | Sistema Oftalmológico (UI) | Estrategia |
|---------------|---------------------------|------------|
| Client | Paciente | Se reutiliza. PatientProfile extiende con datos clínicos |
| Appointment | Cita / Control | Se reutiliza. Se agregará relación con Consultation |
| Visit | Consulta | Se reutiliza. Consultation es nueva tabla vinculada opcionalmente |
| VisitDetail | Detalle de consulta | Se reutiliza (procedimientos/servicios realizados) |
| Service | Servicio / Procedimiento | Se reutiliza (consulta base, cirugía, examen) |
| User | Personal | Se reutiliza. Membership.role se mapea a perfil clínico |
| Payment | Pago | Se reutiliza pero se minimiza en UI clínica |
| Sucursal | Consultorio | Se reutiliza sin cambios |

## Tablas nuevas

| Tabla | Propósito | Vinculada a |
|-------|-----------|-------------|
| PatientProfile | Antecedentes, alergias, contacto emergencia | Client (1:1) |
| Consultation | Motivo, diagnóstico, observaciones, próximo control | Client, User, Visit (opcional) |
| Refraction | Receta completa (LEJOS + CERCA + ADD por ojo) | Consultation (1:1) |
| AuditLog | Trazabilidad de eventos clave | Tenant, User |

### Nota sobre Refraction vs VisualMeasurement

Se descartó `VisualMeasurement` (medición individual por ojo) en favor de `Refraction`
(receta completa) porque el dominio oftalmológico trabaja con recetas que contienen
LEJOS + CERCA + ADD en un solo registro, reflejando el formulario físico que usa el médico.

## Tablas reutilizadas (sin cambios)

- Client
- Appointment
- Visit
- VisitDetail
- Service
- User
- Membership
- Sucursal
- Payment

## Mapeo de roles

| Rol en BD | Perfil clínico | Acceso |
|-----------|---------------|--------|
| OWNER | Administrador | Total |
| ADMIN | Administrador | Total |
| EMPLOYEE | Médico | Historial, consultas, recetas |
| MANAGER | Asistente / Recepcionista | Agenda, pacientes |

No se crean nuevos roles. Los guards de backend verifican `Membership.role`.

## Decisiones de diseño

1. **Labels hardcodeados** — Los cambios de terminología (Cliente → Paciente, Visita → Consulta)
   se hicieron directamente en los archivos de UI. En el futuro se puede implementar un sistema
   dinámico basado en `tenant.businessType`.

2. **Relación Consultation ↔ Visit opcional** — Una consulta puede crearse desde una cita
   (Appointment → Visit → Consultation) o directamente desde la ficha del paciente.
