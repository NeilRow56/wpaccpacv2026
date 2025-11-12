"use client";

import { useUser } from "@/lib/client-session";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCallback } from "react";
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
import { Fira_Sans_Extra_Condensed } from "next/font/google";

export default function TemplateDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const session = useUser();
  const user = session?.data?.user;

  const [selectNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [template, setTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNodeData, setModalNodeData] = useState<any>(null);

  useEffect(() => {
    const foundTemplate = mockTemplates.find((t) => t.id === slug);
    if (!foundTemplate) return;
    setTemplate(foundTemplate);
  }, [slug]);

  return (
    <div className="flex h-full">
      {/* Left Column Header and canvas*/}
      <div className="flex-1 p-6 flex flex-col h-full ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1>Edit Template: {template?.name || slug}</h1>
            <p>
              {template?.description ||
                "Design your workflow by connecting nodes"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
