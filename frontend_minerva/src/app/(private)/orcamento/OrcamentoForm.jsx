"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function OrcamentoForm({ open, handleClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orcamentoSchema),
  });

  const onSubmit = (data) => {
    console.log("Orçamento salvo:", data);
    handleClose();
    // aqui você pode enviar para backend ou atualizar estado do pai
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Orçamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Ano */}
          <div className="grid gap-2">
            <Label htmlFor="ano">Ano</Label>
            <Input id="ano" type="number" {...register("ano")} placeholder="Ano do orçamento" />
            {errors.ano && <p className="text-red-500 text-sm">{errors.ano.message}</p>}
          </div>

          {/* Centro de Custo */}
          <div className="grid gap-2">
            <Label htmlFor="centro_custo">Centro de Custo</Label>
            <Input id="centro_custo" {...register("centro_custo")} placeholder="Nome do centro de custo" />
            {errors.centro_custo && <p className="text-red-500 text-sm">{errors.centro_custo.message}</p>}
          </div>

          {/* Classe */}
          <div className="grid gap-2">
            <Label htmlFor="classe">Classe</Label>
            <Select onValueChange={(value) => setValue("classe", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEX">OPEX</SelectItem>
                <SelectItem value="CAPEX">CAPEX</SelectItem>
              </SelectContent>
            </Select>
            {errors.classe && <p className="text-red-500 text-sm">{errors.classe.message}</p>}
          </div>

          {/* Valor Total */}
          <div className="grid gap-2">
            <Label htmlFor="valor_total">Valor Total</Label>
            <Input id="valor_total" type="number" {...register("valor_total", { valueAsNumber: true })} placeholder="Valor total" />
            {errors.valor_total && <p className="text-red-500 text-sm">{errors.valor_total.message}</p>}
          </div>

          <DialogFooter className="flex justify-between">
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
