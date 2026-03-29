# User

## Create

> POST 

**URL**: `/api/v1/user/create`

**BODY**:

Type: JSON
```json
{
    "email": "admin@example.com",
    "password": "123456",
    "username": "admin"
}
``` 

**RESPONSE**:
```json
{
    "message": "User created successfully",
    "data": {
        "email": "admin@example.com",
        "password": "123456",
        "username": "admin"
    }
}
```
