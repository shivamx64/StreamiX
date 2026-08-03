import Link from "next/link";

export type DocsSection = {
  id: string;
  label: string;
};

type DocsSidebarProps = {
  sections: DocsSection[];
};

export function DocsSidebar({ sections }: DocsSidebarProps) {
  return (
    <nav
      aria-label="Documentation navigation"
      className="space-y-1"
    >
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`#${section.id}`}
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          {section.label}
        </Link>
      ))}
    </nav>
  );
}
