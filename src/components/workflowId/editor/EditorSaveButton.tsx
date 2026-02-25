import { Button } from "@/components/ui/button";
import { useUpdateWorkflow } from "@/hooks/workflows/use-workflows";
import { editorAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { SaveIcon } from "lucide-react";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = async () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    await saveWorkflow.mutateAsync({ id: workflowId, nodes, edges });
  };

  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
        <SaveIcon className="size-4" />
      </Button>
    </div>
  );
};
