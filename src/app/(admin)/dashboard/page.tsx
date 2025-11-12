// app/dashboard/page.tsx
"use client";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getServerSession } from "@/lib/session";
import { KpiCard } from "./_components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunTable } from "./_components/run-table";

export default function DashboardPage() {
  const handleUpgrade = () => {};

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-gray-400">
          Monitor your automation workflows and system performance.
        </p>
      </div>
      {/* KPI carsd */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Active Workflows"
          value={10}
          subtitle="Running automations"
        />
        <KpiCard title="Runs (30d)" value={5} subtitle="Total executions" />
        <KpiCard
          title="Success Rate"
          value={4}
          progress={90}
          subtitle="Overall reliability"
        />
        <KpiCard
          title="Creadits remaining"
          value={2}
          progress={8}
          subtitle="Usage remaining "
          action={{
            label: "Upgrade",
            onClick: handleUpgrade,
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#121826] border-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-white">Recent Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <RunTable />
            </CardContent>
          </Card>
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
            molestias earum temporibus deleniti fuga nobis ad explicabo nisi
            repellat voluptatibus, quasi repellendus facere consectetur. Iusto
            voluptatibus nobis aliquid dignissimos dicta?
          </p>
        </div>
      </div>
    </div>
  );
}
