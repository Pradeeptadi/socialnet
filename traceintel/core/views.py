from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SocialSite
import httpx
import asyncio
from asgiref.sync import async_to_sync, sync_to_async

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
