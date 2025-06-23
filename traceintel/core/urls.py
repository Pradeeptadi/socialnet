from django.urls import path
from .views import  username_osint

urlpatterns = [
    path('username-osint/', username_osint),
]
