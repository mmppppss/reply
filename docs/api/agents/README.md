# Agents

## Create Agent

> POST

**URL**: `/api/v1/user/:id_user/agents`

**BODY**:
```json
{
    "name": "Mi Bot",
    "description": "Descripcion del bot"
}
```

**RESPONSE**:
```json
{
    "message": "Agent created successfully",
    "data": {
        "id": "91f76f63-...",
        "idUser": "0380b783-...",
        "name": "Mi Bot",
        "description": "Descripcion del bot"
    }
}
```

---

## List Agents

> GET

**URL**: `/api/v1/user/:id_user/agents`

**RESPONSE**:
```json
{
    "data": [
        {
            "id": "91f76f63-...",
            "name": "Mi Bot",
            "description": "Descripcion del bot"
        }
    ]
}
```

---

## Get Agent by ID

> GET

**URL**: `/api/v1/user/:id_user/agents/:id_agent`

---

## Update Agent

> PUT

**URL**: `/api/v1/user/:id_user/agents/:id_agent`

**BODY**:
```json
{
    "name": "Nuevo nombre",
    "description": "Nueva descripcion"
}
```

---

## Delete Agent

> DELETE

**URL**: `/api/v1/user/:id_user/agents/:id_agent`

---

## Connect Agent (WhatsApp)

> POST

**URL**: `/api/v1/user/:id_user/agents/:id_agent/connect?type=whatsapp`

Genera un codigo QR en la terminal para escanear con WhatsApp.

---

## Connect Agent (Telegram)

> POST

**URL**: `/api/v1/user/:id_user/agents/:id_agent/connect?type=telegram`

**BODY**:
```json
{
    "token": "8358356238:AAGt_fjOT4-p-cvyL51pLpUEYa1mltmGhZs"
}
```

**RESPONSE**:
```json
{
    "sessionId": "47833f7a-...",
    "message": "Telegram bot connected"
}
```

---

## Send Message

> POST

**URL**: `/api/v1/user/:id_user/agents/:id_agent/send`

**BODY**:
```json
{
    "to": "123456789",
    "text": "Hola desde el bot!"
}
```
