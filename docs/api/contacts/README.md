# Contacts (Contactos)

Directorio de contactos por agente. Se pueden crear manualmente o auto-guardarse si la config `save_contacts` esta activada.

## List Contacts

> GET

**URL**: `/api/v1/agents/:id_agent/contacts`

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "uuid",
            "idAgent": "91f76f63-...",
            "contactId": "52123456789",
            "name": "Juan Perez",
            "platform": "whatsapp",
            "chatType": "private",
            "firstSeenAt": "2025-05-27T...",
            "lastInteractionAt": "2025-05-27T..."
        }
    ]
}
```

---

## Get Contact by contactId

> GET

**URL**: `/api/v1/agents/:id_agent/contacts/:contact_id`

---

## Create Contact

> POST

**URL**: `/api/v1/agents/:id_agent/contacts`

**BODY**:
```json
{
    "contactId": "52123456789",
    "name": "Juan Perez",
    "platform": "whatsapp",
    "chatType": "private"
}
```

---

## Update Contact

> PUT

**URL**: `/api/v1/agents/:id_agent/contacts/:contact_id`

**BODY**:
```json
{
    "name": "Juan Carlos Perez",
    "platform": "whatsapp",
    "chatType": "private"
}
```

---

## Delete Contact

> DELETE

**URL**: `/api/v1/agents/:id_agent/contacts/:contact_id`
