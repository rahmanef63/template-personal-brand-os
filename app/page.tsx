import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="max-w-xl space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">personal-brand-os</h1>
        <p className="text-muted-foreground">
          Scaffolded with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">rahman-resources</code>.
          Drop in a layout next:
        </p>
      </div>
      <pre className="rounded-md bg-muted px-4 py-3 text-left text-sm">
{`npx rahman-resources add personal-brand-os .
npx rahman-resources add landing-bento .
npx rahman-resources list`}
      </pre>
      <Button asChild>
        <Link href="https://github.com/rahmanef63/resource-site" target="_blank" rel="noreferrer">
          Browse the kitab
        </Link>
      </Button>
    </main>
  );
}
