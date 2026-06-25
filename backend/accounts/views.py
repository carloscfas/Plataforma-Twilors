from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .serializers import UserSerializer, SocialLoginSerializer, SocialLoginResponseSerializer, UserDetailSerializer
from .models import User, Follow
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
            serializer = UserDetailSerializer(user, context={'request': request})
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
            'user': UserDetailSerializer(user, context={'request': request}).data,
            'is_new': is_new
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class UserProfileView(APIView):
    """
    Endpoint para obter e atualizar o perfil do usuário autenticado
    GET /api/accounts/profile/
    PUT /api/accounts/profile/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserDetailSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Atualiza o perfil do usuário autenticado"""
        user = request.user
        
        # Campos que podem ser atualizados
        allowed_fields = ['first_name', 'last_name', 'bio']
        
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        
        # Tratar avatar e banner separadamente (arquivo)
        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']
        if 'banner' in request.FILES:
            user.banner = request.FILES['banner']
        
        user.save()
        serializer = UserDetailSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowStreamerView(APIView):
    """
    Endpoint para seguir/deixar de seguir um streamer
    POST /api/accounts/streamer/<username>/follow/
    DELETE /api/accounts/streamer/<username>/follow/
    GET /api/accounts/streamer/<username>/follow/ - verifica se já segue
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, username):
        """Verifica se o usuário segue o streamer"""
        try:
            streamer = User.objects.get(username=username, is_streamer=True)
            is_following = Follow.objects.filter(
                follower=request.user,
                streamer=streamer
            ).exists()
            
            return Response({
                'is_following': is_following,
                'followers_count': streamer.followers.count()
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Streamer não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request, username):
        """Seguir um streamer"""
        try:
            streamer = User.objects.get(username=username, is_streamer=True)
            
            if streamer == request.user:
                return Response(
                    {'error': 'Você não pode seguir a si mesmo'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            follow, created = Follow.objects.get_or_create(
                follower=request.user,
                streamer=streamer
            )
            
            if created:
                return Response({
                    'message': 'Você está seguindo este streamer',
                    'followers_count': streamer.followers.count()
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'message': 'Você já segue este streamer',
                    'followers_count': streamer.followers.count()
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Streamer não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, username):
        """Deixar de seguir um streamer"""
        try:
            streamer = User.objects.get(username=username, is_streamer=True)
            
            follow = Follow.objects.filter(
                follower=request.user,
                streamer=streamer
            ).first()
            
            if follow:
                follow.delete()
                return Response({
                    'message': 'Você deixou de seguir este streamer',
                    'followers_count': streamer.followers.count()
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': 'Você não estava seguindo este streamer',
                    'followers_count': streamer.followers.count()
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Streamer não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )