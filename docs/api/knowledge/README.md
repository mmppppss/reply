# Knowledge (Base de Conocimiento)

Un solo registro por agente. El campo `data` (JSONB) contiene toda la información estructurada que el módulo PLN inyecta como contexto al responder.

## Obtener conocimiento

> GET

**URL**: `/api/v1/agents/:id_agent/knowledge`

**RESPONSE**:
```json
{
    "data": {
        "nombre": "Tienda XYZ",
        "productos": [
            { "id": "PROD-001", "nombre": "Laptop", "precio": 1000 },
            { "id": "PROD-002", "nombre": "Mouse", "precio": 25 }
        ],
        "horarios": "Lun-Vie 9:00-18:00"
    }
}
```

Si no hay conocimiento registrado: `{ "data": null }`

---

## Subir conocimiento (append)

> POST

**URL**: `/api/v1/agents/:id_agent/knowledge/upload`

**BODY** (array de items):
```json
{
    "data": [
        { "id": "PROD-001", "nombre": "Laptop", "precio": 1000, "stock": 5 },
        { "id": "PROD-002", "nombre": "Mouse", "precio": 25, "stock": 50 }
    ]
}
```

**RESPONSE**:
```json
{
    "message": "Knowledge uploaded",
    "data": [ ... ]
}
```

El `idAgent` del body se ignora (se toma del URL).

Si ya existía un registro, los nuevos items se **agregan al array existente**. Si no, se crea.
