import { Handle, NodeProps, Position as ReactFlowPosition } from "reactflow";
import { ICON_MAP } from "./flow-utils";
import { AlertTriangle, ArrowRightIcon, Zap } from "lucide-react";

interface NodeData {
  label: string;
  description: string;
  icon: string;
  isStartNode: boolean;
  stepNumber: number;
  isConfigured: boolean;
}

export default function CustomNode({
  data,
  isConnectable,
}: NodeProps<NodeData>) {
  const IconComponent = ICON_MAP[data.icon] || ArrowRightIcon;
  const isRunning = Boolean((data as any)?.isRunning);
  const hasError = Boolean((data as any)?.hasError);
  return (
    <div
      className={
        `bg-[#1E293B] p-4 rounded-md border shadow-md min-w-[180px] relative cursor-pointer transition-colors` +
        (hasError
          ? "border-red-500 ring-2 ring-red-600"
          : isRunning
            ? "border-green-400 ring-2 ring-green-500 animate-pulse"
            : "border-[#1E293B] hover:border-green-400")
      }
    >
      {hasError && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-rose-500 text-black">
          !
        </div>
      )}

      {data?.isStartNode && (
        <div className="absolute -top-8 left-0 flex-items-center">
          <Zap className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-white text-xs font-medium">Start here</span>
        </div>
      )}

      {/* Running step badge */}
      {isRunning && typeof data.stepNumber === "number" && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-500 text-black">
          {data.stepNumber}
        </div>
      )}

      <div className="flex items-center">
        <div className="w-8 h-8 rounded-md bg-[#0B0F14] flex items-center justify-center mr-3">
          <IconComponent className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-white">{data.label}</p>
          {data.description && (
            <p className="">
              {data.stepNumber ? `Step ${data.stepNumber}` : data.description}
            </p>
          )}
        </div>
      </div>
      {!data.isConfigured && (
        <div className="flex items-center mt-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
          <p className="text-xs text-red-400">Platform needs configuration</p>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">Double-click to configure</p>
      {["left", "right", "top", "bottom"].map((pos) => (
        <Handle
          key={pos}
          type={pos === "left" || pos === "top" ? "target" : "source"}
          position={
            ReactFlowPosition[
              (pos.charAt(0).toUpperCase() +
                pos.slice(1)) as keyof typeof ReactFlowPosition
            ]
          }
          id={pos}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-green-400"
        />
      ))}
    </div>
  );
}

export const nodeTypes = { custom: CustomNode };
