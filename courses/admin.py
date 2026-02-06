from django.contrib import admin
from .models import Course, CourseModule, CourseMaterial, CourseEnrollment

class CourseMaterialInline(admin.TabularInline):
    model = CourseMaterial
    extra = 1
    fields = ['title', 'material_type', 'file', 'external_link', 'order']

class CourseModuleInline(admin.StackedInline):
    model = CourseModule
    extra = 1
    fields = ['title', 'description', 'order']
    show_change_link = True

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_type', 'price', 'access_type', 'is_featured', 'is_active', 'created_at']
    list_filter = ['course_type', 'access_type', 'is_featured', 'is_active']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CourseModuleInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'thumbnail')
        }),
        ('Pricing & Access', {
            'fields': ('course_type', 'price', 'access_type')
        }),
        ('Visibility', {
            'fields': ('is_featured', 'is_active')
        }),
    )

@admin.register(CourseModule)
class CourseModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order']
    list_filter = ['course']
    search_fields = ['title', 'course__title']
    inlines = [CourseMaterialInline]

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at', 'completed']
    list_filter = ['completed', 'enrolled_at']
    search_fields = ['user__username', 'course__title']
    date_hierarchy = 'enrolled_at'