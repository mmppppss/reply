# Config (Configuracion del Agente)

Configuracion clave-valor por agente. Cada agente tiene su propio conjunto de configuraciones.

| Key | Tipo | Default | Descripcion |
|-----|------|---------|-------------|
| `save_messages` | boolean | `false` | Guarda el historial de mensajes en la tabla `messages` |

## List All Config

> GET

**URL**: `/api/v1/agents/:id_agent/config`

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "configKey": "save_messages",
            "configValue": true
        }
    ]
}
```

---

## Get Config by Key

> GET

**URL**: `/api/v1/agents/:id_agent/config/:key`

**RESPONSE**:
```json
{
    "data": {
        "key": "save_messages",
        "value": true
    }
}
```

---

## Set Config

> PUT

**URL**: `/api/v1/agents/:id_agent/config/:key`

**BODY**:
```json
{
    "value": true
}
```

**RESPONSE**:
```json
{
    "message": "Config updated",
    "data": { ... }
}
```

---

## Delete Config

> DELETE

**URL**: `/api/v1/agents/:id_agent/config/:key`
