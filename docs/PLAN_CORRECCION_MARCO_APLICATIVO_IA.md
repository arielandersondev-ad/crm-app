# Plan de corrección del marco aplicativo: implementación y fundamento de la IA

Propuesta para revisión del autor. Fecha: 27 de octubre de 2026.

Este archivo es un plan de trabajo; todavía no es una nueva versión del proyecto de grado. Se revisaron el PDF entregado, el código local de la rama `develop`, commit `8b4f7a3`, y las fichas oficiales de los modelos. No se consultaron la base de datos ni la configuración del despliegue, ni se ejecutó inferencia. La revisión permite describir la implementación; sus resultados reales deberán respaldarse con evidencias de ejecución.

**Objetivo:** que un lector pueda seguir la cadena necesidad institucional → requisito → fuente de información → proceso implementado → resultado → evidencia de validación.

**Alcance propuesto:** reforzar 3.2, 3.3 y 3.10; añadir precisiones breves en 3.4, 3.5 y 3.9.9; actualizar únicamente las pruebas relacionadas en 4.5 y los anexos correspondientes. Se conserva la estructura general del proyecto.

## 1. Diagnóstico que justifica la corrección

El documento ya menciona MiniLM, embeddings y la decisión FAQ/IA/fallback, principalmente en 3.9.9 y 3.10. Falta convertir esas menciones en una explicación trazable de entradas, transformaciones, almacenamiento, decisiones y salidas. También hace falta demostrar de dónde provienen las necesidades y qué validó la clínica.

| Observación | Hallazgo de la revisión | Corrección propuesta |
| --- | --- | --- |
| ¿Dónde está la IA? | Hay representación semántica con MiniLM, generación opcional de respuestas y generación de sugerencias con Qwen. Horarios y estado de cita usan manejadores de reglas. | Separar responsabilidades y explicar cuándo se ejecuta cada ruta. |
| ¿Dónde se guardan los vectores de respuesta? | Se vectoriza la **pregunta** de la FAQ y se guarda en `FAQ.embedding`; `FAQ.answer` contiene texto. | Corregir el concepto y mostrar la relación pregunta-vector-respuesta. |
| ¿Dónde se calcula y compara el coseno? | `SimilarityService` calcula el coseno; `PrismaFaqRepository` puntúa y ordena; `ChatQueryUseCase` compara el mejor resultado con el umbral. | Una fórmula, un fragmento breve y un caso ejecutado con ranking real. |
| ¿Por qué esas preguntas? | El autor recuerda cinco temas de una entrevista oral. El repositorio también contiene FAQ genéricas en el seed. | Reconstrucción retrospectiva de la entrevista y contraste con el catálogo vigente. |
| ¿Quién validó la necesidad? | El recuerdo del autor respalda una reconstrucción, pero no acredita por sí mismo una aprobación formal de cada FAQ. | Registrar fuente y estado de confirmación; obtener revisión actual de la propietaria cuando sea posible. |
| ¿Qué prueban las métricas? | `source=FAQ` incluye manejadores; `usedAI` marca generación externa y no el uso de embeddings. | Separar rutas y corregir la interpretación de resultados. |

Ubicaciones verificadas en el PDF: 3.2 en página PDF 51; 3.3 en 52-56; 3.9.9 en 81-83; 3.10 en 84-87; 4.5 en 96-97; anexos de pruebas del chatbot en 150-153. Son posiciones del archivo, no la numeración impresa ni la paginación futura.

## 2. Fundamento institucional y anexo de levantamiento

### 2.1. Tratamiento de la entrevista existente

El autor aclaró durante esta revisión que realizó una entrevista oral, no logró registrar todo y reconstruyó sus recuerdos. Los temas que recuerda son consultas sobre horarios, precio de las medidas, precio general de una montura económica, ubicación y posibilidad de coordinar una cita a una hora determinada.

Proponer un **Anexo H: Reconstrucción retrospectiva del levantamiento de necesidades de información y FAQ**, con dos partes:

