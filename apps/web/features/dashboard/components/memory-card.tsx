import { MemoryStick } from "lucide-react";

import { StatCard } from "./stat-card";

export function MemoryCard() {
  return (
    <StatCard
      title="Memory"
      value="8.2 GB"
      subtitle="Worker Cluster"
      icon={<MemoryStick className="h-6 w-6 text-stone-400" />}
    />
  );
}