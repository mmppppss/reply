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
| **API Key** | `POST /api/v1/developer/keys` | Solo mensajes y contactos del agente |

Con API Key **no es necesario** pasar `id_agent` en la URL — la key ya sabe a qué agente pertenece.

---

## Flujo completo (Quickstart)

```mermaid
sequenceDiagram
    Admin->>API: POST /auth/login (usuario+contraseña)
    API-->>Admin: JWT token
    Admin->>API: POST /developer/keys (body: { name, idAgent })
    API-->>Admin: rp_abc123... (se muestra UNA VEZ)
    Admin->>Dev: Entrega la API key
    Dev->>API: GET /developer/messages (Authorization: Bearer rp_abc123...)
    API-->>Dev: [lista de mensajes]
    Dev->>API: GET /developer/contacts (Authorization: Bearer rp_abc123...)
    API-->>Dev: [lista de contactos]
    Dev->>API: POST /developer/messages/send (Authorization: Bearer rp_abc123...)
    API-->>Dev: { message: "Message sent" }
```

---

## API Keys

### Listar keys

> GET

**URL**: `/api/v1/developer/keys?idAgent=<uuid>`

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

**URL**: `/api/v1/developer/keys`

**Headers**:
```
Authorization: Bearer <jwt>
```

**BODY**:
```json
{
    "name": "Frontend Producción",
    "idAgent": "234af589-3b13-42fc-a8b9-49c33ba756a4"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | string | sí | Nombre descriptivo de la key |
| `idAgent` | string | para JWT | UUID del agente (solo necesario con JWT, con API key se ignora) |

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

**URL**: `/api/v1/developer/keys/:id_key`

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

**URL**: `/api/v1/developer/logs?idAgent=<uuid>`

**Headers**:
```
Authorization: Bearer <jwt> o <api_key>
```

| Parámetro | Con JWT | Con API Key |
|---|---|---|
| `idAgent` | Requerido (query) | Se ignora (se usa el de la key) |

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "idAgent": "234af589-...",
            "idApiKey": "uuid-de-la-key",
            "method": "GET",
            "path": "/api/v1/developer/messages",
            "status": 200,
            "ip": "::1",
            "createdAt": "2026-06-15T10:30:00Z"
        }
    ]
}
```

---

## Endpoints accesibles con API Key

Con API Key **no se pasa `id_agent` en la URL**. Se usa el agente asociado a la key automáticamente.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/developer/messages` | Listar mensajes del agente |
| `POST` | `/api/v1/developer/messages/send` | Enviar mensaje (requiere `provider`) |
| `GET` | `/api/v1/developer/contacts` | Listar contactos |
| `GET` | `/api/v1/developer/contacts/:contact_id` | Ver detalle de contacto |

> Para JWT se usan las rutas con `:id_agent` en la URL: `/api/v1/agents/:id_agent/messages`, etc.

---

## Enviar mensajes

> POST

**URL**: `/api/v1/developer/messages/send`

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
curl -X POST "http://localhost:3000/api/v1/developer/keys" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi App", "idAgent": "234af589-3b13-42fc-a8b9-49c33ba756a4"}'

# 2. Usar la key para leer mensajes (sin id_agent en URL)
curl "http://localhost:3000/api/v1/developer/messages" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..."

# 3. Usar la key para leer contactos (sin id_agent en URL)
curl "http://localhost:3000/api/v1/developer/contacts" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..."

# 4. Usar la key para enviar mensaje (WhatsApp)
curl -X POST "http://localhost:3000/api/v1/developer/messages/send" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..." \
  -H "Content-Type: application/json" \
  -d '{"provider": "whatsapp", "to": "59112345678@s.whatsapp.net", "text": "Hola desde la API"}'

# 5. Usar la key para enviar mensaje (Telegram)
curl -X POST "http://localhost:3000/api/v1/developer/messages/send" \
  -H "Authorization: Bearer rp_a1b2c3d4e5f6789..." \
  -H "Content-Type: application/json" \
  -d '{"provider": "telegram", "to": "123456789", "text": "Hola desde la API"}'

# 6. Listar keys (JWT)
curl "http://localhost:3000/api/v1/developer/keys?idAgent=234af589-3b13-42fc-a8b9-49c33ba756a4" \
  -H "Authorization: Bearer <jwt>"
```
