from django.contrib.auth.hashers import check_password, make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Member
from .serializers import (
    MemberSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
)
from .auth import generate_jwt


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            data = MemberSerializer(member).data
            return Response(data, status=status.HTTP_201_CREATED)
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        try:
            member = Member.objects.get(email=email)
        except Member.DoesNotExist:
            return Response({"detail": "Неверная почта или пароль"}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, member.password):
            return Response({"detail": "Неверная почта или пароль"}, status=status.HTTP_400_BAD_REQUEST)
        token = generate_jwt(member.id)
        return Response({"token": token, "member": MemberSerializer(member).data}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        member = getattr(request, 'member', None) or getattr(request.user, 'member', None)
        if member is None:
            member = getattr(request.user, 'member', None)
        if member is None:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(MemberSerializer(member).data)

    def put(self, request):
        member = getattr(request, 'member', None) or getattr(request.user, 'member', None)
        if member is None:
            member = getattr(request.user, 'member', None)
        if member is None:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        data = {
            'name': request.data.get('name', member.name),
            'email': request.data.get('email', member.email),
        }
        if data['email'] != member.email and Member.objects.filter(email=data['email']).exists():
            return Response({"detail": "Почта уже занята"}, status=status.HTTP_400_BAD_REQUEST)
        member.name = data['name']
        member.email = data['email']
        member.save()
        return Response(MemberSerializer(member).data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        member = getattr(request, 'member', None) or getattr(request.user, 'member', None)
        if member is None:
            member = getattr(request.user, 'member', None)
        if member is None:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        if not check_password(old_password, member.password):
            return Response({"detail": "Старый пароль неверный"}, status=status.HTTP_400_BAD_REQUEST)
        member.password = make_password(new_password)
        member.save()
        return Response({"message": "Пароль успешно изменён"}, status=status.HTTP_200_OK)
