"use client";

import { useUser } from "@/lib/client-session";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import { mockTemplates } from "@/lib/mock";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

export default function TemplateDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const session = useUser();
  const user = session?.data?.user;

  const [selectNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [template, setTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNodeData, setModalNodeData] = useState<any>(null);

  const ReactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      // setNodes((nds) => re)
    },
    [onNodesChange, setNodes, setEdges]
  );

  useEffect(() => {
    const foundTemplate = mockTemplates.find((t) => t.id === slug);
    if (!foundTemplate) return;
    setTemplate(foundTemplate);
  }, [slug]);

  return (
    <div className=" flex h-dvh ">
      {/* Left Column Header and canvas*/}
      <div className="flex-1 p-6 flex flex-col  h-full ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1>Edit Template: {template?.name || slug}</h1>
            <p>
              {template?.description ||
                "Design your workflow by connecting nodes"}
            </p>
          </div>
          <div className="flex items-center gap-3">Keep Clear</div>
        </div>
        {/* Canvas */}
        <Card className="border-[#1E293B] border mb-24   bg-[#121826]  flex-1 relative">
          <CardContent className="p-o h-full bg-green-100">
            <div ref={ReactFlowWrapper} className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
              ></ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
