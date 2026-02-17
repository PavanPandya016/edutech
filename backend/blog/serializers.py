from rest_framework import serializers
from .models import BlogPost, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    category = CategorySerializer()
    tags = TagSerializer(many=True)
    
    class Meta:
        model = BlogPost
        fields = '__all__'