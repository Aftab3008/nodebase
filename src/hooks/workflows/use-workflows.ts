import { trpc } from "@/components/providers/QueryProvider";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
  const [params] = useWorkflowsParams();
  return trpc.workflows.getWorkflows.useSuspenseQuery(params);
};

export const useCreateWorkflow = () => {
  const utils = trpc.useUtils();
  return trpc.workflows.createWorkflow.useMutation({
    onSuccess: () => {
      void utils.workflows.getWorkflows.invalidate();
    },
  });
};

export const useRemoveWorkflow = () => {
  const utils = trpc.useUtils();
  return trpc.workflows.removeWorkflow.useMutation({
    onSuccess: () => {
      void utils.workflows.getWorkflows.invalidate();
    },
  });
};
