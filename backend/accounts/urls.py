from django.urls import path
from .views import RegisterView, social_login

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('social-login/', social_login, name='social_login'),
]