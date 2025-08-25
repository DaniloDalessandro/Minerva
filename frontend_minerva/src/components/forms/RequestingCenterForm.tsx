"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestingCenter, fetchManagementCenters, ManagementCenter } from "@/lib/api/centers";

interface RequestingCenterFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: RequestingCenter | null;
  onSubmit: (data: RequestingCenter) => void;
}

export default function RequestingCenterForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: RequestingCenterFormProps) {
  const [formData, setFormData] = useState<any>({
    id: undefined,
    name: "",
    description: "",
    management_center_id: 0,
  });
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([]);

  useEffect(() => {
    async function loadManagementCenters() {
      try {
        const data = await fetchManagementCenters(1, 1000);
        setManagementCenters(data.results);
      } catch (error) {
        console.error("Erro ao carregar centros gestores:", error);
      }
    }
    loadManagementCenters();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description || "",
        management_center_id: initialData.management_center?.id || 0
      });
    } else {
      setFormData({ id: undefined, name: "", description: "", management_center_id: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, management_center_id: parseInt(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[90vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              {initialData ? "Editar Centro Solicitante" : "Novo Centro Solicitante"}
            </DialogTitle>
            <hr className="mt-2 border-b border-gray-200" />
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nome do Centro Solicitante"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="management_center">Centro Gestor</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.management_center_id.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um centro gestor" />
                </SelectTrigger>
                <SelectContent>
                  {managementCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do Centro Solicitante (opcional)"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Criar Centro Solicitante"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}