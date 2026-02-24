import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from "@/components/workflows/workflows";
import { workflowsParamsLoader } from "@/lib/params-server";
import { HydrateClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type WorkflowsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: WorkflowsPageProps) {
  const params = await workflowsParamsLoader(searchParams);
  void trpc.workflows.getWorkflows.prefetch(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
