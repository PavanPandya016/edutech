from django.contrib import admin
from .models import BlogPost, Category, Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'is_featured', 'published_at']
    list_filter = ['status', 'is_featured', 'category', 'created_at']
    search_fields = ['title', 'content', 'author__username']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    filter_horizontal = ['tags']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Classification', {
            'fields': ('category', 'tags')
        }),
        ('Publishing', {
            'fields': ('author', 'status', 'is_featured')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # New post
            obj.author = request.user
        super().save_model(request, obj, form, change)