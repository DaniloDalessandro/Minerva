from rest_framework import serializers
from .models import Management_Center, Requesting_Center
from django.contrib.auth import get_user_model

User = get_user_model()

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

# Serializer for the models in the centers app
class ManagementCenterSerializer(serializers.ModelSerializer):
    created_by = UserInfoSerializer(read_only=True)
    updated_by = UserInfoSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Management_Center
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']

    def validate_name(self, value):
        if value:
            return value.upper()
        return value


# Serializer for the models in the centers app
class RequestingCenterSerializer(serializers.ModelSerializer):
    management_center = ManagementCenterSerializer(read_only=True)
    management_center_id = serializers.IntegerField(write_only=True)
    created_by = UserInfoSerializer(read_only=True)
    updated_by = UserInfoSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Requesting_Center
        fields = ['id', 'name', 'description', 'management_center', 'management_center_id', 'created_at', 'updated_at', 'created_by', 'updated_by']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']

    def create(self, validated_data):
        management_center_id = validated_data.pop('management_center_id', None)
        if management_center_id:
            management_center = Management_Center.objects.get(id=management_center_id)
            validated_data['management_center'] = management_center
        return super().create(validated_data)

    def update(self, instance, validated_data):
        management_center_id = validated_data.pop('management_center_id', None)
        if management_center_id:
            management_center = Management_Center.objects.get(id=management_center_id)
            validated_data['management_center'] = management_center
        return super().update(instance, validated_data)

    def validate_name(self, value):
        if value:
            return value.upper()
        return value