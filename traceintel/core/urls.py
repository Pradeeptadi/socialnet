from django.urls import path
from .views import  username_osint, all_sites, phone_osint  , domain_osint

urlpatterns = [
    path('username-osint/', username_osint),
    path('sites/', all_sites, name='all_sites'),
    path('phone-osint/', phone_osint),
    path('domain-osint/', domain_osint, name='domain_osint'),

    
    # fallback to React
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]
