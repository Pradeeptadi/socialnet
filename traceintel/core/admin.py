from django.contrib import admin
from .models import SocialSite

@admin.register(SocialSite)
class SocialSiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'url_template')
