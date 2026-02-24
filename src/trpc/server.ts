import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/trpc.router";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";

export const getQueryClient = cache(makeQueryClient);

export const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
