## Ejecucion
### Requisitos:
- pnpm 
- node 20+

```bash
# solo la primera ves
pnpm install

# ejecutar
pnpm dev
```

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

## Documentacion API
[Documentacion](api/README.md) 
