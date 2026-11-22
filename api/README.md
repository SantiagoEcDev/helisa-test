# Aravia API — Catálogo de cuentas

Backend del módulo de catálogo de cuentas contables, desarrollado con **NestJS y TypeScript**, siguiendo principios de **Clean Architecture y SOLID**.

## Tecnologías

- NestJS y TypeScript
- class-validator
- Almacenamiento en memoria mediante `Map`

## Ejecución

Desde la raíz del repositorio:

```bash
npm install
npm run dev:api
```

La API estará disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/accounts` | Crear una cuenta contable |
| GET | `/accounts/tree` | Consultar el catálogo jerárquico |
| DELETE | `/accounts/:code` | Eliminar una cuenta sin hijas |

## Arquitectura

Se implementó Clean Architecture, separando el módulo `accounts` en cuatro capas:

- **Domain:** entidades, reglas fundamentales y contratos de repositorio.
- **Application:** casos de uso para crear, consultar y eliminar cuentas.
- **Infrastructure:** implementación del repositorio en memoria.
- **Presentation:** controladores REST, DTO y manejo de excepciones HTTP.

Los casos de uso dependen de la interfaz `AccountRepository`, definida en el dominio, y no de una implementación concreta.

## Reglas de negocio

- Códigos numéricos únicos de 1, 2, 4 o 6 dígitos.
- Nivel y cuenta padre determinados automáticamente por el código.
- Validación de existencia del padre antes de crear una cuenta.
- Naturaleza débito o crédito definida en las clases y heredada por sus descendientes.
- Eliminación restringida a cuentas sin hijas.
- Respuestas HTTP apropiadas para errores de validación, duplicados y conflictos.

## Decisiones técnicas

Se eligió almacenamiento en memoria para priorizar las funcionalidades solicitadas dentro del tiempo de la prueba, evitando la configuración de una base de datos.

Se utilizó `Map` para facilitar las búsquedas por código. El árbol se construye a partir de cuentas almacenadas de forma plana.

La separación mediante interfaces permite reemplazar la persistencia sin modificar los casos de uso.

## Limitaciones

- Los datos se pierden al reiniciar el servidor.
- No hay persistencia transaccional ni garantías de concurrencia.
- No se implementaron movimientos contables; únicamente las operaciones requeridas sobre el catálogo.

## Mejoras futuras

- Persistencia con PostgreSQL y restricciones de integridad.
- Pruebas unitarias y de integración para las reglas de negocio.
- Operaciones transaccionales y manejo de concurrencia.
- Documentación de la API con Swagger.
- Implementación del registro de movimientos contables, restringido a cuentas sin hijas.
