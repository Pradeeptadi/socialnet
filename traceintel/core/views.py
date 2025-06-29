from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SocialSite
import httpx
import asyncio
from asgiref.sync import async_to_sync, sync_to_async
import phonenumbers
from phonenumbers import geocoder, carrier, number_type
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import whois
import dns.resolver
import socket
import ssl
import json
import requests
from .domain_utils import (
    get_whois_info,
    get_dns_records,
    get_domain_ip_info,
    get_ssl_info,
    get_subdomains,
    get_blacklist_status,
    get_technologies,
)

@api_view(['POST'])
def domain_osint(request):
    domain = request.data.get('domain')
    if not domain:
        return Response({'error': 'No domain provided'}, status=400)

    try:
        result = {
            'domain': domain,
            'whois': get_whois_info(domain),
            'dns': get_dns_records(domain),
            'ip_geolocation': get_domain_ip_info(domain),
            'ssl': get_ssl_info(domain),
            'subdomains': get_subdomains(domain),
            'blacklist': get_blacklist_status(domain),
            'technologies': get_technologies(domain),
        }
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def phone_osint(request):
    phone_number = request.data.get("phone_number")
    if not phone_number:
        return Response({"error": "Phone number is required"}, status=400)

    try:
        parsed = phonenumbers.parse(phone_number, "IN")
        valid = phonenumbers.is_valid_number(parsed)
        possible = phonenumbers.is_possible_number(parsed)
        location = geocoder.description_for_number(parsed, "en")
        carrier_name = carrier.name_for_number(parsed, "en")
        line_type = str(number_type(parsed)).split('.')[-1]

        return Response({
            "number": phone_number,
            "valid": valid,
            "possible": possible,
            "location": location,
            "carrier": carrier_name,
            "line_type": line_type,
        })
    except Exception as e:
        return Response({"error": f"Failed to process number: {str(e)}"}, status=400)


async def check_site(client, username, template):
    url = template.replace("{username}", username)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36"
    }
    try:
        r = await client.get(url, timeout=10, headers=headers, follow_redirects=True)
        if r.status_code in [200, 301, 302]:
            return {"site": url}
    except Exception as e:
        print(f"❌ Error on {url}: {e}")
    return None


async def run_checks(username):
    sites = await sync_to_async(list)(SocialSite.objects.all())
    print("📦 Sites loaded:", len(sites))
    async with httpx.AsyncClient() as client:
        tasks = [check_site(client, username, site.url_template) for site in sites]
        return await asyncio.gather(*tasks)

@api_view(["POST"])
def username_osint(request):
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username is required"}, status=400)

    results = async_to_sync(run_checks)(username)
    found = [r for r in results if r is not None]

    return Response({
        "username": username,
        "results": found
    })
@api_view(["GET"])
def all_sites(request):
    category = request.GET.get('category')

    if category and category.lower() != "all":
        sites = SocialSite.objects.filter(category__iexact=category.strip())
    else:
        sites = SocialSite.objects.all()

    data = [
        {"name": site.name, "url_template": site.url_template, "category": site.category}
        for site in sites
    ]
    return Response(data)
