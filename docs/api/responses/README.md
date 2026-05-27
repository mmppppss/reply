# Responses (Auto-Reply)

Reglas de respuesta automatica. Cuando un mensaje entrante contiene una `keyword`, el modulo **Keyword** (priority 0) responde automaticamente con el `response` preconfigurado.

Las reglas se precargan en memoria al iniciar el servidor y se recargan al crear/eliminar una regla.

## Create Response Rule

> POST

**URL**: `/api/v1/agents/:id_agent/responses`

**BODY**:
```json
{
    "keyword": "hola",
    "response": "Hola! Como puedo ayudarte?"
}
```

**RESPONSE**:
```json
{
    "message": "Response rule created",
    "data": {
        "id": "uuid",
        "idAgent": "91f76f63-...",
        "keyword": "hola",
        "response": "Hola! Como puedo ayudarte?"
    }
}
```

---

## List Response Rules

> GET

**URL**: `/api/v1/agents/:id_agent/responses`

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "keyword": "hola",
            "response": "Hola! Como puedo ayudarte?"
        }
    ]
}
```

---

## Delete Response Rule

> DELETE

**URL**: `/api/v1/agents/:id_agent/responses/:id_response`
