# Developer (API Key)

Acceso programático a la API mediante API keys. Complementa al auth JWT (login web).

## Autenticación

Todas las requests deben llevar el header:

```
Authorization: Bearer <token>
```

El token puede ser:

| Tipo | Obtención | Acceso |
|---|---|---|
| **JWT** | `POST /api/v1/auth/login` | Completo (CRUD keys, config, etc.) |
| **API Key** | `POST /api/v1/agents/:id/developer/keys` | Solo mensajes y contactos del agente |

---

## Flujo completo (Quickstart)

```mermaid
sequenceDiagram
    Admin->>API: POST /auth/login (usuario+contraseña)
    API-->>Admin: JWT token
    Admin->>API: POST /developer/keys (crear key)
    API-->>Admin: rp_abc123... (se muestra UNA VEZ)
    Admin->>Dev: Entrega la API key
    Dev->>API: GET /messages (Authorization: Bearer rp_abc123...)
    API-->>Dev: [lista de mensajes]
    Dev->>API: GET /contacts (Authorization: Bearer rp_abc123...)
    API-->>Dev: [lista de contactos]
    Dev->>API: POST /messages/send (Authorization: Bearer rp_abc123...)
    API-->>Dev: { message: "Message sent" }
```

---

## API Keys

### Listar keys

> GET

**URL**: `/api/v1/agents/:id_agent/developer/keys`

**Headers**:
```
Authorization: Bearer <jwt>
```

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Frontend Producción",
            "prefix": "a1b2c3d4e5f6",
            "active": true,
            "lastUsedAt": "2026-06-15T10:30:00Z",
            "createdAt": "2026-06-14T08:00:00Z"
        }
    ]
}
```

---

### Crear key

> POST

**URL**: `/api/v1/agents/:id_agent/developer/keys`

**Headers**:
```
Authorization: Bearer <jwt>
```

**BODY**:
```json
{
    "name": "Frontend Producción"
}
```

**RESPONSE** (201):
```json
{
    "message": "API key created",
    "data": {
        "key": "rp_a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef",
        "prefix": "a1b2c3d4e5f6"
    }
}
```

> ⚠️ **IMPORTANTE**: La key completa se muestra **solo una vez** al crearla. No se puede recuperar después. Guárdala de inmediato.

**Estructura de la key:**
```
rp_<64 caracteres hexadecimales>
  │
  └── prefijo "rp_" (reply)
      └── primeros 12 hex → prefix (identificador único en DB)
          └── resto → se hashea con bcrypt
```

---

### Revocar key

> DELETE

**URL**: `/api/v1/agents/:id_agent/developer/keys/:id_key`

**Headers**:
```
Authorization: Bearer <jwt>
```

**RESPONSE**:
```json
{
    "message": "API key revoked"
}
```

Una key revocada deja de funcionar inmediatamente. No se puede reactivar.

---

## Logs de uso

Cada request autenticado con API Key registra un log automáticamente.

> GET

**URL**: `/api/v1/agents/:id_agent/developer/logs`

**Headers**:
```
Authorization: Bearer <jwt> o <api_key>
```

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "idAgent": "234af589-...",
            "idApiKey": "uuid-de-la-key",
            "method": "GET",
            "path": "/api/v1/agents/234af589-.../messages",
            "status": 200,
            "ip": "::1",
            "createdAt": "2026-06-15T10:30:00Z"
        }
    ]
}
```

---

## Endpoints accesibles con API Key

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/agents/:id_agent/messages` | Listar mensajes del agente |
| `POST` | `/api/v1/agents/:id_agent/messages/send` | Enviar mensaje (requiere `provider`) |
| `GET` | `/api/v1/agents/:id_agent/contacts` | Listar contactos |
| `GET` | `/api/v1/agents/:id_agent/contacts/:contact_id` | Ver detalle de contacto |

La API key **solo** funciona para el agente al que fue asignada. Un JWT puede acceder a cualquier agente.

---

## Enviar mensajes

> POST

**URL**: `/api/v1/agents/:id_agent/messages/send`

**Headers**:
```
Authorization: Bearer <jwt> o <api_key>
```

**BODY**:
```json
{
    "provider": "whatsapp",
    "to": "59112345678@s.whatsapp.net",
    "text": "Hola, este es un mensaje desde la API"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `provider` | string | sí | `"whatsapp"` o `"telegram"` |
| `to` | string | sí | Destino |
| `text` | string | sí | Contenido del mensaje |

**RESPONSE**:
```json
{
    "message": "Message sent",
    "data": {
        "success": true,
        "messageId": "true"
    }
}
```

Si el agente no tiene una sesión activa para ese provider, responde con error.

---

## Ejemplo con curl

```bash
# 1. Crear key (requiere JWT)
curl -X POST "http://localhost:3000/api/v1/agents/234af589-3b13-42fc-a8b9-49c33ba756a4/developer/keys" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi App"}'

# 2. Usar la key para leer mensajes
curl "http://localhost:3000/api/v1/agents/234af589-3b13-42fc-a8b9-49c33ba756a4/messages" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..."

# 3. Usar la key para leer contactos
curl "http://localhost:3000/api/v1/agents/234af589-3b13-42fc-a8b9-49c33ba756a4/contacts" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..."

# 4. Usar la key para enviar un mensaje (WhatsApp)
curl -X POST "http://localhost:3000/api/v1/agents/234af589-3b13-42fc-a8b9-49c33ba756a4/messages/send" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..." \
  -H "Content-Type: application/json" \
  -d '{"provider": "whatsapp", "to": "59112345678@s.whatsapp.net", "text": "Hola desde la API"}'

# 5. Usar la key para enviar un mensaje (Telegram)
curl -X POST "http://localhost:3000/api/v1/agents/234af589-3b13-42fc-a8b9-49c33ba756a4/messages/send" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..." \
  -H "Content-Type: application/json" \
  -d '{"provider": "telegram", "to": "123456789", "text": "Hola desde la API"}'
```
