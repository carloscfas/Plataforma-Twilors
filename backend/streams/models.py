from django.db import models
from django.conf import settings



class Stream(models.Model):
    # Quem está Transmitindo? (FK para o nosso User customizado)
    streamer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='streams')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Identificador único na URL (ex: twilors.com/live/meu-jogo)
    slug = models.SlugField(unique=True, blank=True)

    # Metadados da Live
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Thumbnail da Live
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.streamer.username}"