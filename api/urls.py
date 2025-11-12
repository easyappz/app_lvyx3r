from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ChangePasswordView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('password/change', ChangePasswordView.as_view(), name='password-change'),
]
