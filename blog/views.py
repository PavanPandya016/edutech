from django.shortcuts import render
from rest_framework import viewsets
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostSerializer
# Create your views here.
