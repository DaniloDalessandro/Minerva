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
import { Management } from "@/lib/api/managements";
import { Direction, fetchDirections } from "@/lib/api/directions";

interface ManagementFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: Management | null;
  onSubmit: (data: Management) => void;
}

export default function ManagementForm({
  open,
  handleClose,
  initialData,
  onSubmit,
}: ManagementFormProps) {
  const [formData, setFormData] = useState<Management>({
    id: undefined,
    name: "",
    direction: 0,
  });
  const [directions, setDirections] = useState<Direction[]>([]);

  useEffect(() => {
    async function loadDirections() {
      try {
        const data = await fetchDirections();
        setDirections(data.results);
      } catch (error) {
        console.error("Erro ao carregar direções:", error);
      }
    }
    loadDirections();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: undefined, name: "", direction: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, direction: parseInt(value) });
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
              {initialData ? "Editar Gerência" : "Nova Gerência"}
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
                placeholder="Nome da Gerência"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direction">Direção</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.direction.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma direção" />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((direction) => (
                    <SelectItem key={direction.id} value={direction.id.toString()}>
                      {direction.name}
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
              {initialData ? "Salvar Alterações" : "Criar Gerência"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}