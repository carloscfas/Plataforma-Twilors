from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # ws://localhost:8000/ws/chat/<slug>/
    re_path(r'ws/chat/(?P<stream_slug>[\w-]+)/$', consumers.ChatConsumer.as_asgi()),
]