1. Un relato breve que identifique entrevistador, participante y cargo, modalidad, propósito y fecha o periodo solo si se recuerda. Registrar por separado la fecha real de elaboración de la reconstrucción. Indicar que no existe transcripción íntegra y que se presenta una síntesis no literal.
2. Una tabla que conecte tema recordado, necesidad interpretada, pregunta formulada por el autor, fuente de la respuesta, requisito relacionado y estado de validación.

Las preguntas propuestas son formulaciones documentales del autor. No se presentarán como frases textuales de la entrevistada o de pacientes. Tampoco se asignarán cantidades, porcentajes o frecuencia diaria sin registros que los sustenten.

### 2.2. Contenido inicial que se propone documentar

| ID propuesto | Tema recordado | Necesidad identificada | Formulación propuesta, no literal | Fuente que debe confirmar la respuesta | Tratamiento en el sistema |
| --- | --- | --- | --- | --- | --- |
| NEC-01 | Le consultaban los horarios. | Conocer los días y horas disponibles antes de acudir. | ¿Cuáles son sus horarios? | Propietaria y horarios configurados del establecimiento. | Manejador de horarios; documentar el tema sin exigir una FAQ duplicada. |
| NEC-02 | Le consultaban el precio de las medidas. | Conocer el costo del servicio al que la clínica llama medidas. | ¿Cuánto cuesta la toma de medidas? | Propietaria; confirmar nombre exacto del servicio, importe vigente y condiciones. | FAQ informativa de precios, si la clínica autoriza esa información. |
| NEC-03 | Le consultaban el precio general de una montura económica. | Orientarse sobre una opción económica antes de acudir. | ¿Desde qué precio tienen monturas económicas? | Propietaria; confirmar si corresponde importe fijo, precio desde o consulta de disponibilidad. | FAQ informativa; no inferir inventario ni cotización automática. |
| NEC-04 | Le preguntaban dónde se encuentran. | Localizar el establecimiento. | ¿Dónde está ubicado el establecimiento? | Propietaria y dirección institucional vigente. | FAQ de ubicación; candidata al ejemplo de recuperación semántica. |
| NEC-05 | Preguntaban si podían acudir a una hora para ser atendidos. | Saber si pueden coordinar una cita y cómo solicitarla. | ¿Puedo coordinar una cita para una hora determinada? | Propietaria o personal responsable de agenda; confirmar el procedimiento. | FAQ sobre coordinación y gestión administrativa de la agenda; no afirmar que el chatbot reserva citas. |

Estado inicial de estas filas: **reconstruido por el autor; confirmación institucional de formulación y respuesta pendiente**. Si existe evidencia adicional, actualizar ese estado con su referencia. La necesidad de coordinar una cita y la consulta técnica de estado por código y documento se documentarán como funciones diferentes.

### 2.3. Validación actual y contraste con el catálogo

La propietaria puede revisar ahora la tabla, confirmar o corregir cada necesidad y aprobar el texto institucional de las respuestas. La fecha y el medio de esa confirmación serán actuales; no se presentarán como documentación producida el día de la entrevista original. Una tabla o acta breve puede registrar responsable, observaciones, decisión y fecha.

Antes de justificar las FAQ existentes, obtener un listado o captura del catálogo vigente y compararlo con NEC-01 a NEC-05. El seed no demuestra qué está activo en la base actual. Contiene preguntas sobre seguros, cirugías, atención virtual y emergencias de 24 horas, además de datos de ejemplo. Los temas de precio de medidas y monturas no aparecen expresamente en ese archivo.

Clasificar cada FAQ revisada por su origen: entrevista reconstruida, evidencia de conversaciones, propuesta técnica del autor o dato de prueba. Mantener una columna separada para su validación institucional. Las FAQ sin respaldo se marcarán pendientes; su exclusión del catálogo o modificación será una decisión posterior, fuera de esta fase de planificación.

### 2.4. Referencias dentro del marco aplicativo

- En **3.2**, resumir cómo se obtuvo y reconstruyó la información y remitir al Anexo H.
- En **3.3**, identificar los requisitos y remitir a la evidencia concreta de la tabla del anexo.
- En **3.10.2**, distinguir catálogo inicial sustentado por el levantamiento de consultas posteriores recibidas en el chatbot.
- En **3.10.6**, señalar que las nuevas sugerencias son candidatas a revisión y no equivalen a necesidades aprobadas.

