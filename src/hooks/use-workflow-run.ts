import { topologicallySorted } from "@/utils/workflows/topo-logicaaly-sorted";
import { useCallback, useRef, useState } from "react";

export type WorkflowNodeRef = {
  id: string;
  data?: {
    label?: string;
    stepNumber?: number;
  };
};

export type WorkflowEdgeRef = {
  id: string;
  source: string;
  target: string;
};

type RunOptions = {
  delayMs?: number;
  onStepStart?: (node: WorkflowNodeRef, index: number) => void;
  onStepComplete?: (node: WorkflowNodeRef, index: number) => void;
  shouldStop?: () => boolean;
};

export function useWorkflowRun() {
  const [runningStepNumber, setRunningStepNumber] = useState<number | null>(
    null
  );
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const stopFlag = useRef(false);

  const stop = useCallback(() => {
    stopFlag.current = true;
  }, []);

  const runSequence = useCallback(
    async (
      nodes: WorkflowNodeRef[],
      edges: WorkflowEdgeRef[],
      opts?: RunOptions
    ) => {
      const {
        delayMs = 600,
        onStepStart,
        onStepComplete,
        shouldStop,
      } = opts || {};

      stopFlag.current = false;
      setIsRunning(true);

      const ordered = topologicallySorted(nodes || [], edges || []);

      for (let i = 0; i < ordered.length; i++) {
        const node = ordered[i];

        if (shouldStop?.() || stopFlag.current) break;

        const step = Number(node?.data?.stepNumber ?? i + 1);

        setRunningNodeId(node.id);
        onStepStart?.(node, i);

        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }

        onStepComplete?.(node, i);
      }

      setRunningNodeId(null);

      setRunningStepNumber(null);

      setIsRunning(false);
    },
    []
  );

  return {
    runningStepNumber,
    runningNodeId,
    isRunning,
    runSequence,
    stop,
  };
}
