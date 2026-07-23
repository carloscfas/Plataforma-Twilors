from rest_framework import serializers
from streams.models import Stream


class StreamSerializer(serializers.ModelSerializer):
    streamer_username = serializers.ReadOnlyField(source='streamer.username')
    streamer_followers_count = serializers.SerializerMethodField()

    class Meta:
        model = Stream
        fields = ('id', 'streamer', 'streamer_username', 'streamer_followers_count',
                  'title', 'description', 'slug', 'is_live', 'viewer_count',
                  'created_at', 'updated_at', 'thumbnail', 'video_url')
        read_only_fields = ('streamer', 'slug', 'created_at', 'updated_at', 'thumbnail', 'viewer_count')

    def get_streamer_followers_count(self, obj):
        return obj.streamer.followers.count()