"""Admin configuration for user models."""
from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for user profiles."""
    list_display = ("user", "created_at")
    search_fields = ("user__email",)
