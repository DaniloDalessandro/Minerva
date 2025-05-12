from rest_framework import serializers
from .models import Management_Center,Requesting_Center


# Serializer for the models in the centers app
class ManagementCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management_Center
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']


# Serializer for the models in the centers app
class RequestingCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requesting_Center
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']