from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def ping(request):
    return Response({"message": "TraceIntel backend working ✅"})


@api_view(['POST'])
def username_osint(request):
    username = request.data.get('username')
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # 🧪 Dummy response for now
    dummy_result = {
        "username": username,
        "found_on": ["GitHub", "Twitter", "Instagram"],
        "details": {
            "GitHub": f"https://github.com/{username}",
            "Twitter": f"https://twitter.com/{username}",
            "Instagram": f"https://instagram.com/{username}"
        }
    }

    return Response(dummy_result)  # ✅ RETURN this
