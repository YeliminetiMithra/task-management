from django.db import models

class TaskMain(models.Model):
    task_main_key = models.BigAutoField(primary_key=True)
    task_main_ID = models.CharField(max_length=10, unique=True)
    category = models.CharField(max_length=50)
    sub_category = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    description = models.TextField()
    assign_type = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class TaskAttachment(models.Model):
    task_main = models.ForeignKey(TaskMain, on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class TaskUpdate(models.Model):
    task_main = models.ForeignKey(TaskMain, on_delete=models.CASCADE)
    update_text = models.TextField()
    updated_by = models.CharField(max_length=100)
    updated_at = models.DateTimeField(auto_now_add=True)

class TaskStatusTrack(models.Model):
    task_main = models.ForeignKey(TaskMain, on_delete=models.CASCADE)
    from_status = models.CharField(max_length=50)
    to_status = models.CharField(max_length=50)
    updated_by = models.CharField(max_length=100)
    remarks = models.TextField()
    updated_at = models.DateTimeField(auto_now_add=True)

class TaskAssignment(models.Model):
    task_main = models.ForeignKey(TaskMain, on_delete=models.CASCADE)
    team = models.CharField(max_length=100)
    assigned_to = models.CharField(max_length=100)
    assigned_by = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    assigned_at = models.DateTimeField(auto_now_add=True)
