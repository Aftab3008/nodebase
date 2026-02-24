import db from "@/lib/db/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const workflowRouter = createTRPCRouter({
  getWorkflow: protectedProcedure.query(async ({ ctx }) => {
    const workflow = await db.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
    return workflow;
  }),
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    const workflow = await db.workflow.create({
      data: {
        name: "Untitled Workflow",
        userId: ctx.auth.user.id,
      },
    });
    return workflow;
  }),
});
