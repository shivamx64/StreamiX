import { Cpu } from "lucide-react";

import { StatCard } from "./stat-card";

export function CpuCard() {
  return (
    <StatCard
      title="CPU Usage"
      value="61%"
      subtitle="Across Workers"
      icon={<Cpu className="h-6 w-6 text-stone-400" />}
    />
  );
}