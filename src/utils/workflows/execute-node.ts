type WorkflowNode = {
  id: string;
  data?: {
    label?: string;
    stepNumber?: number;
    isConfigured?: boolean;
    config?: any;
  };
};

export async function executeNode(node: WorkflowNode): Promise<any> {
  return {
    nodeId: node.id,
    stepNumber: node.data?.stepNumber ?? null,
    result: node.data?.config ?? null,
  };
}
