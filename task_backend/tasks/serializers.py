from rest_framework import serializers
from .models import TaskMain, TaskAttachment, TaskUpdate, TaskStatusTrack, TaskAssignment


class TaskMainSerializer(serializers.ModelSerializer):
    # Extra fields received from frontend
    allocation_to = serializers.CharField(write_only=True)
    team = serializers.CharField(write_only=True, required=False, allow_blank=True)
    member = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = TaskMain
        fields = [
            'task_main_key', 'task_main_ID', 'category', 'sub_category', 'title', 'description',
            'assign_type', 'priority', 'due_date', 'created_at',
            'allocation_to', 'team', 'member',
        ]
        read_only_fields = ['task_main_key', 'task_main_ID', 'created_at', 'assign_type']

    def validate(self, data):
        allocation_to = data.get('allocation_to')
        team = data.get('team')
        member = data.get('member')

        if allocation_to not in ['team', 'member']:
            raise serializers.ValidationError("allocation_to must be 'team' or 'member'")

        if allocation_to == 'team' and not team:
            raise serializers.ValidationError("team must be provided when allocation_to is 'team'")

        if allocation_to == 'member' and not member:
            raise serializers.ValidationError("member must be provided when allocation_to is 'member'")

        return data

    def create(self, validated_data):
        allocation_to = validated_data.pop('allocation_to')
        team = validated_data.pop('team', None)
        member = validated_data.pop('member', None)

        validated_data['assign_type'] = allocation_to

        # Generate unique task_main_ID
        if not validated_data.get('task_main_ID'):
            validated_data['task_main_ID'] = self.generate_task_main_ID()

        task_main = TaskMain.objects.create(**validated_data)

        # Create TaskAssignment
        TaskAssignment.objects.create(
            task_main=task_main,
            team=team if allocation_to == 'team' else '',
            assigned_to=member if allocation_to == 'member' else '',
            assigned_by='',  # TODO: Replace with logged-in user if available
            status='assigned',
        )

        return task_main

    def generate_task_main_ID(self):
        import random, string
        while True:
            candidate = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
            if not TaskMain.objects.filter(task_main_ID=candidate).exists():
                return candidate


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = '__all__'


class TaskUpdateSerializer(serializers.ModelSerializer):
    task_main = serializers.SlugRelatedField(
        slug_field='task_main_ID',
        queryset=TaskMain.objects.all()
    )
    task_main_ID = serializers.CharField(source='task_main.task_main_ID', read_only=True)

    class Meta:
        model = TaskUpdate
        fields = '__all__'


class TaskStatusTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskStatusTrack
        fields = '__all__'


class TaskAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAssignment
        fields = '__all__'
