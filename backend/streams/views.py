from django.shortcuts import render
from .models import Stream
from .serializers import StreamSerializer
from rest_framework import permissions, viewsets
from .permissions import IsStreamerOrReadOnly

# Create your views here.

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    permission_classes = [IsStreamerOrReadOnly]
    lookup_field = 'slug'
    def perform_create(self, serializer):
        serializer.save(streamer=self.request.user)
