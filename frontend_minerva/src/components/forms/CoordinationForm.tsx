"use client";

import { useEffect, useState } from "react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Coordination } from "@/lib/api/coordinations";
import { Management } from "@/lib/api/managements";

interface CoordinationFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: Coordination | null;
  managements: Management[];
  onSubmit: (data: Coordination) => void;
}

export default function CoordinationForm({
  open,
  handleClose,
  initialData,
  managements,
  onSubmit,
}: CoordinationFormProps) {
  const [formData, setFormData] = useState<Coordination>({
    id: "",
    name: "",
    management: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: "", name: "", management: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSelect = (value: string) => {
    setFormData({ ...formData, management: value });
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
            {/* Nome da Coordenação */}
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

            {/* Selecionar Gerência */}
            <div className="grid gap-2">
              <Label htmlFor="management">Gerência</Label>
              <Select
                onValueChange={handleSelect}
                value={formData.management}
              >
                <SelectTrigger id="management">
                  <SelectValue placeholder="Selecione a Gerência" />
                </SelectTrigger>
                <SelectContent>
                  {managements.map((man) => (
                    <SelectItem key={man.id} value={man.id}>
                      {man.name}
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
