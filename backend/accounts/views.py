from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .serializers import UserSerializer, SocialLoginSerializer, SocialLoginResponseSerializer, UserDetailSerializer
from .models import User
from .oauth_services import GoogleOAuthService, FacebookOAuthService, AppleOAuthService
from django.http import Http404

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class StreamerProfileView(APIView):
    """
    Endpoint para obter perfil de um streamer específico por username
    GET /api/accounts/streamer/<username>/
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username, is_streamer=True)
            serializer = UserDetailSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Streamer não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def social_login(request):
    """
    Endpoint para login com redes sociais
    
    Body:
    {
        "provider": "google" | "facebook" | "apple",
        "token": "token-do-provedor"
    }
    
    Response:
    {
        "access": "jwt-token",
        "refresh": "refresh-token",
        "user": {...},
        "is_new": true|false
    }
    """
    serializer = SocialLoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    provider = serializer.validated_data['provider']
    token = serializer.validated_data['token']
    
    try:
        # Verifica e extrai dados do token baseado no provider
        if provider == 'google':
            user_data = GoogleOAuthService.verify_token(token)
            if not user_data:
                return Response(
                    {'error': 'Token do Google inválido'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            user_data['access_token'] = token
            user, is_new = GoogleOAuthService.get_or_create_user(user_data)
            
        elif provider == 'facebook':
            user_data = FacebookOAuthService.verify_token(token)
            if not user_data:
                return Response(
                    {'error': 'Token do Facebook inválido'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            user_data['access_token'] = token
            user, is_new = FacebookOAuthService.get_or_create_user(user_data)
            
        elif provider == 'apple':
            user_data = AppleOAuthService.verify_token(token)
            if not user_data:
                return Response(
                    {'error': 'Token do Apple inválido'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            user_data['access_token'] = token
            user, is_new = AppleOAuthService.get_or_create_user(user_data)
        
        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserDetailSerializer(user).data,
            'is_new': is_new
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )