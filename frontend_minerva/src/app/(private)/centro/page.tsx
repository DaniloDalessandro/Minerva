"use client";

import React, { useEffect, useState } from "react";
import {
  fetchManagementCenters,
  fetchRequestingCenters,
  createManagementCenter,
  updateManagementCenter,
  deleteManagementCenter,
  createRequestingCenter,
  updateRequestingCenter,
  deleteRequestingCenter,
  ManagementCenter,
  RequestingCenter,
} from "@/lib/api/centers";

import ManagementCenterForm from "@/components/forms/ManagementCenterForm";
import RequestingCenterForm from "@/components/forms/RequestingCenterForm";
import { DataTable } from "@/components/ui/data-table";
import { managementCenterColumns } from "./columns/management-centers";
import { requestingCenterColumns } from "./columns/requesting-centers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users2 } from "lucide-react";

export default function CentrosPage() {
  // Management Centers State
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([]);
  const [managementTotalCount, setManagementTotalCount] = useState(0);
  const [managementPage, setManagementPage] = useState(1);
  const [managementPageSize, setManagementPageSize] = useState(10);

  // Requesting Centers State
  const [requestingCenters, setRequestingCenters] = useState<RequestingCenter[]>([]);
  const [requestingTotalCount, setRequestingTotalCount] = useState(0);
  const [requestingPage, setRequestingPage] = useState(1);
  const [requestingPageSize, setRequestingPageSize] = useState(10);

  // Form States
  const [openManagementForm, setOpenManagementForm] = useState(false);
  const [openRequestingForm, setOpenRequestingForm] = useState(false);
  const [editingManagementCenter, setEditingManagementCenter] = useState<ManagementCenter | null>(null);
  const [editingRequestingCenter, setEditingRequestingCenter] = useState<RequestingCenter | null>(null);

  // Delete Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'management' | 'requesting'>('management');

  // Active Tab
  const [activeTab, setActiveTab] = useState('management');

  async function loadManagementCenters() {
    try {
      const data = await fetchManagementCenters(managementPage, managementPageSize);
      setManagementCenters(data.results as ManagementCenter[]);
      setManagementTotalCount(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros gestores:", error);
    }
  }

  async function loadRequestingCenters() {
    try {
      const data = await fetchRequestingCenters(requestingPage, requestingPageSize);
      setRequestingCenters(data.results as RequestingCenter[]);
      setRequestingTotalCount(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros solicitantes:", error);
    }
  }

  useEffect(() => {
    loadManagementCenters();
  }, [managementPage, managementPageSize]);

  useEffect(() => {
    loadRequestingCenters();
  }, [requestingPage, requestingPageSize]);

  const handleDeleteManagement = async () => {
    if (centerToDelete?.id) {
      try {
        await deleteManagementCenter(centerToDelete.id);
        await loadManagementCenters();
        
        if (managementCenters.length === 1 && managementPage > 1) {
          setManagementPage(managementPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir centro gestor:", error);
      } finally {
        setDeleteDialogOpen(false);
        setCenterToDelete(null);
      }
    }
  };

  const handleDeleteRequesting = async () => {
    if (centerToDelete?.id) {
      try {
        await deleteRequestingCenter(centerToDelete.id);
        await loadRequestingCenters();
        
        if (requestingCenters.length === 1 && requestingPage > 1) {
          setRequestingPage(requestingPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir centro solicitante:", error);
      } finally {
        setDeleteDialogOpen(false);
        setCenterToDelete(null);
      }
    }
  };

  const handleDelete = () => {
    if (deleteType === 'management') {
      handleDeleteManagement();
    } else {
      handleDeleteRequesting();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg w-fit">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-blue-900">Centros de Custo</h1>
              <p className="text-sm md:text-base text-gray-600">Gerencie centros gestores e solicitantes</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-1">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50">
              <TabsTrigger 
                value="management" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Centros Gestores
              </TabsTrigger>
              <TabsTrigger 
                value="requesting"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Users2 className="h-4 w-4" />
                Centros Solicitantes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="management" className="space-y-6">
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Centros Gestores
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  title=""
                  columns={managementCenterColumns()}
                  data={managementCenters}
                  pageSize={managementPageSize}
                  pageIndex={managementPage - 1}
                  totalCount={managementTotalCount}
                  onPageChange={(newPageIndex) => setManagementPage(newPageIndex + 1)}
                  onPageSizeChange={(newPageSize) => {
                    setManagementPageSize(newPageSize);
                    setManagementPage(1);
                  }}
                  onAdd={() => {
                    setEditingManagementCenter(null);
                    setOpenManagementForm(true);
                  }}
                  onEdit={(item) => {
                    setEditingManagementCenter(item);
                    setOpenManagementForm(true);
                  }}
                  onDelete={(item) => {
                    setCenterToDelete(item);
                    setDeleteType('management');
                    setDeleteDialogOpen(true);
                  }}
                />
              </CardContent>
            </Card>

            <ManagementCenterForm
              open={openManagementForm}
              handleClose={() => setOpenManagementForm(false)}
              initialData={editingManagementCenter}
              onSubmit={async (data) => {
                if (data.id) {
                  await updateManagementCenter(data);
                } else {
                  await createManagementCenter(data);
                }
                await loadManagementCenters();
                setOpenManagementForm(false);
              }}
            />
          </TabsContent>

          <TabsContent value="requesting" className="space-y-6">
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Centros Solicitantes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  title=""
                  columns={requestingCenterColumns()}
                  data={requestingCenters}
                  pageSize={requestingPageSize}
                  pageIndex={requestingPage - 1}
                  totalCount={requestingTotalCount}
                  onPageChange={(newPageIndex) => setRequestingPage(newPageIndex + 1)}
                  onPageSizeChange={(newPageSize) => {
                    setRequestingPageSize(newPageSize);
                    setRequestingPage(1);
                  }}
                  onAdd={() => {
                    setEditingRequestingCenter(null);
                    setOpenRequestingForm(true);
                  }}
                  onEdit={(item) => {
                    setEditingRequestingCenter(item);
                    setOpenRequestingForm(true);
                  }}
                  onDelete={(item) => {
                    setCenterToDelete(item);
                    setDeleteType('requesting');
                    setDeleteDialogOpen(true);
                  }}
                />
              </CardContent>
            </Card>

            <RequestingCenterForm
              open={openRequestingForm}
              handleClose={() => setOpenRequestingForm(false)}
              initialData={editingRequestingCenter}
              onSubmit={async (data) => {
                if (data.id) {
                  await updateRequestingCenter(data);
                } else {
                  await createRequestingCenter(data);
                }
                await loadRequestingCenters();
                setOpenRequestingForm(false);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Modal de confirmação para exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-700">Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o centro "{centerToDelete?.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}