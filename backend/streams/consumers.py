import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Stream, ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.stream_slug = self.scope['url_route']['kwargs']['stream_slug']
        self.room_group_name = f'chat_{self.stream_slug}'

        # Entra no grupo da stream
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Sai do grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recebe mensagem do WebSocket (Front-end)
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user'] # Por enquanto, requer autenticação via session/cookie

        if user.is_authenticated:
            # Salva no banco de forma assínccrona
            await self.save_message(user, self.stream_slug, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': user.username,
                }
            )


    # Recebe mensagem do grupo
    async def chat_message(self, event):
        # Envia para o WebSocket cliente
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username'],
        }))

    @database_sync_to_async
    def save_message(self, user, slug, content):
        stream = Stream.objects.get(slug=slug)
        return ChatMessage.objects.create(user=user, stream=stream, content=content)