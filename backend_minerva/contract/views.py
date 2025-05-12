from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import ContractInstallment, ContractAmendment, Contract
from .serializers import (
    ContractInstallmentSerializer,
    ContractAmendmentSerializer,
    ContractSerializer,
)
from .utils.messages import (
    CONTRACTS_MESSAGES,
    CONTRACT_INSTALLMENTS_MESSAGES,
    CONTRACT_AMENDMENTS_MESSAGES,
)

#==================================== CONTRATOS ====================================

class ContractListAPIView(generics.ListAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class ContractCreateAPIView(generics.CreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user) if user.is_authenticated else serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = CONTRACTS_MESSAGES['CREATE_SUCCESS']
        return response


class ContractRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class ContractUpdateAPIView(generics.UpdateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data['message'] = CONTRACTS_MESSAGES['UPDATE_SUCCESS']
        return response


class ContractDestroyAPIView(generics.DestroyAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        response.data = {'message': CONTRACTS_MESSAGES['DELETE_SUCCESS']}
        return response

#============================== PARCELAS DO CONTRATO ==============================

class ContractInstallmentListAPIView(generics.ListAPIView):
    queryset = ContractInstallment.objects.all()
    serializer_class = ContractInstallmentSerializer


class ContractInstallmentCreateAPIView(generics.CreateAPIView):
    queryset = ContractInstallment.objects.all()
    serializer_class = ContractInstallmentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user) if user.is_authenticated else serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = CONTRACT_INSTALLMENTS_MESSAGES['CREATE_SUCCESS']
        return response


class ContractInstallmentRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ContractInstallment.objects.all()
    serializer_class = ContractInstallmentSerializer


class ContractInstallmentUpdateAPIView(generics.UpdateAPIView):
    queryset = ContractInstallment.objects.all()
    serializer_class = ContractInstallmentSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data['message'] = CONTRACT_INSTALLMENTS_MESSAGES['UPDATE_SUCCESS']
        return response


class ContractInstallmentDestroyAPIView(generics.DestroyAPIView):
    queryset = ContractInstallment.objects.all()
    serializer_class = ContractInstallmentSerializer

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        response.data = {'message': CONTRACT_INSTALLMENTS_MESSAGES['DELETE_SUCCESS']}
        return response

#============================= ADITIVOS DO CONTRATO ===============================

class ContractAmendmentListAPIView(generics.ListAPIView):
    queryset = ContractAmendment.objects.all()
    serializer_class = ContractAmendmentSerializer


class ContractAmendmentCreateAPIView(generics.CreateAPIView):
    queryset = ContractAmendment.objects.all()
    serializer_class = ContractAmendmentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user) if user.is_authenticated else serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = CONTRACT_AMENDMENTS_MESSAGES['CREATE_SUCCESS']
        return response


class ContractAmendmentRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ContractAmendment.objects.all()
    serializer_class = ContractAmendmentSerializer


class ContractAmendmentUpdateAPIView(generics.UpdateAPIView):
    queryset = ContractAmendment.objects.all()
    serializer_class = ContractAmendmentSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data['message'] = CONTRACT_AMENDMENTS_MESSAGES['UPDATE_SUCCESS']
        return response


class ContractAmendmentDestroyAPIView(generics.DestroyAPIView):
    queryset = ContractAmendment.objects.all()
    serializer_class = ContractAmendmentSerializer

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        response.data = {'message': CONTRACT_AMENDMENTS_MESSAGES['DELETE_SUCCESS']}
        return response
