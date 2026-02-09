import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types derived from schema via routes manifest
type ScreeningListResponse = z.infer<typeof api.screenings.list.responses[200]>;
type ScreeningResponse = z.infer<typeof api.screenings.get.responses[200]>;
type CreateScreeningInput = z.infer<typeof api.screenings.create.input>;

export function useScreenings() {
  return useQuery({
    queryKey: [api.screenings.list.path],
    queryFn: async () => {
      const res = await fetch(api.screenings.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch screenings");
      return api.screenings.list.responses[200].parse(await res.json());
    },
  });
}

export function useScreening(id: number) {
  return useQuery({
    queryKey: [api.screenings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.screenings.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch screening details");
      return api.screenings.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useAnalyzeScreening() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateScreeningInput) => {
      const res = await fetch(api.screenings.create.path, {
        method: api.screenings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const errorData = await res.json().catch(() => ({ message: "Analysis failed" }));
        throw new Error(errorData.message || "Analysis failed");
      }

      return api.screenings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.screenings.list.path] });
      toast({
        title: "Analysis Complete",
        description: "Your eye screening results are ready.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong during analysis.",
        variant: "destructive",
      });
    },
  });
}
