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
    
    @action(detail=False, methods=['GET'], permission_classes=[permissions.AllowAny])
    def search(self, request):
        """
        Pesquisa streams por título e streamers por username
        GET /api/streams/search/?q=<termo>
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {'error': 'Termo de pesquisa é requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Pesquisar streams por título
        streams = Stream.objects.filter(
            title__icontains=query
        ).select_related('streamer').order_by('-created_at')
        
        # Pesquisar streamers por username
        streamers = User.objects.filter(
            username__icontains=query,
            is_streamer=True
        )
        
        # Serializar resultados
        stream_serializer = self.get_serializer(streams, many=True)
        
        streamers_data = []
        for streamer in streamers:
            streamers_data.append({
                'id': streamer.id,
                'username': streamer.username,
                'bio': streamer.bio,
                'avatar': streamer.avatar.url if streamer.avatar else None,
                'is_streamer': streamer.is_streamer
            })
        
        return Response({
            'streams': stream_serializer.data,
            'streamers': streamers_data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'], permission_classes=[permissions.AllowAny])
    def top_lives(self, request):
        """
        Obtém as melhores lives (prioriza lives ao vivo, depois lives recentes)
        Ranqueamento baseado em: viewer_count + (seguidores do streamer * 0.1)
        Retorna todas as lives disponíveis sem duplicação
        GET /api/streams/top_lives/
        """
        from django.db.models import Count, F, Case, When, IntegerField
        
        # Buscar todas as lives com ranqueamento, priorizando lives ao vivo
        streams = Stream.objects.all().select_related('streamer').annotate(
            followers_count=Count('streamer__followers')
        ).annotate(
            popularity_score=F('viewer_count') + (F('followers_count') * 0.1)
        ).annotate(
            live_priority=Case(
                When(is_live=True, then=1),
                default=0,
                output_field=IntegerField()
            )
        ).order_by('-live_priority', '-popularity_score', '-created_at')
        
        serializer = self.get_serializer(streams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
