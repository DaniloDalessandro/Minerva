"use client";

import { useEffect, useState } from "react";
import {
  fetchDirections,
  createDirection,
  updateDirection,
  deleteDirection,
  Direction,
} from "@/lib/api/directions";
import {
  fetchManagements,
  createManagement,
  updateManagement,
  deleteManagement,
  Management,
} from "@/lib/api/managements";
import {
  fetchCoordinations,
  createCoordination,
  updateCoordination,
  deleteCoordination,
  Coordination,
} from "@/lib/api/coordinations";

// Update the import path if the file is named differently or in a different folder
import DirectionForm from "@/components/forms/DirectionForm";
// For example, if the file is named directionForm.tsx (lowercase 'd'), use:
// import DirectionForm from "@/components/forms/directionForm";
// Or if the file is in another folder, adjust the path accordingly.
import ManagementForm from "@/components/forms/ManagementForm";
import CoordinationForm from "@/components/forms/CoordinationForm";

import { DataTable } from "@/components/ui/data-table";
import { columns as directionColumns } from "./columns/directions";
import { columns as managementColumns } from "./columns/managements";
import { columns as coordinationColumns } from "./columns/coordinations";

export default function SetoresPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [managements, setManagements] = useState<Management[]>([]);
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);

  const [openDirectionForm, setOpenDirectionForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);

  const [openManagementForm, setOpenManagementForm] = useState(false);
  const [editingManagement, setEditingManagement] = useState<Management | null>(null);

  const [openCoordinationForm, setOpenCoordinationForm] = useState(false);
  const [editingCoordination, setEditingCoordination] = useState<Coordination | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [dir, man, coord] = await Promise.all([
        fetchDirections(),
        fetchManagements(),
        fetchCoordinations(),
      ]);
      setDirections(dir);
      setManagements(man);
      setCoordinations(coord);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  return (
    <div className="space-y-10 px-4 py-6">
      {/* DIREÇÕES */}
      <section>
        <DataTable
          title="Direções"
          columns={directionColumns()}
          data={directions}
          onAdd={() => {
            setEditingDirection(null);
            setOpenDirectionForm(true);
          }}
          onEdit={(item) => {
            setEditingDirection(item);
            setOpenDirectionForm(true);
          }}
          onDelete={async (item) => {
            if (item.id && confirm("Excluir direção?")) {
              await deleteDirection(item.id);
              await loadAll();
            }
          }}
        />
        <DirectionForm
          open={openDirectionForm}
          handleClose={() => setOpenDirectionForm(false)}
          initialData={editingDirection}
          onSubmit={async (data) => {
            if (data.id) {
              await updateDirection(data);
            } else {
              await createDirection(data);
            }
            await loadAll();
          }}
      />

      </section>

      {/* GERÊNCIAS */}
      <section>
        <DataTable
          title="Gerências"
          columns={managementColumns()}
          data={managements}
          onAdd={() => {
            setEditingManagement(null);
            setOpenManagementForm(true);
          }}
          onEdit={(item) => {
            setEditingManagement(item);
            setOpenManagementForm(true);
          }}
          onDelete={async (item) => {
            if (item.id && confirm("Excluir gerência?")) {
              await deleteManagement(item.id);
              await loadAll();
            }
          }}
        />
        <ManagementForm
          open={openManagementForm}
          handleClose={() => setOpenManagementForm(false)}
          initialData={editingManagement}
          directions={directions}
          onSubmit={async (data) => {
            data.id ? await updateManagement(data) : await createManagement(data);
            await loadAll();
          }}
        />
      </section>

      {/* COORDENAÇÕES */}
      <section>
        <DataTable
          title="Coordenações"
          columns={coordinationColumns()}
          data={coordinations}
          onAdd={() => {
            setEditingCoordination(null);
            setOpenCoordinationForm(true);
          }}
          onEdit={(item) => {
            setEditingCoordination(item);
            setOpenCoordinationForm(true);
          }}
          onDelete={async (item) => {
            if (item.id && confirm("Excluir coordenação?")) {
              await deleteCoordination(item.id);
              await loadAll();
            }
          }}
        />
        <CoordinationForm
          open={openCoordinationForm}
          handleClose={() => setOpenCoordinationForm(false)}
          initialData={editingCoordination}
          managements={managements}
          onSubmit={async (data) => {
            data.id ? await updateCoordination(data) : await createCoordination(data);
            await loadAll();
          }}
        />
      </section>
    </div>
  );
}
