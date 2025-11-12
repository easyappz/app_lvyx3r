"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from pathlib import Path

BASE_DIR = Path(settings.BASE_DIR) if hasattr(settings, "BASE_DIR") else Path(__file__).resolve().parent.parent


def openapi_view(request):
    file_path = BASE_DIR / "openapi.yml"
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception:
        return HttpResponse("openapi not found", status=404)
    return HttpResponse(content, content_type="text/yaml")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("openapi.yml", openapi_view, name="openapi"),
]
