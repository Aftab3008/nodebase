import db from "@/lib/db/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "../init";
import { z } from "zod";
import { PAGINATION, WORKFLOW_LIMITS } from "@/constants";
import { TRPCError } from "@trpc/server";
import { NodeType } from "@/generated/prisma/enums";
import type { Edge, Node } from "@xyflow/react";
import { inngest } from "@/inngest/client";

export const workflowRouter = createTRPCRouter({
  getWorkflowUsage: premiumProcedure.query(async ({ ctx }) => {
    const currentCount = await db.workflow.count({
      where: { userId: ctx.auth.user.id },
    });

    const maxWorkflows = ctx.hasSubscription
      ? WORKFLOW_LIMITS.PRO
      : WORKFLOW_LIMITS.FREE;

    return {
      currentCount,
      maxWorkflows,
      hasSubscription: ctx.hasSubscription,
    };
  }),

  createWorkflow: premiumProcedure.mutation(async ({ ctx }) => {
    const currentCount = await db.workflow.count({
      where: { userId: ctx.auth.user.id },
    });

    const maxWorkflows = ctx.hasSubscription
      ? WORKFLOW_LIMITS.PRO
      : WORKFLOW_LIMITS.FREE;

    if (maxWorkflows !== null && currentCount >= maxWorkflows) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You have reached the limit of ${maxWorkflows} workflows on the free plan. Upgrade to Pro for unlimited workflows.`,
      });
    }

    const workflow = await db.workflow.create({
      data: {
        name: "Untitled Workflow",
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            name: NodeType.INITIAL,
            type: NodeType.INITIAL,
            position: {
              x: 0,
              y: 0,
            },
          },
        },
      },
    });
    return workflow;
  }),

  removeWorkflow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
      return workflow;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name must be at least 1 character long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await db.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
      return workflow;
    }),

  getWorkflowById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      const nodes: Node[] = workflow.nodes.map((node) => {
        return {
          id: node.id,
          type: node.type,
          position: node.position as { x: number; y: number },
          data: (node.data as Record<string, unknown>) || {},
        };
      });

      const edges: Edge[] = workflow.connections.map((connection) => {
        return {
          id: connection.id,
          source: connection.fromNodeId,
          target: connection.toNodeId,
          sourceHandle: connection.fromOutput,
          targetHandle: connection.toInput,
        };
      });

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  getWorkflows: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .max(PAGINATION.MAX_PAGE_SIZE)
          .min(PAGINATION.MIN_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const where = {
        userId: ctx.auth.user.id,
        name: { contains: search, mode: "insensitive" as const },
      };

      const [items, totalCount] = await db.$transaction([
        db.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: { updatedAt: "desc" },
        }),
        db.workflow.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const result = {
        workflows: items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      return result;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;

      const workflow = await db.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return await db.$transaction(async (tx) => {
        await tx.node.deleteMany({ where: { workflowId: id } });
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),

  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
      });

      // await sendWorkflowExecution({ workflowId: input.id });
      await inngest.send({
        name: "workflows/execute.workflow",
        data: { workflowId: input.id },
      });
      return workflow;
    }),
});
