# API ROUTES 

## Login

> POST 

**URL**: `/api/v1/auth/login`

**BODY**:
```json
{
    "username":"admin",
    "email": "admin@example.com",
    "password": "123456"
}
``` 

**RESPONSE**:
```json
{
    "message":"Login successful",
    "user":{
        "id":1,
        "email":"admin@example.com",
        "name":"Admin User"
    },
    "accessToken":"fake-access-token-123",
    "refreshToken":"fake-refresh-token-456"
}
```
