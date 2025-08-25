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
import { Budget } from "@/lib/api/budgets";
import { ManagementCenter, fetchManagementCenters } from "@/lib/api/centers";

interface BudgetFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: Budget | null;
  onSubmit: (data: Budget) => void;
}

export default function BudgetForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: BudgetFormProps) {
  const [formData, setFormData] = useState<any>({
    id: undefined,
    year: new Date().getFullYear(),
    category: "",
    management_center_id: 0,
    total_amount: "",
    available_amount: "",
    status: "ATIVO",
  });
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        year: initialData.year,
        category: initialData.category,
        management_center_id: initialData.management_center?.id || 0,
        total_amount: initialData.total_amount,
        available_amount: initialData.available_amount,
        status: initialData.status,
      });
    } else {
      setFormData({
        id: undefined,
        year: new Date().getFullYear(),
        category: "",
        management_center_id: 0,
        total_amount: "",
        available_amount: "",
        status: "ATIVO",
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: field === "management_center_id" ? parseInt(value) : value });
    
    // Clear error when user selects
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      newErrors.year = "Ano deve estar entre 2000 e 2100";
    }

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }

    if (!formData.management_center_id || formData.management_center_id === 0) {
      newErrors.management_center_id = "Centro Gestor é obrigatório";
    }

    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
      newErrors.total_amount = "Valor total deve ser maior que zero";
    }

    if (!formData.available_amount || parseFloat(formData.available_amount) < 0) {
      newErrors.available_amount = "Valor disponível não pode ser negativo";
    }

    if (parseFloat(formData.available_amount) > parseFloat(formData.total_amount)) {
      newErrors.available_amount = "Valor disponível não pode ser maior que o total";
    }

    if (!formData.status) {
      newErrors.status = "Status é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[90vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              {initialData ? "Editar Orçamento" : "Novo Orçamento"}
            </DialogTitle>
            <hr className="mt-2 border-b border-gray-200" />
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="2024"
                min="2000"
                max="2100"
              />
              {errors.year && <span className="text-sm text-red-500">{errors.year}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                value={formData.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <span className="text-sm text-red-500">{errors.category}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="management_center">Centro Gestor</Label>
              <Select
                onValueChange={(value) => handleSelectChange("management_center_id", value)}
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
              {errors.management_center_id && <span className="text-sm text-red-500">{errors.management_center_id}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="total_amount">Valor Total</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                min="0"
              />
              {errors.total_amount && <span className="text-sm text-red-500">{errors.total_amount}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="available_amount">Valor Disponível</Label>
              <Input
                id="available_amount"
                type="number"
                step="0.01"
                value={formData.available_amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                min="0"
              />
              {errors.available_amount && <span className="text-sm text-red-500">{errors.available_amount}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange("status", value)}
                value={formData.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">ATIVO</SelectItem>
                  <SelectItem value="INATIVO">INATIVO</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Criar Orçamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}