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
import { useState } from "react";

export default function OrcamentoForm({ open, handleClose }) {
  const [formData, setFormData] = useState({
    ano: "",
    centro_custo: "",
    classe: "",
    valor: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelect = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[90vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              Novo Orçamento
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
                  className="w-40"
                  placeholder="2023" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="classe">Classe</Label>
                <Select onValueChange={handleSelect("classe")} required>
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
                  className="w-40"
                  placeholder="DOP"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleChange("valor")}
                  required
                  className="w-40"
                  helpText="Valor em R$"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
