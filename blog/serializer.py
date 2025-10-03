from rest_framework import serializers
from .models import Post, Category, Tag
from django.utils.text import slugify

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # user will be automatically assigned
    class Meta:
        model = Post
        fields = ['id' ,'title', 'content', 'author', 'category', 'tags', 'status', 'created_at', 'updated_at']

class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()  # slug auto-generated, read-only in API
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

