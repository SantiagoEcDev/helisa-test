# Aravia Web — Catálogo de cuentas

Interfaz web para administrar el catálogo de cuentas contables de Aravia, desarrollada con **React, TypeScript y Tailwind CSS**.

## Tecnologías

- React y TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod

## Ejecución

Desde la raíz del repositorio:

```bash
npm install
npm run dev:web
```

El frontend estará disponible en `http://localhost:5173`.

### Variables de entorno

Configurar `web/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Funcionalidades

- Visualización del catálogo como árbol jerárquico.
- Expansión y colapso individual de las cuentas.
- Opciones para expandir o colapsar todo el árbol.
- Formulario de creación con validación previa mediante Zod.
- Visualización de errores de la API junto a los campos correspondientes.
- Eliminación de cuentas con confirmación.
- Restricción visual para impedir eliminar cuentas con hijas.
- Estados de carga, error y catálogo vacío.
- Actualización del catálogo después de crear o eliminar cuentas.
- Visualización del nivel y la naturaleza contable de cada cuenta.

## Arquitectura

Se utilizó **Screaming Architecture**, organizando el código por funcionalidades en lugar de agruparlo exclusivamente por tipos técnicos.

```text
src/
├── features/
│   └── accounts/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── services/
│       └── types/
├── shared/
│   └── lib/
└── App.tsx
```

### Responsabilidades

- **Components:** presentación e interacción del usuario.
- **Hooks:** gestión de estados y operaciones asíncronas.
- **Schemas:** validaciones del formulario.
- **Services:** comunicación con la API.
- **Types:** contratos de datos utilizados por el módulo.
- **Shared:** cliente HTTP y utilidades reutilizables.

## Decisiones técnicas

Se utilizó React Hook Form junto con Zod para separar la validación del formulario de su presentación.

El árbol se implementó mediante componentes recursivos, permitiendo representar los distintos niveles sin duplicar componentes.

Se optó por hooks personalizados y estado local de React, evitando introducir un gestor global de estado innecesario para el alcance actual.

Tailwind CSS permite mantener una interfaz consistente y responsive sin incorporar una librería de componentes adicional.

## Limitaciones

- El catálogo depende de la disponibilidad de la API.
- Los datos se actualizan mediante nuevas consultas después de las operaciones.
- No se implementaron búsqueda, edición ni creación de cuentas hijas directamente desde un nodo.

## Mejoras futuras

- Incorporar TanStack Query para caché e invalidación de consultas.
- Implementar búsqueda por código o nombre con expansión automática de ramas.
- Permitir crear cuentas hijas desde su cuenta padre.
- Agregar edición de nombres.
- Incorporar pruebas de componentes y accesibilidad.
- Mejorar el manejo de errores utilizando códigos estructurados de la API.
