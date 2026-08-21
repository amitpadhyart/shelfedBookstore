"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#EFEAE0", color: "#221F1A" }}>
        <div style={{ maxWidth: 480, margin: "6rem auto", textAlign: "center", padding: "0 1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>Shelfed hit a snag.</h1>
          <p style={{ marginBottom: "1.5rem", color: "#55503F" }}>
            Something broke at the top level. Reloading usually fixes it.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#2F4538",
              color: "#F5F2EA",
              border: "none",
              borderRadius: 2,
              padding: "0.65rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
