from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'task-main', TaskMainViewSet)
router.register(r'task-attachment', TaskAttachmentViewSet)
router.register(r'task-update', TaskUpdateViewSet)
router.register(r'task-status-track', TaskStatusTrackViewSet)
router.register(r'task-assignment', TaskAssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
