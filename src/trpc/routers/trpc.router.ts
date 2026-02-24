import { createTRPCRouter } from "../init";
import { usersRouter } from "./users.router";
import { workflowRouter } from "./workflow.router";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  workflows: workflowRouter,
});

export type AppRouter = typeof appRouter;
