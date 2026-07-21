import { HardDrive } from "lucide-react";

import { StatCard } from "./stat-card";

export function StorageCard() {
  return (
    <StatCard
      title="Storage Used"
      value="2.4 TB"
      subtitle="AWS S3"
      icon={<HardDrive className="h-6 w-6 text-stone-400" />}
    />
  );
}