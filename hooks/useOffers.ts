"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "@/lib/api/client";
import { Offer } from "@/types";
import { toast } from "sonner";

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: offersApi.getAll,
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offers", id],
    queryFn: () => offersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud opprettet");
    },
    onError: () => {
      toast.error("Kunne ikke opprette tilbud");
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Offer> }) =>
      offersApi.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tilbud oppdatert");
    },
    onError: () => {
      toast.error("Kunne ikke oppdatere tilbud");
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: offersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud slettet");
    },
    onError: () => {
      toast.error("Kunne ikke slette tilbud");
    },
  });
}
