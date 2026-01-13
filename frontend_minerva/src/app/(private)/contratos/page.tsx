"use client";

import React from "react";
import { CrudTablePage } from "@/components/common/CrudTablePage";
import { contractColumns, ContractForm, type Contract } from "@/features/contratos";
import { ContractService } from "@/services";

export default function ContratosPage() {
  // Custom view details handler - opens in new tab
  const handleViewDetails = (contract: Contract) => {
    window.open(`/contratos/${contract.id}`, "_blank");
  };

  // Service adapter to match CrudService interface
  const contractServiceAdapter = {
    fetch: ContractService.fetchContracts,
    create: ContractService.createContract,
    update: ContractService.updateContract,
    delete: ContractService.deleteContract,
  };

  return (
    <CrudTablePage<Contract>
      columns={contractColumns}
      service={contractServiceAdapter}
      entityName="contrato"
      entityNamePlural="contratos"
      title="Contratos"
      FormComponent={ContractForm}
      onViewDetails={handleViewDetails}
      deleteDialogTitle="Confirmar exclusão"
      deleteDialogDescription={(contract) => (
        <>
          Tem certeza que deseja excluir o contrato{" "}
          <strong>{contract.protocol_number}</strong>?
          <br />
          <br />
          Esta ação não pode ser desfeita.
        </>
      )}
      deleteDialogConfirmText="Excluir"
      refreshKey="contratos"
      initialStatusFilter=""
    />
  );
}
