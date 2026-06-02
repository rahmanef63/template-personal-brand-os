"use client";

// Root error boundary — replaces the whole document if the root layout itself
// throws. Must render its own <html>/<body> and avoid app providers/themes.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0b0b0c",
          color: "#e7e7e7",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.25rem", margin: 0 }}>Aplikasi error</h1>
          <p style={{ color: "#9a9a9a", marginTop: 8, fontSize: ".9rem" }}>
            Terjadi kesalahan tak terduga. Muat ulang halaman.
          </p>
          {error?.digest && (
            <p style={{ color: "#6a6a6a", fontSize: ".75rem", marginTop: 8 }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "0.55rem 1.1rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#e7e7e7",
              color: "#0b0b0c",
              fontWeight: 600,
            }}
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
