from django.db import models
from django.conf import settings

class Course(models.Model):
    COURSE_TYPE = [
        ('free', 'Free'),
        ('paid', 'Paid'),
    ]
    
    ACCESS_TYPE = [
        ('open', 'Open Access'),
        ('enrollment', 'Enrollment Required'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/')
    course_type = models.CharField(max_length=10, choices=COURSE_TYPE, default='free')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE, default='enrollment')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class CourseModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class CourseMaterial(models.Model):
    MATERIAL_TYPE = [
        ('video', 'Video'),
        ('pdf', 'PDF Document'),
        ('link', 'External Link'),
    ]
    
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200)
    material_type = models.CharField(max_length=10, choices=MATERIAL_TYPE)
    file = models.FileField(upload_to='course_materials/', null=True, blank=True)
    external_link = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"


class CourseEnrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'course']
    
    def __str__(self):
        return f"{self.user.username} - {self.course.title}"