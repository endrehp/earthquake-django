"""earthquake URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
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
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
import earthquake_map.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', earthquake_map.views.public, name='public'),
    path('admin_home/', earthquake_map.views.admin_home, name='admin_home'),
    path('data/', earthquake_map.views.data, name='data'),
    path('editpublic/', earthquake_map.views.editpublic, name='editpublic'),
    path('analysis/', earthquake_map.views.analysis, name='analysis'),
    path('login/', earthquake_map.views.login, name='login'),
    path('logout/', earthquake_map.views.logout, name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

