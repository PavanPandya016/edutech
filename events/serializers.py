from rest_framework import serializers
from .models import Event, EventRegistration

class EventSerializer(serializers.ModelSerializer):
    registration_count = serializers.IntegerField(source='registrations.count', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'