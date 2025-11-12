"use client";

import { useUser } from "@/lib/client-session";
import { useParams } from "next/navigation";
import { useState } from "react";
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

export default function TemplateDetailsPage() {
  const params = useParams();

  const session = useUser();
  const user = session?.data?.user;

  const [selectNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  return <div> Template details page for {user?.name}</div>;
}
