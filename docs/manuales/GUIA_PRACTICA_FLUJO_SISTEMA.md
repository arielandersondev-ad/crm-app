# Guía de práctica del sistema

Preparada el 28 de octubre de 2026 a partir del código actual. Es un recorrido manual: las comprobaciones propuestas deben realizarse en la aplicación; no representan pruebas ya ejecutadas.

## Cómo usar esta guía

Realiza una parte por sesión y marca las casillas después de comprobar el resultado. Utiliza datos ficticios y conserva el mismo paciente durante todo el recorrido para seguir su historia.

Recorrido principal: **Pacientes → Agenda / Controles → Consultas Clínicas → Próximo control → Reportes → Dashboard → FAQ Chatbot → Configuración → Personal → Accesos**.

Antes de comenzar, inicia sesión con una cuenta ADMIN u OWNER y comprueba la empresa y sucursal que aparecen en la cabecera. Para practicar las sugerencias de FAQ necesitarás OWNER. Si todavía no hay sucursal operativa, revisa primero las partes 8 y 9.

### Caso de práctica

| Dato | Valor para la práctica |
| --- | --- |
| Paciente | Paciente Prueba Recorrido 01 |
| Correo | paciente.recorrido01@example.com |
| Teléfono | 70000001, ficticio; no usar para contactar |
| Documento | PRUEBA-REC-001 |
| Fecha de nacimiento | 15/06/1990 |
| Dirección | Dirección ficticia de práctica |
| Antecedentes | Registro ficticio para practicar |
| Alergias | Sin alergias registradas en este ejercicio |
| Contacto de emergencia | Contacto ficticio, 70000002 |
| Motivo de consulta | Evaluación visual de práctica |
| Diagnóstico | Diagnóstico ficticio de práctica |
| Observaciones | Registro de capacitación |
| Primera cita | Un horario disponible de la sucursal |
| Próximo control | Una fecha posterior, dentro del horario de atención |

## Parte 1. Registrar y revisar al paciente

**Ruta:** Pacientes, `/dashboard/clientes`.

1. Pulsa **Nuevo paciente**.
2. Intenta guardar el formulario vacío para identificar los campos obligatorios.
3. Completa los datos del caso. Actualmente se validan nombre de al menos tres caracteres, correo válido y teléfono de al menos ocho caracteres.
4. Completa también antecedentes, alergias, contacto de emergencia y observaciones clínicas.
5. Guarda y localiza al paciente en la tabla.
6. Abre **Editar**, cambia la dirección, guarda y vuelve a abrirlo para comprobar la persistencia.
7. Abre **Detalles** y recorre las pestañas **Consultas**, **Antecedentes** y **Citas**.
8. Revisa que los antecedentes coincidan con lo ingresado y que la ficha todavía no tenga consultas ni citas.

**Comprobaciones:**

- [ ] El paciente aparece una sola vez.
- [ ] Los datos y antecedentes siguen guardados después de recargar.
- [ ] La ficha pertenece al paciente correcto.
- [ ] Las validaciones permiten corregir los datos antes de guardar.

## Parte 2. Programar y confirmar una cita

**Ruta:** Agenda / Controles, `/dashboard/agenda`.

1. Pulsa **Nueva cita** y después **Buscar Paciente**.
2. Selecciona al paciente de práctica.
3. Completa **Programado para** con fecha y hora y pulsa **Crear**.
4. Busca la cita en las vistas de día, semana y mes; usa las flechas para llegar a la fecha elegida.
5. Abre la cita y revisa paciente, responsable, fecha, hora, estado y código de cita.
6. Anota el código para reconocer este registro más adelante.
7. Pulsa **Editar**, selecciona **Confirmada** y pulsa **Actualizar**.
8. Cierra y vuelve a abrir el detalle; comprueba el estado después de recargar.
9. Regresa a Pacientes → Detalles → Citas y localiza la misma cita.

**Comprobaciones:**

- [ ] La cita corresponde al paciente y sucursal de práctica.
- [ ] Fecha y hora coinciden en agenda y ficha; no hay desplazamiento horario.
- [ ] El estado confirmado permanece guardado.
- [ ] La cita aparece en la ficha del paciente.

## Parte 3. Iniciar y completar la consulta clínica

**Ruta:** Agenda / Controles → detalle de la cita → **Iniciar Consulta**; después, Consultas Clínicas, `/dashboard/consultas`.

