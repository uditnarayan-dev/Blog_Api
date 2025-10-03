
from django.contrib import admin
from django.urls import path, include
from blog import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.shortcuts import render

router = DefaultRouter()

router.register('posts', views.PostModelViewset, basename= 'posts')
router.register('categories', views.CategoryModelViewset, basename= 'categories')
router.register('tags', views.TagModelViewset, basename= 'tags')


def blog_frontend(request):
    return render(request, "blogfrontend.html")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path("frontend/", blog_frontend),   # load test frontend
    path("signup/", views.signup),
    
    path('gettoken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshtoken/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verifytoken/', TokenVerifyView.as_view(), name='token_verify'),
]
