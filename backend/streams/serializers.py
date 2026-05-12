from rest_framework import serializers
from streams.models import Stream


class StreamSerializer(serializers.ModelSerializer):
    streamer_username = serializers.ReadOnlyField(source='streamer.username')

    class Meta:
        model = Stream
        # Listamos todos os campos que queremos que o JSON tenha
        fields = ('id', 'streamer', 'streamer_username', 'title', 'description', 'slug', 'is_live', 'created_at', 'updated_at', 'thumbnail', 'video_url')
        # Campos que o usuário não pode enviar no POST/PUT
        read_only_fields = ('streamer', 'slug', 'created_at', 'updated_at')