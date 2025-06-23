from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SocialSite
import httpx
import asyncio
from asgiref.sync import async_to_sync, sync_to_async

VALID_STATUS_CODES = [200, 301, 302]

async def check_site(client, username, template):
    url = template.replace("{username}", username)
    print(f"🔍 Checking: {url}")  # Debug
    try:
        r = await client.get(url, timeout=5)
        print(f"✅ {url} returned {r.status_code}")
        if r.status_code in VALID_STATUS_CODES:
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
