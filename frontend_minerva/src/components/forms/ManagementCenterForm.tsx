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
import { ManagementCenter } from "@/lib/api/centers";

interface ManagementCenterFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: ManagementCenter | null;
  onSubmit: (data: ManagementCenter) => void;
}

export default function ManagementCenterForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: ManagementCenterFormProps) {
  const [formData, setFormData] = useState<any>({
    id: undefined,
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description || "",
      });
    } else {
      setFormData({ id: undefined, name: "", description: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.id === 'name' ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
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
              {initialData ? "Editar Centro Gestor" : "Novo Centro Gestor"}
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
                placeholder="Nome do Centro Gestor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do Centro Gestor (opcional)"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Criar Centro Gestor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}