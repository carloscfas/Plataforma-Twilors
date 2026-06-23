from django.shortcuts import render
from .models import Stream
from .serializers import StreamSerializer
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .permissions import IsStreamerOrReadOnly

User = get_user_model()

# Create your views here.

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    permission_classes = [IsStreamerOrReadOnly]
    lookup_field = 'slug'
    
    def perform_create(self, serializer):
        serializer.save(streamer=self.request.user)
    
    @action(detail=False, methods=['GET'], permission_classes=[permissions.AllowAny])
    def by_streamer(self, request, username=None):
        """
        Obtém todos os streams de um streamer específico
        GET /api/streams/by_streamer/?username=<username>
        """
        username = request.query_params.get('username')
        
        if not username:
            return Response(
                {'error': 'Username é requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            streamer = User.objects.get(username=username, is_streamer=True)
            streams = Stream.objects.filter(streamer=streamer).order_by('-created_at')
            serializer = self.get_serializer(streams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Streamer não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
