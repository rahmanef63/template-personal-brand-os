import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-md">
        <p className="font-display text-6xl font-semibold tracking-tight text-brand">404</p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mungkin sudah dipindah atau dihapus.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Kembali ke beranda</Link>
        </Button>
      </div>
    </div>
  );
}
