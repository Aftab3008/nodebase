"use client";

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "../react-flow/placeholder-node";
import { WorkflowNode } from "./WorkFlowNode";
import { NodeSelector } from "./NodeSelector";

export const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode {...props} showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="flex items-center justify-center cursor-pointer">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
