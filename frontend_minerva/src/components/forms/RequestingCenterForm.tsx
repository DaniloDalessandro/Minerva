"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestingCenter, ManagementCenter, fetchManagementCenters } from "@/lib/api/centers";

interface RequestingCenterFormProps {
  open: boolean;
  handleClose: () => void;
  initialData?: RequestingCenter | null;
  onSubmit: (data: RequestingCenter) => Promise<void>;
}

export default function RequestingCenterForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: RequestingCenterFormProps) {
  const [formData, setFormData] = useState<RequestingCenter>({
    management_center: 0,
    name: "",
    description: "",
  });
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (open) {
      loadManagementCenters();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        management_center: initialData.management_center,
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        management_center: 0,
        name: "",
        description: "",
      });
    }
  }, [initialData, open]);

  const loadManagementCenters = async () => {
    setLoadingCenters(true);
    try {
      const response = await fetchManagementCenters(1, 100); // Carregar todos
      setManagementCenters(response.results as ManagementCenter[]);
    } catch (error) {
      console.error("Erro ao carregar centros gestores:", error);
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar centro solicitante:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RequestingCenter, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 -mx-6 -mt-6 px-6 py-4 border-b">
          <DialogTitle className="text-blue-900 font-semibold">
            {initialData ? "Editar Centro Solicitante" : "Novo Centro Solicitante"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="management_center" className="text-gray-700 font-medium">
              Centro Gestor *
            </Label>
            <Select
              value={formData.management_center.toString()}
              onValueChange={(value) => handleInputChange("management_center", Number(value))}
              disabled={loadingCenters}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Selecione um centro gestor" />
              </SelectTrigger>
              <SelectContent>
                {managementCenters.map((center) => (
                  <SelectItem key={center.id} value={center.id!.toString()}>
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nome *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Digite o nome do centro solicitante"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Descrição
            </Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Digite uma descrição (opcional)"
            />
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || formData.management_center === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}