## 3. Requisitos y trazabilidad

En 3.3 incluir una matriz compacta; ampliar los detalles en el Anexo G.1 existente. Identificadores propuestos sujetos a armonización con cualquier numeración previa:

| Requisito propuesto | Comportamiento a especificar | Fundamento que corresponde |
| --- | --- | --- |
| RF-CHAT-01 | Informar horarios configurados. | NEC-01; confirmación del establecimiento. |
| RF-CHAT-02 | Informar precio de medidas y orientación sobre monturas, con respuestas aprobadas. | NEC-02 y NEC-03; confirmar contenido y cobertura del catálogo actual. |
| RF-CHAT-03 | Informar ubicación. | NEC-04; dirección vigente. |
| RF-CHAT-04 | Explicar cómo coordinar una cita. | NEC-05; procedimiento aprobado. |
| RF-CHAT-05 | Administrar manualmente preguntas, respuestas y estado del catálogo. | Requisito de soporte derivado de mantener información institucional; validar responsable. |
| RF-CHAT-06 | Recuperar FAQ mediante representación semántica, ranking y umbral. | Decisión técnica para atender variantes de las preguntas; no atribuir el algoritmo a la entrevistada. |
| RF-CHAT-07 | Generar candidatas a FAQ a partir de conversaciones elegibles para revisión del OWNER. | Función implementada de apoyo; confirmar su necesidad y aceptación con la propietaria. |
| RF-CHAT-08 | Registrar interacciones y responder mediante las rutas alternativas implementadas. | Requisito técnico de trazabilidad y continuidad. |

Para cada requisito: fuente/NEC, actor, entrada, comportamiento esperado, criterio observable de aceptación, módulo o caso de uso, prueba y estado de validación. Separar **implementado**, **comprobado en ejecución** y **aceptado por la clínica**. Una funcionalidad puede tener el primer estado y mantener pendientes los otros dos.

No basta con un commit para acreditar necesidad o aceptación institucional. La ingeniería inversa sigue siendo evidencia válida de cómo se implementó, con ese alcance explícito.

## 4. Estructura propuesta para 3.10

Mantener un máximo de **siete subapartados**, sin abrir un subtítulo por archivo o función. Cada proceso se explica mediante entrada → transformación → salida → evidencia. Describir el sistema en su estado actual, sin mezclar versiones históricas.

### 3.10.1. Alcance de la IA, componentes y modelos

Explicar el asistente híbrido: las reglas consultan información estructurada; MiniLM representa preguntas para recuperar FAQ; Qwen puede redactar respuestas en el modo opcional y generar sugerencias administrativas en una operación independiente.

Incluir una tabla con tarea, modelo, lugar de ejecución, entrada, salida y motivo de selección:

| Tarea | Modelo o componente observado | Ejecución y función |
| --- | --- | --- |
| Embeddings de preguntas | `Xenova/all-MiniLM-L6-v2` con `@xenova/transformers` | Inferencia local en el backend; vector esperado de 384 componentes, mean pooling y normalización. |
| Alternativa de embeddings | `sentence-transformers/all-MiniLM-L6-v2`, valor por defecto de `HF_EMBEDDING_MODEL` | Intento remoto mediante Hugging Face si falla la ruta local. Requiere comprobar la respuesta real de la API. |
| Respuesta generativa opcional | `Qwen/Qwen2.5-3B-Instruct`, valor por defecto de `HF_MODEL` | Consulta remota con la pregunta y hasta cinco FAQ como contexto cuando no se alcanza el umbral y el modo es `FAQ_PLUS_AI`. |
| Sugerencias administrativas | `Qwen/Qwen3-4B-Instruct-2507`, valor por defecto de `FAQ_HF_MODEL`; proveedor por defecto `nscale` | Solicitud remota para agrupar preguntas elegibles y proponer FAQ en JSON. |
| Horarios y estado de cita | Manejadores con expresiones y consultas a repositorios | Procesamiento por reglas; no requiere inferencia del modelo. |