1. Abre la cita confirmada y pulsa **Iniciar Consulta** una sola vez.
2. Entra a **Consultas Clínicas** o a la pestaña Consultas de la ficha del paciente y abre la consulta creada.
3. Comprueba que pertenece al paciente correcto y que inicialmente está en borrador, `DRAFT`.
4. Pulsa **Editar** y completa motivo, diagnóstico y observaciones con los textos ficticios del caso.
5. Recorre la sección de refracción: ojo derecho e izquierdo, lejos y cerca, esfera, cilindro, eje, agudeza visual, DIP y adición. Usa valores ficticios válidos para los campos del formulario.
6. Define **Próximo control** en una fecha posterior y guarda.
7. Cierra y vuelve a abrir la consulta para verificar textos, valores numéricos y fecha del control.
8. Pulsa **Finalizar consulta** cuando hayas terminado de revisar el borrador.
9. Vuelve a abrirla y comprueba el estado `COMPLETED`.
10. Pulsa **Imprimir Resumen**, abre el PDF y comprueba paciente, diagnóstico y refracción.

**Comprobaciones:**

- [ ] La cita generó una consulta asociada.
- [ ] Los datos de refracción conservan signo y decimales.
- [ ] La consulta queda finalizada y el resumen se puede descargar.
- [ ] La ficha incorpora la consulta al historial.

**Detalles del comportamiento actual:** iniciar la consulta desde la agenda ya marca la cita como atendida, `COMPLETED`, aunque la consulta clínica siga en borrador. El backend solo permite editar consultas en borrador: termina los cambios antes de finalizar. Si aparece un botón Editar en una consulta finalizada y el guardado se rechaza, registra esa diferencia entre interfaz y regla del sistema.

## Parte 4. Comprobar el control y practicar otras atenciones

1. Regresa a la agenda y busca la fecha indicada en **Próximo control**. El guardado de ese campo contempla crear una cita de seguimiento; comprueba que efectivamente aparezca.
2. Revisa también Pacientes → Detalles → Citas y el resumen superior de la ficha.
3. Anota fecha, hora y estado del control. Comprueba que coincidan con lo guardado en la consulta.
4. Para practicar una atención sin cita, usa **Consulta** en la fila del paciente, **Nueva consulta** en su ficha o la opción de nueva consulta en Consultas Clínicas.
5. Registra otra consulta ficticia y comprueba que ambas aparezcan en el historial del mismo paciente.
6. Crea dos citas adicionales de práctica en horarios distintos. Marca una **Cancelada** y otra **No asistió**, y vuelve a abrirlas para verificar los cambios.
7. Si intentas iniciar consulta desde una cita cancelada o con inasistencia, el sistema debe rechazar la acción.

**Comprobaciones:**

- [ ] El control aparece en agenda y ficha sin duplicación inesperada.
- [ ] La atención directa puede registrarse desde el paciente.
- [ ] Las citas canceladas y las inasistencias conservan su estado.
- [ ] No se inicia una atención desde una cita cancelada o con inasistencia.

**Qué crea Próximo control:** al guardar ese campo se programa una cita en estado **Pendiente (`PENDING`)** por defecto. Puedes confirmarla desde la agenda. La consulta clínica de ese seguimiento se crea cuando pulsas **Iniciar Consulta** en la cita; comienza como borrador. Cambiar después la fecha del próximo control no equivale a reprogramar la cita anterior: revisa la agenda, porque la lógica actual puede conservarla y crear otra para la nueva fecha.

## Parte 5. Generar los reportes

**Ruta:** Reportes, `/dashboard/reportes`.

1. Selecciona **Consultas por Período**.
2. Elige un rango de fechas que incluya las consultas de práctica y pulsa **Exportar PDF**.
3. Abre el archivo y revisa el paciente y las atenciones incluidas.
4. Repite con **Estadísticas por Médico**, utilizando el mismo período.
5. Selecciona **Controles Programados** y exporta. Este formulario no solicita rango de fechas.
6. Busca el seguimiento creado en la parte 3, si corresponde al alcance del reporte.
7. Repite Consultas por Período con un rango sin atenciones y comprueba que la respuesta sea comprensible.

**Comprobaciones:**

- [ ] Los tres tipos de reporte generan un archivo legible.
- [ ] El contenido corresponde al período y a la sucursal indicados.
- [ ] Los reportes y la ficha muestran datos consistentes.

## Parte 6. Revisar el Dashboard

**Ruta:** Dashboard, `/dashboard`.

