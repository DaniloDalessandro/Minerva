from rest_framework import serializers
from .models import CentroDeCustoGestor, CentroDeCustoSolicitante
from .utils.messages import CENTRO_GESTOR_MSGS, CENTRO_SOLICITANTE_MSGS

class CentroDeCustoGestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentroDeCustoGestor
        fields = '__all__'

    def validate_nome(self, value):
        if CentroDeCustoGestor.objects.filter(nome=value).exists():
            raise serializers.ValidationError(CENTRO_GESTOR_MSGS['unique_error'])
        return value


class CentroDeCustoSolicitanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentroDeCustoSolicitante
        fields = '__all__'

    def validate(self, data):
        if CentroDeCustoSolicitante.objects.filter(
            centro_gestor=data['centro_gestor'],
            nome=data['nome']
        ).exists():
            raise serializers.ValidationError(CENTRO_SOLICITANTE_MSGS['unique_error'])
        return data
