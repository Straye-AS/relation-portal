"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectForm } from "./project-form";
import { useCreateProject } from "@/hooks/useProjects";
import type { DomainCreateProjectRequest } from "@/lib/.generated/data-contracts";

export interface AddProjectModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCustomerId?: string;
  lockedCustomerId?: string;
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
}

export function AddProjectModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultCustomerId,
  lockedCustomerId,
  trigger,
  hideTrigger,
}: AddProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const createProject = useCreateProject();

  const handleSubmit = async (data: DomainCreateProjectRequest) => {
    try {
      await createProject.mutateAsync(data);
      setOpen(false);
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !controlledOpen &&
        !hideTrigger && (
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nytt prosjekt
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[700px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Opprett nytt prosjekt</DialogTitle>
          <DialogDescription>
            Fyll ut informasjonen for å opprette et nytt prosjekt.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {open && (
            <ProjectForm
              onSubmit={handleSubmit}
              isLoading={createProject.isPending}
              initialData={{
                customerId: defaultCustomerId,
              }}
              lockedCustomerId={lockedCustomerId}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
