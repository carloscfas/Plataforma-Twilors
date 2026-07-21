from django.urls import path
from .views import RegisterView, social_login, StreamerProfileView, UserProfileView, FollowingListView, FollowStreamerView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('social-login/', social_login, name='social_login'),
    path('streamer/<str:username>/', StreamerProfileView.as_view(), name='streamer_profile'),
    path('streamer/<str:username>/follow/', FollowStreamerView.as_view(), name='follow_streamer'),
    path('following/', FollowingListView.as_view(), name='following_list'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]