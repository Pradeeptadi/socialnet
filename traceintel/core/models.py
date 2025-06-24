from django.db import models

class SocialSite(models.Model):
    CATEGORY_CHOICES = [
        ('social', 'Social Media'),
        ('developer', 'Developer Platform'),
        ('job', 'Job Site'),
        ('shopping', 'Shopping'),
        ('forum', 'Forum'),
        ('adult', 'Adult'),
        ('video', 'Video Platform'),
        ('education', 'Education'),
        ('travel', 'Travel/Booking'),
        ('indian', 'Indian Specific'),
        ('finance', 'Finance/Wallet'),
        ('blog', 'Blog/Article'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100, unique=True)
    url_template = models.URLField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')

    def __str__(self):
        return f"{self.name} - {self.category}"
