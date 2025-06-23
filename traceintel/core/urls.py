from django.urls import path
from .views import ping, username_osint

urlpatterns = [
    path('ping/', ping),
    path('username-osint/', username_osint),
]
