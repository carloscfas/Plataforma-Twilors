from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, SocialAccount


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


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ('id', 'provider', 'email', 'name', 'picture_url', 'created_at')
        read_only_fields = ('created_at',)


class UserDetailSerializer(serializers.ModelSerializer):
    social_accounts = SocialAccountSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'is_streamer', 'bio', 'social_accounts')


class SocialLoginSerializer(serializers.Serializer):
    """Serializer para autenticação com redes sociais"""
    provider = serializers.ChoiceField(choices=['google', 'facebook', 'apple'])
    token = serializers.CharField(required=True)

    def validate_provider(self, value):
        if value not in ['google', 'facebook', 'apple']:
            raise serializers.ValidationError("Provider inválido. Use 'google', 'facebook' ou 'apple'")
        return value


class SocialLoginResponseSerializer(serializers.Serializer):
    """Resposta após login social bem-sucedido"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserDetailSerializer()
    is_new = serializers.BooleanField()