1. Revisa **Total Pacientes**, **Citas Hoy**, **Consultas Hoy**, **Consultas Totales**, **Próximos Controles** y **Citas Pendientes**.
2. Contrasta las cifras con los registros creados y sus fechas y estados.
3. Recarga para comprobar la actualización. Una cita futura no tiene por qué incrementar Citas Hoy.
4. Usa los accesos disponibles para volver a las secciones y comprobar la navegación.

**Comprobaciones:**

- [ ] Los indicadores son coherentes con la fecha, estado y alcance de los registros.
- [ ] La información se actualiza al volver a cargar.

## Parte 7. Administrar las FAQ del chatbot

**Ruta:** FAQ Chatbot, `/dashboard/faqs`.

1. Abre **Preguntas Frecuentes** y pulsa **Nueva FAQ**.
2. Crea una pregunta identificable, por ejemplo: “¿Qué debo llevar a mi cita de práctica?”.
3. Escribe una respuesta ficticia de capacitación y selecciona la categoría **Citas**.
4. Guarda, vuelve a abrirla, cambia la respuesta y comprueba que la edición persista.
5. En la pestaña **Configuración**, revisa nombre del bot, bienvenida, mensaje cuando no encuentra respuesta, aviso, umbral de similitud y activación.
6. Si cuentas con el canal público del chatbot, pregunta la FAQ y una variante con otras palabras; comprueba también una pregunta sin respuesta conocida. Esta parte requiere que ese canal esté disponible.
7. Con rol **OWNER**, abre **Sugerencias basadas en conversaciones**, selecciona el período disponible y ejecuta el análisis. Si no hay conversaciones elegibles, comprueba que se explique la ausencia de sugerencias.
8. Si hay sugerencias, revisa pregunta y respuesta, copia una y crea la FAQ mediante **Nueva FAQ** después de revisarla.
9. Para practicar eliminación, crea una FAQ temporal distinta, elimínala y conserva la del ejercicio.

**Comprobaciones:**

- [ ] Crear, editar y eliminar una FAQ temporal funciona.
- [ ] La configuración persiste después de recargar.
- [ ] Las sugerencias se muestran únicamente a OWNER.
- [ ] La respuesta del canal público corresponde a la FAQ, si el canal está disponible.

## Parte 8. Recorrer Configuración

**Ruta:** Configuración, `/dashboard/configuracion`. Disponible en el menú para ADMIN y OWNER.

Anota el valor original antes de modificar cada ajuste y restáuralo al terminar la práctica.

| Pestaña | Qué practicar | Qué comprobar |
| --- | --- | --- |
| Empresa | Revisar nombre, identificador público del chatbot, teléfono, correo, WhatsApp y zona horaria. Cambiar un dato de contacto de prueba y guardar. | El dato persiste al recargar. El identificador público se mantiene coordinado con el canal del chatbot. |
| Sucursales | Seleccionar una sucursal existente; revisar nombre, teléfono, dirección, correo y coordenadas. Revisar días y horas de atención y guardar un cambio de prueba. | Se modifica la sucursal elegida; horarios y datos siguen guardados al volver a abrir. |
| Agenda | Revisar duración promedio de consulta, intervalo entre citas y minutos para marcar inasistencia automáticamente. Guardar un ajuste de prueba. | El valor se conserva al recargar. Comprobar por separado su efecto operativo; guardar un parámetro no demuestra que el proceso automático se haya ejecutado. |
| Chatbot | Revisar nombre del asistente, bienvenida, mensaje sin respuesta y aviso. Guardar una modificación de prueba. | La configuración coincide al volver a abrir y, si el canal está disponible, se refleja al iniciar una conversación nueva. |

**Comprobaciones:**

- [ ] Se recorrieron las cuatro pestañas.
- [ ] Los cambios persisten y se restauraron los valores originales.
- [ ] Las fechas del ejercicio son coherentes con la zona horaria configurada.

## Parte 9. Administrar el personal

**Ruta:** Personal, `/dashboard/usuarios`. Disponible en el menú para ADMIN y OWNER.

