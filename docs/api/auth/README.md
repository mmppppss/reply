# Auth

## Login

> POST 

**URL**: `/api/v1/auth/login`

**BODY**:

Type: JSON
```json
{
    "email": "admin@example.com",
    "password": "123456"
}
``` 

**RESPONSE**:
```json
{
    "message":"Login Correcto",
    "data":{
        "user": {
            "id":"ae2a0f49-eadb-4108-a76f-47c979917bf8",
            "username":"admin",
            "email":"admin"
        },
        "token":"eyJhb...nWNyk"
    }
}
```
