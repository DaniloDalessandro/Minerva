from rest_framework import serializers
from .models import Assistance

class AidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistance
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'updated_by', 'created_at', 'updated_at']