Distinguir modelo, biblioteca y proveedor. Presentar estos nombres como implementación fija o valores por defecto según corresponda; confirmar por separado el entorno utilizado en la demostración y el despliegue.

Motivos de elección que pueden discutirse: representación de preguntas breves, compatibilidad con el backend JavaScript/ONNX, ejecución local para embeddings y seguimiento de instrucciones para redacción/agrupación. El autor debe confirmar cuáles fueron sus criterios reales. No afirmar que hubo una comparación experimental de modelos si no se realizó.

La ficha de MiniLM lo etiqueta como modelo en inglés: incorporar evaluación con las preguntas en español del proyecto y reconocer el límite. No introducir una migración de modelo solo para ampliar la corrección. Usar las fichas oficiales como respaldo de capacidades, no como prueba del rendimiento del sistema.

Precisar que el proyecto integra modelos preentrenados mediante inferencia. Crear una FAQ o analizar conversaciones no entrena automáticamente un modelo.

### 3.10.2. Procedencia de preguntas y construcción del catálogo

Separar tres entradas: temas identificados en la entrevista; preguntas que un visitante o usuario escribe en la interfaz; y preguntas candidatas reformuladas por Qwen a partir de registros elegibles.

Mostrar el recorrido del texto del usuario: interfaz → solicitud HTTP con `question` → controlador → `ChatQueryUseCase` → respuesta y `ChatLog`. El registro no prueba por sí solo que quien preguntó era un paciente real; puede corresponder a visitantes o pruebas del autor.

Vincular el catálogo inicial con el Anexo H y la matriz de requisitos. Explicar quién mantiene y confirma las respuestas. La fuente de verdad de un precio o una dirección es la clínica, no el modelo generativo.

### 3.10.3. Generación y almacenamiento de representaciones vectoriales

Detallar el alta: usuario autorizado registra pregunta y respuesta → `CreateFaqUseCase` envía solo la pregunta a `EmbeddingService` → se genera el vector → `PrismaFaqRepository` guarda pregunta, respuesta, categoría y embedding.

Mostrar un pequeño diccionario de `FAQ`: `id`, `tenantId`, `question`, `answer`, `embedding`, `isActive`. El esquema Prisma define `embedding` como `Json?`; la migración lo materializa como JSONB en PostgreSQL. No hay un índice vectorial ni una búsqueda de pgvector implementados en esta ruta.

Al editar se vuelve a generar el embedding si se envía la pregunta; cambiar solamente la respuesta no vectoriza esa respuesta. La reindexación actual completa FAQ activas que no tienen embedding; no recalcula todos los vectores existentes. El seed crea FAQ sin embedding y no ejecuta este servicio.

La consulta entrante se vectoriza temporalmente para buscar; `ChatLog` no tiene un campo para guardar ese vector. Presentar un registro anonimizado con longitud del vector y unos pocos componentes reales; dejar el vector completo en evidencia técnica si resulta necesario.

### 3.10.4. Cálculo del coseno, ranking y selección

Explicar la fórmula `sim(q,f) = (q · f) / (||q|| ||f||)`, definir sus términos y relacionarlos con el vector de la consulta y el de cada pregunta FAQ. La puntuación mide similitud; no es una probabilidad calibrada de que la respuesta sea correcta.

Detallar la ejecución: recuperar FAQ de la institución con `isActive=true` y embedding no nulo → calcular el coseno en memoria en el backend para cada FAQ → ordenar de mayor a menor → conservar hasta cinco → comparar la primera puntuación con el umbral.

El código actual compara con `config.similarityThreshold`, usa `0.55` si falta ese valor y el esquema define `0.75` como valor inicial al crear configuración. No se encontró `0.80` en esta ruta. Documentar el valor efectivo de la demostración y justificar cualquier calibración mediante datos, no mediante afirmaciones retrospectivas.

