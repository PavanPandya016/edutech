from django.shortcuts import render
from rest_framework import viewsets
from django.utils import timezone
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        # Only show active events that haven't ended yet
        return Event.objects.filter(
            is_active=True,
            end_datetime__gte=timezone.now()
        )
# Create your views here.
