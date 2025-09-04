"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { 
  managementCenterSchema, 
  ManagementCenterFormData,
  createUniqueManagementCenterNameValidator 
} from "@/lib/schemas/center-schemas";

interface ManagementCenterFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: ManagementCenter | null;
  onSubmit: (data: ManagementCenterFormData & { id?: number }) => void;
  existingNames?: string[];
}

export default function ManagementCenterForm({
  open,
  handleClose,
  initialData,
  onSubmit,
  existingNames = [],
}: ManagementCenterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingName, setIsValidatingName] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ManagementCenterFormData>({
    resolver: zodResolver(managementCenterSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
  }, [initialData, open, reset]);

  const checkDuplicateName = useCallback(async (name: string) => {
    if (!name.trim() || name.trim().length < 2) {
      return;
    }

    setIsValidatingName(true);
    
    try {
      // Primeiro verifica na lista local (mais rápido)
      const localDuplicate = existingNames.some(
        existingName => existingName.toLowerCase() === name.trim().toLowerCase()
      );

      if (localDuplicate) {
        setError("name", {
          type: "manual", 
          message: "Este nome já está sendo usado por outro centro gestor",
        });
        setIsValidatingName(false);
        return;
      }

      // Se não encontrou localmente, verifica na API
      const response = await fetch(
        `http://localhost:8000/api/v1/center/management-centers/?search=${encodeURIComponent(name.trim())}&page_size=1000`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const centers = data.results || [];
        
        // Verifica se existe algum centro com o mesmo nome
        const duplicateExists = centers.some((center: any) => 
          center.name.toLowerCase() === name.toLowerCase() && 
          center.id !== initialData?.id
        );

        if (duplicateExists) {
          setError("name", {
            type: "manual",
            message: "Este nome já está sendo usado por outro centro gestor",
          });
        } else {
          clearErrors("name");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar duplicata:", error);
    } finally {
      setIsValidatingName(false);
    }
  }, [existingNames, initialData, setError, clearErrors]);

  // Debounce da validação de nome
  useEffect(() => {
    if (!watchedName) return;

    const timeoutId = setTimeout(() => {
      checkDuplicateName(watchedName);
    }, 800); // 800ms de debounce

    return () => clearTimeout(timeoutId);
  }, [watchedName, checkDuplicateName]);

  const onFormSubmit = async (data: ManagementCenterFormData) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      // Revalidar duplicatas antes de enviar
      await checkDuplicateName(data.name);
      
      // Se ainda há erros após a validação, não enviar
      if (Object.keys(errors).length > 0) {
        setIsSubmitting(false);
        return;
      }

      await onSubmit({
        ...data,
        id: initialData?.id,
      });
      
      handleClose();
      reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[90vw]">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              {initialData ? "Editar Centro Gestor" : "Novo Centro Gestor"}
            </DialogTitle>
            <hr className="mt-2 border-b border-gray-200" />
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <div className="relative">
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Nome do Centro Gestor"
                  className={`${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${isValidatingName ? "pr-8" : ""}`}
                  style={{ textTransform: 'uppercase' }}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register("name").onChange(e);
                  }}
                />
                {isValidatingName && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              {errors.name && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-1">
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.name.message}
                  </p>
                </div>
              )}
              {isValidatingName && (
                <p className="text-sm text-blue-600 mt-1">
                  🔍 Verificando disponibilidade do nome...
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Descrição do Centro Gestor (opcional)"
                className={errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? "Salvando..." 
                : initialData 
                ? "Salvar Alterações" 
                : "Criar Centro Gestor"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}