Usar **un caso completo de ubicación**, si hay FAQ institucional confirmada: pregunta del catálogo, paráfrasis escrita por un usuario, longitud del vector, ranking de candidatas, puntuaciones, umbral, decisión y respuesta. Los valores se obtendrán en ejecución; no se inventarán puntuaciones ilustrativas presentadas como mediciones. El texto elegido debe evitar la ruta de horarios para demostrar realmente el coseno.

Límite a reconocer: un vector nulo produce una división entre cero en el servicio actual; hay que comprobar el recorrido ante ese caso antes de declarar estabilidad. También se debe verificar la forma y dimensión de los embeddings remotos. Cualquier reparación de código se acordará fuera de este plan documental.

### 3.10.5. Orden de decisión: horarios, citas, FAQ, generación y fallback

Resumir el orden real: estado de cita → horarios → búsqueda semántica → FAQ si alcanza el umbral → generación opcional si corresponde → fallback.

Para horarios, mostrar que el resultado procede de horarios estructurados del establecimiento. La clasificación por palabras o expresiones es una regla; el sistema registra esa respuesta con `source=FAQ`, aunque no haya recuperado una fila del catálogo. NEC-01 justifica la necesidad informativa, no la obligación técnica de duplicarla como FAQ.

Para citas, distinguir la información pública sobre cómo coordinar una atención de la consulta de una cita ya registrada mediante código y documento. No atribuir creación, reprogramación o cancelación autónoma de citas al chatbot.

Para la rama generativa, indicar datos incluidos en el contexto, instrucciones del prompt, modelo, modo de activación y tratamiento de errores. Las instrucciones de no inventar y de no diagnosticar son medidas implementadas; no garantizan por sí mismas que toda salida las cumpla. No extender a esta ruta, sin comprobarla, las garantías del filtrado que existe en sugerencias.

### 3.10.6. Generación de sugerencias de FAQ a partir de conversaciones

Describir un único proceso con ocho pasos breves dentro del mismo subapartado:

1. El OWNER solicita el análisis y habilita Qwen para esa operación.
2. El backend obtiene `ChatLog` de la misma institución en una ventana de 48 horas fijada por una instantánea.
3. Aplica exclusiones de contenido sensible, clínico, transacciones de citas, ruido y otras entradas no elegibles.
4. Normaliza preguntas y consolida repeticiones exactas del texto normalizado. Selecciona candidatas por fallback, no resolución, similitud baja o repetición. Esta preselección usa reglas; no llama al cálculo del coseno para agrupar.
5. Prepara lotes de hasta diez preguntas únicas y FAQ activas filtradas como fuentes institucionales. En esta ruta no envía directamente las tablas de horarios, agenda, servicios o inventario a Qwen.
6. Qwen agrupa por intención y propone pregunta, categoría y respuesta cuando el contexto lo permite. Sin fuente suficiente, el prompt exige `suggestedAnswer=null` y `needsHumanAnswer=true`.
7. El backend valida estructura, índices, contenido y categorías, y recalcula `evidenceCount` a partir de las ocurrencias. La existencia de una categoría autorizada no demuestra por sí sola que el contenido de la respuesta sea fiel a la fuente; sigue siendo necesaria la revisión humana.
8. El OWNER revisa y puede copiar. Para publicar debe utilizar el formulario manual de nueva FAQ. Las sugerencias son temporales; no hay tabla de aprobación, historial de sugerencias o vínculo persistido con la FAQ creada.

Explicar que `sourceQuestionIndexes` identifica entradas del lote y no IDs persistentes de `ChatLog`. `evidenceCount` representa ocurrencias, no personas únicas ni aprobaciones. Para la tesis puede conservarse una evidencia anonimizada de una ejecución sin afirmar que el producto guarda automáticamente esa trazabilidad.

Usar un segundo caso breve: consultas elegibles → repeticiones/índices → propuesta → revisión del OWNER. Preferir un caso real disponible y confirmado; si solo hay datos de prueba, identificarlo expresamente. No afirmar que los logs nuevos originaron el catálogo inicial.

### 3.10.7. Trazabilidad, evidencia y límites

Explicar los campos de `ChatLog` relevantes: pregunta, respuesta, fuente, intención, similitud, tiempo y marcas técnicas. Precisar:

