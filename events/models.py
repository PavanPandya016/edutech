from django.db import models
from django.conf import settings
from django.utils import timezone

class Event(models.Model):
    EVENT_TYPE = [
        ('seminar', 'Seminar'),
        ('workshop', 'Workshop'),
        ('webinar', 'Webinar'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE, default='seminar')
    thumbnail = models.ImageField(upload_to='event_thumbnails/', null=True, blank=True)
    
    # Related course (optional)
    related_course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, 
                                       null=True, blank=True, related_name='events')
    
    # Date and time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    
    # Meeting link
    meeting_link = models.URLField(blank=True, help_text="Zoom/Google Meet link")
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_datetime']
    
    def __str__(self):
        return self.title
    
    @property
    def is_past(self):
        return self.end_datetime < timezone.now()
    
    @property
    def is_full(self):
        if self.max_participants:
            return self.registrations.count() >= self.max_participants
        return False


class EventRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['event', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.event.title}"