import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Stream, ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.stream_slug = self.scope['url_route']['kwargs']['stream_slug']
        self.room_group_name = f'chat_{self.stream_slug}'
        user = self.scope.get('user')

        print(f"Tentativa de conexão WebSocket - Sala: {self.room_group_name} - Usuário: {user}")

        # Entra no grupo da sala
        try:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            print(f"Conexão aceita para {user}")
        except Exception as e:
            print(f"Erro ao conectar ao grupo do Channel Layer: {e}")
            await self.close()

    async def disconnect(self, close_code):
        print(f"WebSocket desconectado com código: {close_code}")
        # Sai do grupo da sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recebe mensagem do WebSocket
    async def receive(self, text_data):
        print(f"Dados brutos recebidos: {text_data}")
        try:
            data = json.loads(text_data)
            message = data['message']
            user = self.scope.get('user')

            username = user.username if user and user.is_authenticated else "Anônimo"
            print(f"Mensagem de {username}: {message}")

            # Salva no banco de dados
            if user and user.is_authenticated:
                await self.save_message(user, self.stream_slug, message)

            # Envia a mensagem para o grupo
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username
                }
            )
        except Exception as e:
            print(f"Erro ao processar mensagem recebida: {e}")

    # Recebe mensagem do grupo e envia para o WebSocket
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @database_sync_to_async
    def save_message(self, user, slug, content):
        try:
            stream = Stream.objects.get(slug=slug)
            return ChatMessage.objects.create(user=user, stream=stream, content=content)
        except Stream.DoesNotExist:
            return None
