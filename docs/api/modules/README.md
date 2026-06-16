# Modules (Modulos del Agente)

Cada agente tiene modulos que procesan los mensajes entrantes en orden de prioridad.

Los modulos disponibles son:
- **keyword** (priority 0): Busca coincidencias de palabras clave
- **pln** (priority 1): Procesa con IA via OpenRouter
- **developer** (priority 2): Habilita acceso programático via API keys

## List Modules

> GET

**URL**: `/api/v1/agents/:id_agent/modules`

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "idAgent": "91f76f63-...",
            "moduleKey": "keyword",
            "enabled": true,
            "priority": 0,
            "config": {}
        }
    ]
}
```

---

## Upsert Module (Crear o Actualizar)

> PUT

**URL**: `/api/v1/agents/:id_agent/modules/:module_key`

**BODY**:
```json
{
    "enabled": true,
    "priority": 1,
    "config": {
        "systemPrompt": "Eres un asistente experto en ventas.",
        "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
    }
}
```

**RESPONSE**:
```json
{
    "message": "Module updated successfully",
    "data": { ... }
}
```

---

## Toggle Module (Activar/Desactivar)

> POST

**URL**: `/api/v1/agents/:id_agent/modules/:module_key/toggle`

Alterna entre enabled true/false.

---

## Delete Module

> DELETE

**URL**: `/api/v1/agents/:id_agent/modules/:module_key`
