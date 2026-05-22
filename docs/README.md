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

## Motor de Inferencia (InferenceEngine)

Sistema de auto-respuesta basado en palabras clave. Cuando llega un mensaje entrante (WhatsApp o Telegram), el motor:

1. Busca en cache (memoria) las reglas del agente
2. Si el texto contiene la `keyword` configurada, responde automaticamente
3. Solo dispara la **primera** coincidencia por mensaje

Las reglas se crean via API y se recargan automaticamente en cache.

---

## Documentacion API
[Documentacion](api/README.md)
