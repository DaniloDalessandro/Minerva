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
import { Coordination } from "@/lib/api/coordinations";
import { Management, fetchManagements } from "@/lib/api/managements";

interface CoordinationFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: Coordination | null;
  onSubmit: (data: Coordination) => void;
}

export default function CoordinationForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: CoordinationFormProps) {
  const [formData, setFormData] = useState<any>({
    id: undefined,
    name: "",
    management_id: 0,
  });
  const [managements, setManagements] = useState<Management[]>([]);

  useEffect(() => {
    async function loadManagements() {
      try {
        const data = await fetchManagements(1, 1000);
        setManagements(data.results);
      } catch (error) {
        console.error("Erro ao carregar gerências:", error);
      }
    }
    loadManagements();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        management_id: initialData.management?.id || 0
      });
    } else {
      setFormData({ id: undefined, name: "", management_id: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.id === 'name' ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, management_id: parseInt(value) });
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
              {initialData ? "Editar Coordenação" : "Nova Coordenação"}
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
                placeholder="Nome da Coordenação"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="management">Gerência</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.management_id.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma gerência" />
                </SelectTrigger>
                <SelectContent>
                  {managements.map((management) => (
                    <SelectItem key={management.id} value={management.id.toString()}>
                      {management.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Criar Coordenação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}