# Manual operativo: sugerencias de FAQ con Qwen

## Propósito y acceso

Esta función permite que un usuario con rol `OWNER` analice las preguntas recibidas durante las últimas 48 horas y obtenga sugerencias temporales de FAQ. No es un chat general ni sustituye la revisión humana.

Los roles `ADMIN`, `MANAGER` y `EMPLOYEE` no pueden ejecutar el análisis. El tenant se obtiene de la sesión autenticada; el usuario no selecciona ni envía un tenant distinto.

## Activación temporal

1. Abra **FAQ Chatbot** y seleccione **Sugerencias basadas en conversaciones**.
2. Active el uso de Qwen solo para el análisis que va a ejecutar.
3. Pulse **Analizar las últimas 48 horas** y espere a que termine el procesamiento.
4. Revise el resumen y las tarjetas devueltas.

La activación es temporal y debe ser independiente del modo `FAQ_PLUS_AI`. Activar las sugerencias no habilita respuestas generativas en el chatbot público. Si Qwen está desactivado, no se envía información al proveedor ni se consumen tokens.

Mantenga Qwen desactivado cuando el modelo o el plan contratado no tenga capacidad suficiente. La generación puede requerir hasta **800 tokens de salida** por solicitud, además de los tokens del contexto enviado.

## Privacidad y no persistencia

Qwen no accede directamente a la base de datos. El backend selecciona los logs del tenant autenticado, excluye consultas de estado o códigos de citas, documentos de identidad, datos clínicos, diagnósticos, síntomas, nombres, teléfonos y correos, y solo después prepara el contexto.

Las sugerencias, agrupaciones y respuestas descartadas no se guardan. Tampoco existe aprobación, rechazo, historial ni vínculo automático con una FAQ. El resultado vive únicamente en la respuesta del endpoint y en la memoria de la pantalla; desaparece al recargar o abandonar la página. Los logs originales y las FAQ existentes conservan su persistencia normal.

El backend consulta una instantánea estable de las últimas 48 horas. La respuesta informa `totalLogs`, los grupos descartados con muestras anonimizadas, las repeticiones consolidadas y las preguntas únicas elegibles. El contenido sensible se representa siempre como `[Contenido protegido]`. Cada solicitud procesa como máximo diez preguntas únicas; si quedan pendientes, el OWNER puede solicitar manualmente el siguiente lote.

Antes de mostrar el resultado, el backend debe rechazar por completo cualquier salida inválida o que reintroduzca datos personales. Una respuesta parcial nunca debe mostrarse.

## Uso de una sugerencia

Cada tarjeta puede permitir copiar la pregunta, la respuesta o la FAQ completa. Para publicarla:

1. Copie el contenido útil.
2. Abra el formulario existente **Nueva FAQ**.
3. Pegue, revise y adapte el texto.
4. Guarde mediante el flujo manual habitual.

Generar o copiar una sugerencia no crea ni modifica una FAQ.

## Resultados y fallos esperados

- Sin preguntas relevantes: **No se encontraron conversaciones recientes que generen nuevas sugerencias de FAQ.**
- Qwen desactivado: **La generación con Qwen está desactivada. Actívala únicamente si cuentas con capacidad suficiente en el modelo configurado.**
- Proveedor no disponible, límite temporal, timeout o salida inválida: no se ejecuta un retry automático. El OWNER puede reintentar manualmente el mismo lote; ese segundo intento dispone del doble de tiempo para responder.
- Solicitud ajena a FAQ, si se admite una instrucción adicional: **Esta solicitud no corresponde a la mejora de preguntas frecuentes ni a la atención informativa al cliente. No fue enviada al servicio de IA.**

## Configuración del servidor

Las variables se configuran en el entorno del backend; nunca se incluyen valores reales en documentación, capturas, tickets o commits.

| Variable             | Uso                                        | Ejemplo seguro             |
| -------------------- | ------------------------------------------ | -------------------------- |
| `HF_TOKEN`           | Credencial del proveedor Hugging Face      | `<token-del-proveedor>`    |
| `HF_MODEL`           | Modelo Qwen habilitado para inferencia     | `Qwen/Qwen2.5-3B-Instruct` |
| `HF_TIMEOUT`         | Timeout del chatbot interactivo            | `20000`                    |
| `FAQ_HF_TIMEOUT`     | Timeout inicial de sugerencias FAQ          | `120000`                   |
| `HF_EMBEDDING_MODEL` | Modelo de embeddings del chatbot existente | `Xenova/all-MiniLM-L6-v2`  |

La ausencia, expiración o falta de permisos de `HF_TOKEN`, la indisponibilidad del modelo y un límite de contexto insuficiente deben tratarse como fallos recuperables. El máximo de salida de 800 tokens es una configuración de la solicitud al proveedor, no una cuota diaria. Esta fase no incorpora cuotas, cooldowns, presupuestos por tenant, contadores ni historial de consumo.

## Checklist de verificación

- [ ] Solo `OWNER` ve y puede ejecutar el análisis; los demás roles reciben denegación aunque invoquen el endpoint directamente.
- [ ] El endpoint usa exclusivamente el `tenantId` del JWT y nunca devuelve logs de otro tenant.
- [ ] Solo se consultan las últimas 48 horas y el análisis no realiza escrituras.
- [ ] Con Qwen desactivado se realizan cero llamadas al proveedor.
- [ ] Preguntas de citas, códigos, identidad, contacto y contenido clínico se excluyen antes del envío.
- [ ] La entrada y la salida no contienen datos personales.
- [ ] Variantes de una misma intención producen una sugerencia; temas distintos permanecen separados.
- [ ] Cada índice de entrada pertenece como máximo a un grupo y `evidenceCount` coincide con sus índices.
- [ ] Solo se aceptan categorías válidas, preguntas no vacías e índices existentes.
- [ ] Sin fuente institucional, la respuesta es `null` y `needsHumanAnswer` es `true`.
- [ ] JSON inválido, propiedades inesperadas o contenido ejecutable invalidan toda la generación.
- [ ] Fallos del proveedor no afectan al chatbot público ni a la administración manual de FAQ.
- [ ] No existen reintentos automáticos; el retry manual conserva snapshot y lote y duplica el timeout.
- [ ] Cada solicitud envía como máximo diez preguntas únicas y consolida repeticiones exactas.
- [ ] El resultado desaparece al recargar o salir de la pantalla.
- [ ] Copiar una sugerencia no crea ni modifica una FAQ; la creación sigue siendo manual.
- [ ] No se crean tablas, migraciones ni registros de sugerencias o ejecuciones.
