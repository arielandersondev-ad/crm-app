# DynamicTable

## Descripción General

`DynamicTable` es un componente compartido ubicado en:

```txt
src/shared/components/data-table
```

Su propósito es proporcionar una solución reutilizable para visualización de datos tabulares en todo el sistema CRM.

El componente es completamente agnóstico al dominio de negocio y puede ser utilizado por cualquier módulo de la aplicación.

---

# Objetivos

* Centralizar la lógica de tablas.
* Evitar duplicación de código entre módulos.
* Mantener consistencia visual y funcional.
* Facilitar mantenimiento y evolución.
* Permitir personalización mediante configuración.

---

# Casos de Uso

La tabla está diseñada para ser utilizada en:

* Clientes
* Mascotas
* Inventario
* Productos
* Ventas
* Usuarios
* Roles y permisos
* Reportes
* Cualquier listado administrativo

---

# Principios de Diseño

## Agnóstico al Dominio

La tabla no debe conocer:

* Clientes
* Mascotas
* Inventario
* Ventas
* Usuarios

La única responsabilidad del componente es renderizar datos tabulares.

---

## Configuración por Composición

La tabla recibe toda su configuración mediante propiedades.

Ejemplo:

```tsx
<DynamicTable
  data={clientes}
  columns={columns}
  actions={actions}
/>
```

---

## Reutilización

Las personalizaciones específicas deben implementarse mediante:

```txt
features/*/components/*-table.tsx
```

Ejemplos:

```txt
features/clientes/components/cliente-table.tsx
features/inventario/components/inventory-table.tsx
features/usuarios/components/user-table.tsx
```

Estos componentes actúan como adaptadores entre el dominio y la tabla genérica.

---

# Estructura

```txt
src/
└── shared/
    └── components/
        └── data-table/
            │
            ├── components/
            │   ├── data-table-actions.tsx
            │   ├── data-table-avatar.tsx
            │   ├── data-table-empty.tsx
            │   ├── data-table-pagination.tsx
            │   ├── data-table-status.tsx
            │   └── data-table-toolbar.tsx
            │
            ├── hooks/
            │   ├── use-table-filter.ts
            │   ├── use-table-pagination.ts
            │   └── use-table-sort.ts
            │
            ├── utils/
            │   ├── format-date.ts
            │   ├── get-density-class.ts
            │   └── get-nested-value.ts
            │
            ├── dynamic-table.tsx
            ├── types.ts
            └── index.ts
```

---

# Componentes Internos

## DataTableToolbar

Responsable de:

* Búsqueda
* Filtros futuros
* Acciones globales futuras

---

## DataTablePagination

Responsable de:

* Navegación entre páginas
* Cambio de página

---

## DataTableEmpty

Responsable de:

* Mostrar estado vacío
* Mensajes cuando no existen resultados

---

## DataTableAvatar

Responsable de:

* Renderizar avatares simples
* Mostrar iniciales cuando no existe imagen

---

## DataTableStatus

Responsable de:

* Renderizar badges de estado
* Colores consistentes en toda la aplicación

---

## DataTableActions

Responsable de:

* Botones por fila
* Menús desplegables
* Acciones contextuales

---

# Hooks

## useTableFilter

Responsable de:

* Filtrado por texto
* Búsqueda sobre columnas configurables

---

## useTableSort

Responsable de:

* Ordenamiento ascendente
* Ordenamiento descendente

Tipos soportados:

* text
* number
* date

---

## useTablePagination

Responsable de:

* Cálculo de páginas
* Obtención de registros visibles

---

# Utilidades

## getNestedValue

Permite acceder a propiedades anidadas.

Ejemplo:

```ts
getNestedValue(cliente, 'direccion.ciudad')
```

Resultado:

```ts
cliente.direccion.ciudad
```

---

## formatDate

Formatea fechas de forma consistente.

Características:

* Soporta fechas ISO
* Maneja fechas simples
* Evita problemas de zona horaria

---

## getDensityClass

Controla el espaciado vertical de filas.

Modos disponibles:

```ts
compact
normal
comfortable
```

---

# API Pública

## DynamicTable

Componente principal exportado por el módulo.

---

## Tipos Exportados

```ts
ColumnConfig
ActionButton
DynamicTableProps
TableDensity
ActionsMode
StatusOption
```

---

# index.ts

El archivo index actúa como API pública del módulo.

Contenido:

```ts
export * from './dynamic-table';
export * from './types';
```

No deben exportarse:

* hooks
* utils
* componentes internos

Estos elementos son detalles de implementación.

---

# Características Implementadas

## Búsqueda

Permite búsqueda global sobre columnas configurables.

```ts
searchable: true
```

---

## Ordenamiento

Permite ordenar columnas.

```ts
sortable: true
```

---

## Paginación

Configuración:

```ts
pageSize
showPagination
```

---

## Renderizado Personalizado

```tsx
render: (value, row) => ReactNode
```

---

## Acciones por Fila

Modos disponibles:

```ts
buttons
dropdown
```

---

## Status Badge

```ts
type: 'status'
```

---

## Avatar

```ts
type: 'avatar'
```

---

## Imagen

```ts
type: 'image'
```

---

## Fecha

```ts
type: 'date'
```

---

## Número

```ts
type: 'number'
```

---

## Sticky Header

Configuración:

```ts
stickyHeader
```

---

## Density Modes

Configuración:

```ts
compact
normal
comfortable
```

---

## Responsive

La tabla soporta desplazamiento horizontal mediante:

```tsx
overflow-x-auto
```

---

# Uso Recomendado

## Correcto

```tsx
export function ClienteTable({
  clientes,
}: Props) {
  return (
    <DynamicTable
      data={clientes}
      columns={columns}
      actions={actions}
    />
  );
}
```

---

## Incorrecto

Agregar lógica de negocio dentro de DynamicTable.

Ejemplos:

* Validaciones de clientes
* Reglas de inventario
* Cálculos financieros
* Permisos específicos de módulos

Estas responsabilidades pertenecen a las features.

---

# Convenciones

## Componentes Compartidos

Ubicación:

```txt
src/shared/components
```

Responsabilidad:

Infraestructura visual reutilizable.

---

## Componentes de Dominio

Ubicación:

```txt
src/features/*/components
```

Responsabilidad:

Adaptar datos del dominio a componentes compartidos.

---

# Mejoras Futuras

Estas funcionalidades no forman parte de la versión actual.

## Selección Múltiple

```txt
☑
☐
☑
```

---

## Exportación CSV

---

## Exportación Excel

---

## Columnas Ocultables

---

## Reordenamiento de Columnas

---

## Virtualización

Para grandes volúmenes de datos.

---

## Server Side Pagination

---

## Server Side Sorting

---

## Server Side Filtering

---

# Estado Actual

Versión: V1

Estado:

```txt
Producción
```

Evaluación:

* Arquitectura: 9/10
* Reutilización: 9/10
* Escalabilidad: 8.5/10
* UI: 8.5/10
* Mantenibilidad: 9/10

El componente se considera listo para ser utilizado como tabla base de todo el CRM.
