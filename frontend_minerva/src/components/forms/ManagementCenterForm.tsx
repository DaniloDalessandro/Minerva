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
import { ManagementCenter } from "@/lib/api/centers";

interface ManagementCenterFormProps {
  open: boolean;
  handleClose: () => void;
  initialData?: ManagementCenter | null;
  onSubmit: (data: ManagementCenter) => Promise<void>;
}

export default function ManagementCenterForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: ManagementCenterFormProps) {
  const [formData, setFormData] = useState<ManagementCenter>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar centro gestor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ManagementCenter, value: string) => {
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
            {initialData ? "Editar Centro Gestor" : "Novo Centro Gestor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
              placeholder="Digite o nome do centro gestor"
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
              disabled={isSubmitting}
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