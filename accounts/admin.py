from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'phone', 'is_staff']
    list_filter = ['is_staff', 'is_active', 'gender']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'address', 'gender', 'date_of_birth', 'profile_picture')}),
    )