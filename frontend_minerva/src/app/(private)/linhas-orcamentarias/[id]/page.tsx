"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchBudgetLineById, BudgetLine } from "@/lib/api/budgetlines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, DollarSign, User, FileText, Building, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetLineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [budgetLine, setBudgetLine] = useState<BudgetLine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBudgetLineDetails();
    }
  }, [id]);

  const loadBudgetLineDetails = async () => {
    try {
      setLoading(true);
      const budgetLineData = await fetchBudgetLineById(parseInt(id));
      setBudgetLine(budgetLineData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da linha orçamentária:", error);
      setError("Erro ao carregar os detalhes da linha orçamentária");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Store the budget line ID in session storage to trigger edit mode
    window.sessionStorage.setItem('editBudgetLineId', id);
    router.push('/linhas-orcamentarias');
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'CAPEX':
        return 'CAPEX';
      case 'OPEX':
        return 'OPEX';
      default:
        return category;
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'CAPEX':
        return 'destructive';
      case 'OPEX':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'Base Principal':
        return 'Base Principal';
      case 'Serviços Especializados':
        return 'Serviços Especializados';
      case 'Despesas Compartilhadas':
        return 'Despesas Compartilhadas';
      default:
        return type;
    }
  };

  const getBudgetClassificationLabel = (classification: string) => {
    switch (classification) {
      case 'NOVO':
        return 'Novo';
      case 'RENOVAÇÃO':
        return 'Renovação';
      case 'CARY OVER':
        return 'Cary Over';
      case 'REPLANEJAMENTO':
        return 'Replanejamento';
      case 'N/A':
        return 'N/A';
      default:
        return classification;
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'SERVIÇO':
        return 'Serviço';
      case 'FORNECIMENTO':
        return 'Fornecimento';
      case 'ASSINATURA':
        return 'Assinatura';
      case 'FORNECIMENTO/SERVIÇO':
        return 'Fornecimento/Serviço';
      default:
        return type;
    }
  };

  const getProcurementTypeLabel = (type: string) => {
    switch (type) {
      case 'LICITAÇÃO':
        return 'Licitação';
      case 'DISPENSA EM RAZÃO DO VALOR':
        return 'Dispensa em Razão do Valor';
      case 'CONVÊNIO':
        return 'Convênio';
      case 'FUNDO FIXO':
        return 'Fundo Fixo';
      case 'INEXIGIBILIDADE':
        return 'Inexigibilidade';
      case 'ATA DE REGISTRO DE PREÇO':
        return 'Ata de Registro de Preço';
      case 'ACORDO DE COOPERAÇÃO':
        return 'Acordo de Cooperação';
      case 'APOSTILAMENTO':
        return 'Apostilamento';
      default:
        return type;
    }
  };

  const getProcessStatusLabel = (status: string) => {
    switch (status) {
      case 'VENCIDO':
        return 'Vencido';
      case 'DENTRO DO PRAZO':
        return 'Dentro do Prazo';
      case 'ELABORADO COM ATRASO':
        return 'Elaborado com Atraso';
      case 'ELABORADO NO PRAZO':
        return 'Elaborado no Prazo';
      default:
        return status;
    }
  };

  const getProcessStatusVariant = (status: string) => {
    switch (status) {
      case 'VENCIDO':
        return 'destructive';
      case 'DENTRO DO PRAZO':
        return 'default';
      case 'ELABORADO COM ATRASO':
        return 'outline';
      case 'ELABORADO NO PRAZO':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getContractStatusLabel = (status: string) => {
    switch (status) {
      case 'DENTRO DO PRAZO':
        return 'Dentro do Prazo';
      case 'CONTRATADO NO PRAZO':
        return 'Contratado no Prazo';
      case 'CONTRATADO COM ATRASO':
        return 'Contratado com Atraso';
      case 'PRAZO VENCIDO':
        return 'Prazo Vencido';
      case 'LINHA TOTALMENTE REMANEJADA':
        return 'Totalmente Remanejada';
      case 'LINHA TOTALMENTE EXECUTADA':
        return 'Totalmente Executada';
      case 'LINHA DE PAGAMENTO':
        return 'Linha de Pagamento';
      case 'LINHA PARCIALMENTE REMANEJADA':
        return 'Parcialmente Remanejada';
      case 'LINHA PARCIALMENTE EXECUTADA':
        return 'Parcialmente Executada';
      case 'N/A':
        return 'N/A';
      default:
        return status;
    }
  };

  const getContractStatusVariant = (status: string) => {
    switch (status) {
      case 'DENTRO DO PRAZO':
      case 'CONTRATADO NO PRAZO':
        return 'default';
      case 'CONTRATADO COM ATRASO':
      case 'PRAZO VENCIDO':
        return 'destructive';
      case 'LINHA TOTALMENTE EXECUTADA':
      case 'LINHA PARCIALMENTE EXECUTADA':
        return 'secondary';
      case 'LINHA TOTALMENTE REMANEJADA':
      case 'LINHA PARCIALMENTE REMANEJADA':
        return 'outline';
      case 'LINHA DE PAGAMENTO':
      case 'N/A':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !budgetLine) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Erro</h1>
          <p className="text-gray-600">{error || "Linha orçamentária não encontrada"}</p>
          <Button onClick={() => router.push('/linhas-orcamentarias')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Linhas Orçamentárias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/linhas-orcamentarias')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Detalhes da Linha Orçamentária #{budgetLine.id}</h1>
              <p className="text-gray-600">
                {budgetLine.summary_description} - {budgetLine.budget?.name}
              </p>
            </div>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dados do Orçamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{budgetLine.budget?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Categoria</p>
                <Badge variant={getCategoryVariant(budgetLine.category)} className="text-sm">
                  {getCategoryLabel(budgetLine.category)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tipo e Classificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tipo e Classificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tipo de Despesa</p>
                <p className="font-medium">{getExpenseTypeLabel(budgetLine.expense_type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Classificação Orçamentária</p>
                <p className="font-medium">{getBudgetClassificationLabel(budgetLine.budget_classification)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Valor Orçado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Valor Orçado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-green-600 text-2xl">
                R$ {parseFloat(budgetLine.budgeted_amount).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardContent>
          </Card>

          {/* Centros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Centros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Centro Gestor</p>
                <p className="font-medium">{budgetLine.management_center?.name || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Centro Solicitante</p>
                <p className="font-medium">{budgetLine.requesting_center?.name || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Descrição e Objeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Descrição Resumida</p>
                <p className="font-medium">{budgetLine.summary_description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Objeto</p>
                <p className="font-medium">{budgetLine.object}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contrato */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Tipo de Contrato</p>
                <p className="font-medium">{getContractTypeLabel(budgetLine.contract_type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Aquisição</p>
                <p className="font-medium">{getProcurementTypeLabel(budgetLine.probable_procurement_type)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Fiscais */}
          {(budgetLine.main_fiscal || budgetLine.secondary_fiscal) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Fiscais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {budgetLine.main_fiscal && (
                  <div>
                    <p className="text-sm text-gray-600">Fiscal Principal</p>
                    <p className="font-medium">{budgetLine.main_fiscal.full_name}</p>
                    {budgetLine.main_fiscal.employee_id && (
                      <p className="text-xs text-gray-500">Matrícula: {budgetLine.main_fiscal.employee_id}</p>
                    )}
                  </div>
                )}
                {budgetLine.secondary_fiscal && (
                  <div>
                    <p className="text-sm text-gray-600">Fiscal Substituto</p>
                    <p className="font-medium">{budgetLine.secondary_fiscal.full_name}</p>
                    {budgetLine.secondary_fiscal.employee_id && (
                      <p className="text-xs text-gray-500">Matrícula: {budgetLine.secondary_fiscal.employee_id}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status */}
          {(budgetLine.process_status || budgetLine.contract_status) && (
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetLine.process_status && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status do Processo</p>
                    <Badge variant={getProcessStatusVariant(budgetLine.process_status)} className="text-sm">
                      {getProcessStatusLabel(budgetLine.process_status)}
                    </Badge>
                  </div>
                )}
                {budgetLine.contract_status && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status do Contrato</p>
                    <Badge variant={getContractStatusVariant(budgetLine.contract_status)} className="text-sm">
                      {getContractStatusLabel(budgetLine.contract_status)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {budgetLine.contract_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{budgetLine.contract_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Auditoria */}
          <Card className={budgetLine.contract_notes ? "" : "md:col-span-2 lg:col-span-1"}>
            <CardHeader>
              <CardTitle>Informações de Auditoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Criado em</p>
                <p className="font-medium">
                  {new Date(budgetLine.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(",", "")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Criado por</p>
                <p className="font-medium">
                  {budgetLine.created_by?.first_name && budgetLine.created_by?.last_name 
                    ? `${budgetLine.created_by.first_name} ${budgetLine.created_by.last_name}` 
                    : budgetLine.created_by?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última atualização</p>
                <p className="font-medium">
                  {new Date(budgetLine.updated_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(",", "")}
                </p>
              </div>
              {budgetLine.updated_by && (
                <div>
                  <p className="text-sm text-gray-600">Atualizado por</p>
                  <p className="font-medium">
                    {budgetLine.updated_by.first_name && budgetLine.updated_by.last_name 
                      ? `${budgetLine.updated_by.first_name} ${budgetLine.updated_by.last_name}` 
                      : budgetLine.updated_by.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}