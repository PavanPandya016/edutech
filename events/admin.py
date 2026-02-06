from django.contrib import admin
from .models import Event, EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_datetime', 'end_datetime', 'is_featured', 'is_active', 'registration_count']
    list_filter = ['event_type', 'is_featured', 'is_active', 'start_datetime']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_datetime'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'event_type', 'thumbnail')
        }),
        ('Schedule', {
            'fields': ('start_datetime', 'end_datetime', 'meeting_link')
        }),
        ('Settings', {
            'fields': ('related_course', 'max_participants', 'is_featured', 'is_active')
        }),
    )
    
    def registration_count(self, obj):
        return obj.registrations.count()
    registration_count.short_description = 'Registrations'

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'registered_at', 'attended']
    list_filter = ['attended', 'registered_at', 'event']
    search_fields = ['user__username', 'event__title']
    date_hierarchy = 'registered_at'