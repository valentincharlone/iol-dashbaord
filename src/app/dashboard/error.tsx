"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard error]", error);
  }, [error]);

  const is401 = error.message?.includes("401");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E8ECF4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "36px 40px",
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#FFF1F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 22,
          }}
        >
          ⚠
        </div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1B1F3B",
            margin: "0 0 8px",
          }}
        >
          {is401 ? "Sesión con IOL expirada" : "Algo salió mal"}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#6E7191",
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          {is401
            ? "No se pudo conectar con la API de InvertirOnline. El token fue rechazado."
            : "Ocurrió un error al cargar el portafolio. Podés reintentar o recargar la página."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              background: "#4338CA",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              color: "#6E7191",
              border: "1px solid #E8ECF4",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Recargar
          </button>
        </div>
      </div>
    </div>
  );
}
