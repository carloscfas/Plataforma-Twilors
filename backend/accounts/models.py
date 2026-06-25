from django.db import models
from django.contrib.auth.models import AbstractUser

# Criamos o models do Accounts
class User(AbstractUser):
    is_streamer = models.BooleanField(default=False)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/', null=True, blank=True)


class SocialAccount(models.Model):
    """Armazena contas sociais vinculadas ao usuário"""
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('facebook', 'Facebook'),
        ('apple', 'Apple'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_id = models.CharField(max_length=255, unique=True)  # ID do usuário na rede social
    email = models.EmailField(blank=True)
    name = models.CharField(max_length=255, blank=True)
    picture_url = models.URLField(blank=True, null=True)
    access_token = models.TextField()  # Token de acesso (pode ser longo)
    refresh_token = models.TextField(blank=True, null=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'provider')
    
    def __str__(self):
        return f"{self.user.username} - {self.provider}"


class Follow(models.Model):
    """Modelo para seguir/deixar de seguir streamers"""
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    streamer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'streamer')
    
    def __str__(self):
        return f"{self.follower.username} segue {self.streamer.username}"