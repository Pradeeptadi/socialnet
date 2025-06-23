from django.db import models

class SocialSite(models.Model):
    name = models.CharField(max_length=100)
    url_template = models.URLField()
    category = models.CharField(max_length=100, blank=True, null=True)  # ✅ new field added

    def __str__(self):
        return self.name