1. Pulsa **Agregar usuario**.
2. Completa nombre, apellido, correo ficticio y contraseña de práctica que cumpla las validaciones.
3. Selecciona rol **Empleado** y la sucursal que usarás; guarda.
4. Revisa en la tabla que el usuario tenga el rol y sucursal esperados. Cierra sesión e inicia con la cuenta de práctica para comprobar su acceso efectivo.
5. Regresa con ADMIN u OWNER, abre **Editar** y practica el cambio de rol a **Manager**; vuelve a iniciar sesión con la cuenta de práctica para observar el menú.
6. Si tienes otra sucursal de práctica, prueba la asignación y comprueba en una sesión nueva qué sucursal queda activa.
7. Desde la cuenta administradora, desactiva al usuario de práctica. Comprueba que no pueda iniciar una sesión nueva y después reactívalo.
8. Practica eliminar únicamente una cuenta temporal adicional que no necesites conservar.
9. Si pruebas **Cambiar Contraseña**, verifica primero qué cuenta afecta: el formulario solicita contraseña actual, nueva contraseña y confirmación; no recibe el identificador del usuario seleccionado como parte del componente.

**Comprobaciones:**

- [ ] El usuario creado puede iniciar sesión con el rol y sucursal esperados.
- [ ] Los cambios de rol se reflejan en una sesión nueva.
- [ ] Desactivar y reactivar afectan el acceso como corresponde.
- [ ] La eliminación temporal no afecta la cuenta administradora del ejercicio.

## Parte 10. Verificar accesos y cerrar el recorrido

La tabla resume la visibilidad del menú y las acciones clínicas identificadas en el frontend. Comprueba los permisos efectivos durante la práctica: ocultar un enlace no demuestra por sí solo que su ruta esté protegida.

| Función | OWNER | ADMIN | MANAGER | EMPLOYEE |
| --- | --- | --- | --- | --- |
| Dashboard, Pacientes, Agenda y Consultas en el menú | Sí | Sí | Sí | Sí |
| Crear y editar consulta desde ficha y pantalla de consultas | Sí | Sí | No | Sí |
| Reportes en el menú | Sí | Sí | Sí | Sí |
| FAQ Chatbot en el menú | Sí | Sí | Sí | No |
| Sugerencias de FAQ | Sí | No | No | No |
| Configuración y Personal en el menú | Sí | Sí | No | No |

1. Inicia sesión sucesivamente con las cuentas de práctica de los roles disponibles.
2. Contrasta el menú y las acciones visibles con la tabla.
3. Desde un rol sin acceso administrativo, intenta abrir las rutas de Configuración y Personal directamente y registra el resultado.
4. Cierra sesión y comprueba que las páginas privadas soliciten autenticación al volver a abrirse.
5. Repite el recorrido básico en una ventana estrecha: menú, tabla de pacientes, detalle, formulario clínico y agenda.
6. Revisa la ficha del paciente y confirma que puedes reconstruir su historia: datos → cita → consulta → control → resumen PDF.

**Comprobaciones:**

- [ ] Se comprobaron los roles disponibles y sus rutas.
- [ ] El cierre de sesión protege el acceso posterior.
- [ ] El recorrido principal se puede completar con los datos del caso.

## Extensión opcional: Servicios y Visitas

El proyecto conserva las rutas `/dashboard/servicios` y `/dashboard/visitas`, aunque sus entradas están comentadas en el menú actual. Úsalas como una práctica adicional si forman parte del alcance que quieres mantener. La consulta clínica y la visita tienen pantallas y datos separados.

1. En Servicios, crea un servicio ficticio con nombre, descripción y precio; edítalo y comprueba su persistencia.
2. En Visitas, recorre los registros y abre el detalle de una visita de práctica disponible.
3. Revisa la asociación de servicios, cantidades, notas y pagos que ofrece ese detalle.
4. Si puedes completar el circuito en tu entorno de prueba, agrega un servicio de 100 y registra un pago parcial de 40; comprueba total 100, pagado 40 y saldo 60. Completa con otro pago de 60 y comprueba saldo cero.
5. Si falta una entrada visible para crear o asociar la visita, registra ese punto como pendiente del recorrido.

## Registro de resultados

Usa **OK**, **Fallo** o **Pendiente** por cada parte. Si falla algo, anota el paso concreto, lo esperado y lo que ocurrió.

| Parte | Estado | Paso y resultado observado |
| --- | --- | --- |
| 1. Pacientes | Pendiente | |
| 2. Agenda | Pendiente | |
| 3. Consulta clínica | Pendiente | |
| 4. Controles y variantes | Pendiente | |
| 5. Reportes | Pendiente | |
| 6. Dashboard | Pendiente | |
| 7. FAQ Chatbot | Pendiente | |
| 8. Configuración | Pendiente | |
| 9. Personal | Pendiente | |
| 10. Accesos y cierre | Pendiente | |
| Extensión de Servicios y Visitas | Pendiente | |
