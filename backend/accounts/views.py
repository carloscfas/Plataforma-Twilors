from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import UserSerializer
from .models import User

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)