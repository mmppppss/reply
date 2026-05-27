# Messages (Historial de Mensajes)

Registro de mensajes entrantes y salientes por agente. Solo se guardan si la config `save_messages` esta activada.

## List Messages

> GET

**URL**: `/api/v1/agents/:id_agent/messages?limit=20&offset=0`

**Params**:
| Param | Tipo | Default | Descripcion |
|-------|------|---------|-------------|
| limit | number | 50 | Maximo de registros |
| offset | number | 0 | Paginacion |

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "idAgent": "91f76f63-...",
            "idSession": "47833f7a-...",
            "direction": "incoming",
            "from": "123456789",
            "to": null,
            "chat": "123456789",
            "chatType": "private",
            "content": "Hola",
            "moduleKey": null,
            "createdAt": "2025-05-27T..."
        },
        {
            "id": "uuid",
            "idAgent": "91f76f63-...",
            "idSession": "47833f7a-...",
            "direction": "outgoing",
            "from": null,
            "to": "123456789",
            "chat": "123456789",
            "chatType": "private",
            "content": "Hola! Como puedo ayudarte?",
            "moduleKey": "keyword",
            "createdAt": "2025-05-27T..."
        }
    ]
}
```
