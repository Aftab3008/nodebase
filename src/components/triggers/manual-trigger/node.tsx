import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { ManualTriggerDialog } from "./ManualTriggerDialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = "success";

  //   const nodeStatus = useNodeStatus({
  //     nodeId: props.id,
  //     channel: MANUAL_TRIGGER_CHANNEL_NAME,
  //     topic: "status",
  //     refreshToken: fetchManualTriggerRealtimeToken,
  //   });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
