import React from "react";

export default function MainPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
            display: "flex",
        flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        background: "linear-gradient(120deg, #186697 0%, #ffe066 100%)",
              color: "#222",
        fontFamily: "'Montserrat', 'Arial', sans-serif",
        padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
          background: "rgba(255,255,255,0.95)",
              borderRadius: 24,
          boxShadow: "0 8px 32px rgba(24,102,151,0.18)",
              padding: "48px 32px",
          maxWidth: 420,
              width: "100%",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚫</div>
        <h1 style={{ fontSize: "2.1rem", fontWeight: 800, marginBottom: 18, color: "#186697" }}>
          Обслуживание сайта прекращено
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#444", marginBottom: 18, lineHeight: 1.6 }}>
          К сожалению, сайт <b>Nina Flowers</b> больше не обслуживается.<br />
          Причина: работодатель не оплатил работу по разработке сайта.
        </p>
        <div style={{ color: "#a0aec0", fontSize: "0.98rem", marginTop: 18 }}>
          Разработка: Daniil (Twelve Faced Janus) Ermolaev
            </div>
          </div>
              </div>
  );
}
