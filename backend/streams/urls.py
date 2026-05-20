from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StreamViewSet

# Criamos o roteador
router = DefaultRouter()

# Registramos a nossa ViewSet no roteador
router.register(r'streams', StreamViewSet, basename='stream')

# Incluímos as rotas geradas pelo roteador nas urlpatterns no Django
urlpatterns = [
    path('', include(router.urls)),
]