- `usedAI=false` no descarta embeddings; el código lo usa para señalar la rama de generación externa.
- `source=FAQ` puede ser resultado de reglas o de recuperación semántica.
- `confidence` es la similitud de la mejor FAQ en la ruta semántica y un valor asignado por el manejador en rutas especializadas.
- `resolved` se asigna por lógica del sistema; no expresa satisfacción confirmada por el visitante.
- `modelName` recibe `config.modelProvider` en la rama generativa y no acredita necesariamente el identificador exacto del modelo utilizado.

Referenciar las pruebas actualizadas en 4.5 y el anexo técnico. No repetir aquí todos sus resultados.

## 5. Ajustes de coherencia fuera de 3.10

| Ubicación | Ajuste acotado |
| --- | --- |
| 3.2 | Relato metodológico de la entrevista, condición retrospectiva y referencia a Anexo H. |
| 3.3 y G.1 | Requisitos identificables, origen, criterios y estados separados. |
| 3.4 | Ubicar inferencia local, servicios remotos y cálculo de similitud en backend. |
| 3.5 y Anexo C | Precisar JSONB, relación pregunta-vector-respuesta y alcance de `ChatLog`. |
| 3.9.9 | Resumen funcional con remisión a 3.10, evitando repetir la explicación técnica. |
| 4.5 y G.3 | Diferenciar manejadores, recuperación semántica, generación y sugerencias. |
| Bibliografía | Añadir fichas oficiales de modelos y documentación pertinente para las justificaciones realmente utilizadas. |

Revisar expresamente las contradicciones de las pruebas: el anexo registra respuestas de seguros ante una pregunta de medicamentos y de duración de consulta ante una pregunta de ubicación. Deben conservarse como errores observados mientras no exista una prueba posterior que demuestre su corrección. La nota de 4.5 atribuye las cero respuestas generativas al modo desactivado, mientras el texto siguiente menciona fallos de modelo/credenciales; resolver con evidencia o declarar que no se determinó la causa por registro.

Corregir referencias a anexos que no coinciden con el índice actual: en 3.11 se citan I y J y en el Anexo E se cita M.4. Esto es una corrección de referencias necesaria para que la nueva trazabilidad sea verificable.

## 6. Anexos propuestos y evidencias mínimas

**Anexo H: Reconstrucción y confirmación del levantamiento.** Relato breve, tabla NEC-01 a NEC-05, fecha de reconstrucción, alcance del recuerdo y confirmación actual si se obtiene. La confirmación puede ser parte del mismo anexo; no hace falta crear otro por cada entrevista o tema.

**Anexo I: Evidencia técnica de los procesos de IA.** Registro FAQ anonimizado y vector parcial; ejecución del caso semántico con ranking/umbral; evidencia de la ruta de horarios; y ejecución de sugerencias con entrada filtrada, salida y revisión humana. Como máximo dos diagramas: indexación/consulta y generación de sugerencias. Reutilizar y simplificar la figura general existente en vez de añadir otra explicación duplicada.

**Anexo G existente:** ampliar matrices de requisitos y pruebas. No crear un anexo nuevo por cada función ni copiar archivos completos del repositorio. Los fragmentos de código se limitan a lo que explica una transformación o una decisión.

Evidencia pendiente para ejecutar el plan después de su revisión:

- Identidad/cargo de la persona entrevistada y fecha o periodo recordado, con incertidumbre explícita si corresponde.
- Listado vigente de FAQ y revisión de sus orígenes, con respuestas y precios confirmados por la clínica.
- Confirmación actual de los cinco temas y del procedimiento para coordinar citas, si se obtiene.
- Una captura o exportación anonimizada del registro FAQ y configuración efectiva de la demostración.
- Ejecución reproducible de los dos casos y casos negativos pertinentes, con fecha, versión y ambiente.

## 7. Límite de detalle y orden de ejecución

