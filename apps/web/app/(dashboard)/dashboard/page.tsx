import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">
            Dashboard
          </h1>

          <p className="text-neutral-500 mt-2">
            Overview of your media processing platform.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Videos"
            value="128"
          />

          <StatCard
            title="Jobs"
            value="43"
          />

          <StatCard
            title="Workers"
            value="3"
          />

          <StatCard
            title="Storage"
            value="14.2 GB"
          />
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-sm text-neutral-500">
        {title}
      </p>

      <p className="text-3xl font-semibold mt-2">
        {value}
      </p>
    </div>
  );
}
