from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Post, Category, Tag
from .serializer import PostSerializer, CategorySerializer, TagSerializer

from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated, IsAdminUser

class PostModelViewset(viewsets.ModelViewSet):
    # queryset = Post.objects.all()
    serializer_class = PostSerializer
#Authentication & Authorization
    authentication_classes =[JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # admins see all posts
            return Post.objects.all()
        # normal users see only their own posts
        return Post.objects.filter(author=user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as author
        serializer.save(author=self.request.user)

# Custom permission: allow read-only for normal users
class ReadOnlyForNormalUsers(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True  # everyone can read
        return request.user.is_staff  # only admins can write

class CategoryModelViewset(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    authentication_classes =[JWTAuthentication]
    permission_classes = [IsAuthenticated, ReadOnlyForNormalUsers]
    # def get_permissions(self):
    #     if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
    #         return [IsAuthenticated()]  # normal users can view
    #     return [IsAdminUser()]  # only admin can create/update/delete

class TagModelViewset(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    authentication_classes =[JWTAuthentication]
    permission_classes = [IsAuthenticated, ReadOnlyForNormalUsers]


@csrf_exempt
@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)