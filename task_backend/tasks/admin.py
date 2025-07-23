from django.contrib import admin
from .models import (
    TaskMain,
    TaskAttachment,
    TaskUpdate,
    TaskStatusTrack,
    TaskAssignment,
)

@admin.register(TaskMain)
class TaskMainAdmin(admin.ModelAdmin):
    list_display = ('task_main_ID', 'title', 'category', 'sub_category', 'priority', 'due_date')
    search_fields = ('task_main_ID', 'title')
    list_filter = ('priority', 'category', 'due_date')

@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ('task_main', 'file', 'uploaded_at')
    search_fields = ('task_main__task_main_ID',)

@admin.register(TaskUpdate)
class TaskUpdateAdmin(admin.ModelAdmin):
    list_display = ('task_main', 'updated_by', 'update_text', 'updated_at')
    search_fields = ('task_main__task_main_ID', 'updated_by')

@admin.register(TaskStatusTrack)
class TaskStatusTrackAdmin(admin.ModelAdmin):
    list_display = ('task_main', 'from_status', 'to_status', 'updated_by', 'updated_at')
    list_filter = ('from_status', 'to_status')
    search_fields = ('task_main__task_main_ID', 'updated_by')

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task_main', 'team', 'assigned_to', 'assigned_by', 'status', 'assigned_at')
    list_filter = ('status',)
    search_fields = ('task_main__task_main_ID', 'assigned_to', 'assigned_by')
