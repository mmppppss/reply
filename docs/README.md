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

Este proyecto utiliza una **capa de datos desacoplada**, basada en **Drizzle ORM** y **PostgreSQL**, siguiendo un enfoque de arquitectura limpia:  
los modelos representan la base de datos y los repositorios encapsulan todas las operaciones de lectura y escritura.

---

### 1. Tecnologias usadas

- **TypeScript**
- **Drizzle ORM**
- **PostgreSQL**
- **postgres** (driver)
- **drizzle-kit** (migraciones)

---

## Plataformas Soportadas

### WhatsApp
- Conexion via codigo QR (escaneo con WhatsApp Web)
- Libreria: `@whiskeysockets/baileys`

### Telegram
- Conexion via token de BotFather
- Libreria: `telegraf`

---

## Sistema de Modulos (ModuleRegistry)

Cada agente procesa los mensajes a traves de modulos ejecutados en orden de prioridad:

1. **Keyword** (priority 0): Busca palabras clave en cache. Si hay match, responde y termina.
2. **PLN** (priority 1): Si no hay match de keyword, envia el texto a OpenRouter con IA.

Si la config `save_messages` esta activada, se guarda automaticamente el historial de mensajes entrantes y salientes.

---

## Documentacion API
[Documentacion](api/README.md)
