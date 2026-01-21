
## Capa de Base de Datos (Database Layer)

Este proyecto utiliza una **capa de datos desacoplada**, basada en **Drizzle ORM** y **MariaDB**, siguiendo un enfoque de arquitectura limpia:  
los modelos representan la base de datos y los repositorios encapsulan todas las operaciones de lectura y escritura.

---

### 1. Tecnologías usadas

- **TypeScript**
- **Drizzle ORM**
- **MariaDB**
- **mysql2** (driver)
- **drizzle-kit** (migraciones)

---

### 2. Estructura de carpetas

```text
src/
├── database/
│   ├── index.ts                # Inicialización de Drizzle (db)
│   ├── schema/                 # Esquemas (reflejo de la BD)
│   │   └── clients.schema.ts
│   └── repositories/             # Repositorios (CRUD)
│       └── client.repo.ts
│
├── types/
│   └── client.ts               # Tipos y DTOs
│
drizzle/
└── 0001_create_clients.sql     # Migraciones
```

### 3. Principios de diseño
#### Separación de responsabilidades

- Schema (database/schema)

Define la estructura real de la base de datos
Refleja tablas, columnas, tipos y constraints
No contiene lógica

- Repositorio (database/repositor)

Encapsula todas las operaciones CRUD
Nunca expone Drizzle al exterior
Retorna entidades o estados (boolean)

- Tipos (types)

DTOs y contratos de datos
Independientes de Drizzle y de la base de datos

### Generar migraciones
> pnpm drizzle-kit generate

Ejecutar migraciones
> pnpm drizzle-kit migrate


Las migraciones se guardan en la carpeta drizzle/ y deben versionarse.
