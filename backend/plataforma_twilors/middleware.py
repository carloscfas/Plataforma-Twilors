import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Middleware customizado para autenticar WebSockets via Token JWT na Query String.
    """
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Pega os query params (ex: ?token=...)
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                # Decodifica o token usando a SECRET_KEY do Django
                # O simplejwt usa por padrão a SECRET_KEY e algoritmo HS256
                decoded_data = jwt.decode(token[0], settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data.get("user_id")
                
                # Injeta o usuário no scope
                scope["user"] = await get_user(user_id)
            except Exception as e:
                print(f"Erro de Autenticação JWT no WebSocket: {e}")
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)
