from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *

class TaskMainViewSet(viewsets.ModelViewSet):
    queryset = TaskMain.objects.all().order_by('-created_at')
    serializer_class = TaskMainSerializer

    def perform_create(self, serializer):
        # Auto-generate task_main_ID like task01, task02, ...
        last_task = TaskMain.objects.order_by('-task_main_key').first()
        if last_task and last_task.task_main_ID and last_task.task_main_ID.startswith("task"):
            try:
                last_number = int(last_task.task_main_ID.replace("task", ""))
                new_id = f"task{last_number + 1:02d}"
            except:
                new_id = "task01"
        else:
            new_id = "task01"

        serializer.save(task_main_ID=new_id)

    @action(detail=False, methods=['get'], url_path='last-id')
    def get_last_task_id(self, request):
        last_task = TaskMain.objects.order_by('-task_main_key').first()
        if last_task and last_task.task_main_ID and last_task.task_main_ID.startswith("task"):
            try:
                number = int(last_task.task_main_ID.replace("task", ""))
                return Response({"last_id": number})
            except:
                pass
        return Response({"last_id": 0})

class TaskAttachmentViewSet(viewsets.ModelViewSet):
    queryset = TaskAttachment.objects.all().order_by('-uploaded_at')
    serializer_class = TaskAttachmentSerializer

class TaskUpdateViewSet(viewsets.ModelViewSet):
    queryset = TaskUpdate.objects.all().order_by('-updated_at')
    serializer_class = TaskUpdateSerializer

class TaskStatusTrackViewSet(viewsets.ModelViewSet):
    queryset = TaskStatusTrack.objects.all().order_by('-updated_at')
    serializer_class = TaskStatusTrackSerializer

class TaskAssignmentViewSet(viewsets.ModelViewSet):
    queryset = TaskAssignment.objects.all().order_by('-assigned_at')
    serializer_class = TaskAssignmentSerializer
