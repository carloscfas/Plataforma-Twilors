import os
import requests
import json
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from .models import User, SocialAccount


class GoogleOAuthService:
    """Serviço para autenticação com Google"""
    
    @staticmethod
    def verify_token(token):
        """Verifica e decodifica token do Google"""
        try:
            # Verifica o token com a API do Google
            url = "https://www.googleapis.com/oauth2/v1/userinfo"
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Erro ao verificar token Google: {e}")
            return None
    
    @staticmethod
    def get_or_create_user(user_data):
        """Obtém ou cria usuário baseado em dados do Google"""
        google_id = user_data.get('id')
        email = user_data.get('email')
        name = user_data.get('name')
        picture = user_data.get('picture')
        
        # Tenta encontrar usuário existente pela conta social
        social_account = SocialAccount.objects.filter(
            provider='google',
            provider_id=google_id
        ).first()
        
        if social_account:
            return social_account.user, False
        
        # Tenta encontrar usuário pelo email
        user = User.objects.filter(email=email).first()
        
        if not user:
            # Cria novo usuário
            username = email.split('@')[0]
            counter = 1
            base_username = username
            
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=name.split()[0] if name else '',
                last_name=' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
            )
        
        # Cria ou atualiza conta social
        social_account, created = SocialAccount.objects.update_or_create(
            provider='google',
            provider_id=google_id,
            defaults={
                'user': user,
                'email': email,
                'name': name,
                'picture_url': picture,
                'access_token': user_data.get('access_token', ''),
            }
        )
        
        return user, True


class FacebookOAuthService:
    """Serviço para autenticação com Facebook"""
    
    @staticmethod
    def verify_token(token):
        """Verifica token do Facebook"""
        try:
            app_id = os.getenv('FACEBOOK_APP_ID')
            app_secret = os.getenv('FACEBOOK_APP_SECRET')
            
            url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={token}"
            response = requests.get(url)
            
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Erro ao verificar token Facebook: {e}")
            return None
    
    @staticmethod
    def get_or_create_user(user_data):
        """Obtém ou cria usuário baseado em dados do Facebook"""
        facebook_id = user_data.get('id')
        email = user_data.get('email')
        name = user_data.get('name')
        picture = user_data.get('picture', {}).get('data', {}).get('url')
        
        # Tenta encontrar usuário existente pela conta social
        social_account = SocialAccount.objects.filter(
            provider='facebook',
            provider_id=facebook_id
        ).first()
        
        if social_account:
            return social_account.user, False
        
        # Se não tem email, gera um baseado no ID
        if not email:
            email = f"fb_{facebook_id}@facebook.local"
        
        # Tenta encontrar usuário pelo email
        user = User.objects.filter(email=email).first()
        
        if not user:
            # Cria novo usuário
            username = name.lower().replace(' ', '_') if name else f"fb_{facebook_id}"
            counter = 1
            base_username = username
            
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=name.split()[0] if name else '',
                last_name=' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
            )
        
        # Cria ou atualiza conta social
        social_account, created = SocialAccount.objects.update_or_create(
            provider='facebook',
            provider_id=facebook_id,
            defaults={
                'user': user,
                'email': email,
                'name': name,
                'picture_url': picture,
                'access_token': user_data.get('access_token', ''),
            }
        )
        
        return user, True


class AppleOAuthService:
    """Serviço para autenticação com Apple"""
    
    @staticmethod
    def verify_token(id_token):
        """Verifica e decodifica token do Apple"""
        try:
            import jwt
            from jwt import PyJWKClient
            
            # Apple's public keys URL
            url = "https://appleid.apple.com/auth/keys"
            
            # Decodifica sem verificação primeiro para pegar o header
            unverified_header = jwt.get_unverified_header(id_token)
            
            # Obtém a chave pública do Apple
            client = PyJWKClient(url)
            key = client.get_signing_key_from_jwt(id_token)
            
            # Decodifica e verifica o token
            decoded = jwt.decode(
                id_token,
                key.key,
                algorithms=["RS256"],
                audience=os.getenv('APPLE_CLIENT_ID')
            )
            
            return decoded
        except Exception as e:
            print(f"Erro ao verificar token Apple: {e}")
            return None
    
    @staticmethod
    def get_or_create_user(user_data):
        """Obtém ou cria usuário baseado em dados do Apple"""
        apple_id = user_data.get('sub')  # Subject claim é o ID único do Apple
        email = user_data.get('email')
        
        # Tenta encontrar usuário existente pela conta social
        social_account = SocialAccount.objects.filter(
            provider='apple',
            provider_id=apple_id
        ).first()
        
        if social_account:
            return social_account.user, False
        
        # Tenta encontrar usuário pelo email
        user = None
        if email:
            user = User.objects.filter(email=email).first()
        
        if not user:
            # Cria novo usuário
            # Apple pode não fornecer email na primeira autenticação
            if not email:
                email = f"apple_{apple_id}@appleid.local"
            
            username = email.split('@')[0]
            counter = 1
            base_username = username
            
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
            )
        
        # Cria ou atualiza conta social
        social_account, created = SocialAccount.objects.update_or_create(
            provider='apple',
            provider_id=apple_id,
            defaults={
                'user': user,
                'email': email,
                'access_token': user_data.get('access_token', ''),
            }
        )
        
        return user, True
