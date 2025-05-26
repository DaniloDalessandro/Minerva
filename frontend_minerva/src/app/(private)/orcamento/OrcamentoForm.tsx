"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function OrcamentoForm({ 
  open, 
  handleClose, 
  initialData,
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    id: "",
    ano: "",
    centro_custo: "",
    classe: "",
    valor_total: "",
    status: "ATIVO",
  });

  // Preenche o form quando initialData muda
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        ano: "",
        centro_custo: "",
        classe: "",
        valor_total: "",
        status: "ATIVO",
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelect = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
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
              {initialData ? "Editar Orçamento" : "Novo Orçamento"}
            </DialogTitle>
            <hr className="mt-2 border-b border-gray-200" />
          </DialogHeader>

          <div className="grid gap-4 py-6">
            {/* Linha: Ano + Classe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={handleChange("ano")}
                  required
                  min="2000"
                  max="2100"
                  placeholder="2023"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="classe">Classe</Label>
                <Select 
                  onValueChange={handleSelect("classe")} 
                  value={formData.classe}
                  required
                >
                  <SelectTrigger id="classe">
                    <SelectValue placeholder="Selecione a classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEX">OPEX</SelectItem>
                    <SelectItem value="CAPEX">CAPEX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha: Centro de Custo + Valor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="centro_custo">Centro de Custo</Label>
                <Input
                  id="centro_custo"
                  value={formData.centro_custo}
                  onChange={handleChange("centro_custo")}
                  required
                  placeholder="DOP"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valor_total">Valor Total (R$)</Label>
                <Input
                  id="valor_total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_total}
                  onChange={handleChange("valor_total")}
                  required
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* Status (só aparece na edição) */}
            {initialData && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={handleSelect("status")}
                  value={formData.status}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="AGUARDANDO">Aguardando</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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