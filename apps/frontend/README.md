#Plan Frontend

Fase 1 — Crear proyecto Next.js
Desde la carpeta front:
npx create-next-app@latest .
Responde:
✔ TypeScript? Yes✔ ESLint? Yes✔ Tailwind? Yes✔ src directory? Yes✔ App Router? Yes✔ Turbopack? Yes✔ Import alias? Yes (@/*)
Verifica:
npm run dev

Fase 2 — Instalar dependencias base
npm install axiosnpm install @tanstack/react-querynpm install zustandnpm install react-hook-formnpm install zodnpm install @hookform/resolversnpm install lucide-reactnpm install clsx tailwind-merge

Fase 3 — Instalar Shadcn
npx shadcn@latest init
Configuración recomendada:
Style: New YorkBase color: SlateCSS Variables: Yes
Luego:
npx shadcn@latest add buttonnpx shadcn@latest add inputnpx shadcn@latest add cardnpx shadcn@latest add dialognpx shadcn@latest add tablenpx shadcn@latest add dropdown-menunpx shadcn@latest add selectnpx shadcn@latest add form

Fase 4 — Crear estructura de carpetas
Dentro de src/:
src│├── app├── features├── infrastructure├── providers├── shared├── stores└── types
Luego:
src│├── app│├── features│   └── auth│├── infrastructure│   ├── api│   ├── auth│   └── config│├── providers│├── shared│   ├── components│   ├── hooks│   ├── utils│   ├── constants│   └── types│├── stores│└── types
Todavía no crees clientes, mascotas, ventas, etc.

Fase 5 — Configurar Axios global
Crear:
src/infrastructure/api/axios.ts
Aquí vivirán:


baseURL


timeout


headers globales


Tal como define la arquitectura .

Fase 6 — Configurar React Query
Crear:
src/providers/query-provider.tsx
y registrar el QueryClient.
Luego envolver toda la aplicación desde:
src/app/layout.tsx

Fase 7 — Configurar Zustand
Crear:
src/stores/auth.store.ts
Estado mínimo:
usertenantbranchtoken
La arquitectura indica que Zustand almacena estado de aplicación (usuario, tenant, sucursal, UI), mientras que los datos remotos deben ir en React Query. 

Fase 8 — Configurar autenticación
Crear:
src/infrastructure/auth│├── token-storage.ts└── auth-header.ts
Responsables de:


guardar JWT


leer JWT


eliminar JWT


adjuntar Authorization Header




Fase 9 — Crear la primera feature: Auth
Recién aquí:
features/auth│├── api├── hooks├── components├── views├── services├── schemas├── types└── index.ts
Implementar:
LoginRegisterLogout
Porque todo el sistema depende de que exista autenticación.

Fase 10 — Crear layout principal
Después del login:
DashboardSidebarNavbarTenant SelectorBranch Selector
Todo reutilizable.

Resultado esperado al finalizar esta etapa
Debes poder:
✅ Levantar Next.js
✅ Tener Tailwind + Shadcn funcionando
✅ Tener Axios configurado
✅ Tener React Query configurado
✅ Tener Zustand configurado
✅ Hacer Login
✅ Guardar JWT
✅ Proteger rutas
✅ Mostrar Dashboard vacío
No empezaría Clientes, Mascotas, Agenda o Inventario hasta tener estos 8-10 pasos completos, porque son la infraestructura sobre la que se apoyarán todas las features del sistema.