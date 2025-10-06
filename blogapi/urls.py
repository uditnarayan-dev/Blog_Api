
from django.contrib import admin
from django.urls import path, include
from blog import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.shortcuts import render

from django.conf import settings # new
from  django.conf.urls.static import static #new


router = DefaultRouter()

router.register('posts', views.PostModelViewset, basename= 'posts')
router.register('categories', views.CategoryModelViewset, basename= 'categories')
router.register('tags', views.TagModelViewset, basename= 'tags')

#For testing  Api with Authentication On
def blog_frontend(request):
    return render(request, "blogfrontend.html")

# nice landing page
def api_landing(request):
    return render(request, "api_landing.html")  # we'll create this template

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_landing),
    path("api/", include(router.urls)),
    path("frontend/", blog_frontend),
    path("signup/", views.signup),
    
    path('gettoken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshtoken/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verifytoken/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_URL)
