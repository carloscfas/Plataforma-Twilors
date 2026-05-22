from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    # Definimos explicitamente para adicionar o write_only
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # .get() evita erro se não vier email
            password=validated_data['password'],
            is_streamer=validated_data.get('is_streamer', False) # O jeito certo de definir padrão
        )
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_streamer')