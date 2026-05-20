from django.shortcuts import render
from .models import Stream
from .serializers import StreamSerializer
from rest_framework import permissions, viewsets

# Create your views here.

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(streamer=self.request.user)