**Nivel recomendado:** siete subapartados en 3.10, dos ejemplos completos, una fórmula, hasta dos diagramas y tablas compactas. En el cuerpo explicar procesos y decisiones; en anexos colocar evidencia extensa. Estimación editorial: 7-9 páginas para 3.10 completo, 2-3 páginas para el Anexo H y 3-5 para el Anexo I. Es un límite orientativo sujeto al formato, no una cantidad de páginas obligatoria.

Orden de trabajo posterior a la revisión del plan:

1. Cerrar el alcance y contrastar NEC-01 a NEC-05 con el catálogo real. Completar el anexo retrospectivo y la confirmación disponible.
2. Fijar requisitos y trazabilidad; registrar qué permanece sin aceptación institucional.
3. Obtener evidencia técnica del caso semántico y del caso de sugerencias. Resolver discrepancias documentales con la versión y configuración comprobadas.
4. Redactar 3.10 con el nivel de detalle acordado e incorporar las referencias en 3.2, 3.3, 3.4 y 3.5.
5. Actualizar las pruebas directamente relacionadas y revisar concordancia entre texto, figuras, tablas, anexos y conclusiones afectadas.

Este plan no incluye cambiar algoritmos, incorporar una base vectorial, entrenar modelos, añadir aprobación persistente de sugerencias o rehacer módulos. Si una prueba revela un defecto que impide sostener una afirmación, se decidirá entre corregirlo en un trabajo acotado o documentar su limitación de forma expresa.

**Criterio de cierre:** un lector puede identificar quién aportó cada necesidad y cuál es su estado de confirmación; localizar los datos y componentes que intervienen; seguir un ejemplo real hasta la respuesta; y distinguir la evidencia de implementación, la prueba de funcionamiento y la aceptación institucional.

## 8. Evidencias de código y fuentes consultadas

Referencias del repositorio revisado:

- [Carga inicial de FAQ](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/prisma/seed.ts:5): catálogo genérico, creación sin embeddings y configuración por defecto.
- [Modelo de datos](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/prisma/schema.prisma:553): FAQ, BotConfig y ChatLog.
- [Migración de chatbot](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/prisma/migrations/20260701154908_add/migration.sql:1): embedding JSONB y valores iniciales.
- [Generación de embeddings](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/infrastructure/nlp/embedding.service.ts:11): inferencia local, intento remoto y vector nulo.
- [Alta de FAQ](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/use-cases/create-faq.use-case.ts:13), [edición](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/use-cases/update-faq.use-case.ts:13) y [reindexación](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/use-cases/reindex-faqs.use-case.ts:11).
- [Cálculo del coseno](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/infrastructure/nlp/similarity.service.ts:5).
- [Ranking y persistencia FAQ](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/infrastructure/prisma/prisma-faq.repository.ts:14).
- [Orquestación, decisión y registro](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/use-cases/chat-query.use-case.ts:27).
- [Manejador de horarios](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/handlers/schedule.handler.ts:23).
- [Origen HTTP y permisos](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/presentation/http/chatbot.controller.ts:69).
- [Modelos de generación](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/infrastructure/nlp/huggingface.service.ts:73).
- [Selección y generación de sugerencias](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/use-cases/generate-faq-suggestions.use-case.ts:90).
- [Validación de sugerencias](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/application/services/faq-suggestion-response-validator.service.ts:33).
- [Lectura de conversaciones recientes](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/apps/backend/src/modules/chatbot/infrastructure/prisma/prisma-chat-log.repository.ts:36).
- [Manual existente de sugerencias](D:/Usuarios/ariel.cruz/Desktop/Trae/crm-app/docs/manuales/SUGERENCIAS_FAQ_QWEN.md:1), contrastado con la implementación actual.

Fuentes primarias para la futura fundamentación de modelos:

- [Ficha de sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2): representación de 384 componentes, búsqueda semántica y etiqueta de idioma inglés.
- [Ficha de Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2): pesos ONNX y uso con Transformers.js.
- [Ficha de Qwen2.5-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct): seguimiento de instrucciones y soporte de español.
- [Ficha de Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507): capacidades declaradas de comprensión y seguimiento de instrucciones.

No se han elaborado transcripciones, aprobaciones, resultados nuevos de pruebas ni una versión corregida del proyecto de grado.
