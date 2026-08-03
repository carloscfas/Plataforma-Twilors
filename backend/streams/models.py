from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid

class Stream(models.Model):
    # Quem está Transmitindo? (FK para o nosso User customizado)
    streamer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='streams')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Identificador único na URL (ex: twilors.com/live/meu-jogo)
    slug = models.SlugField(unique=True, blank=True)

    # Metadados da Live
    is_live = models.BooleanField(default=False)
    viewer_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Thumbnail da Live
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    # Tipo de transmissão
    STREAM_TYPE_CHOICES = [
        ('rtmp', 'RTMP'),
        ('youtube', 'YouTube'),
    ]
    stream_type = models.CharField(max_length=20, choices=STREAM_TYPE_CHOICES, default='rtmp')

    # Video url (opcional, para compatibilidade com YouTube)
    video_url = models.URLField(max_length=500, blank=True, null=True)

    # Chave RTMP para streaming via OBS/Streamlabs
    rtmp_key = models.CharField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Geramos um slug a partir do título + um pequeno ID único para evitar duplicatas
            base_slug = slugify(self.title)
            self.slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
        
        if not self.rtmp_key and self.stream_type == 'rtmp':
            # Gerar chave RTMP única
            self.rtmp_key = str(uuid.uuid4())
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.streamer.username}"


class ChatMessage(models.Model):
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.content[:20]}"