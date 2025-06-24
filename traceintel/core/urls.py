from django.urls import path
from .views import  username_osint, all_sites

urlpatterns = [
    path('username-osint/', username_osint),
    path('sites/', all_sites, name='all_sites'),

]
