import Sidebar from "../../components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Sidebar />
      <main style={{ flex: 1, position: "relative", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#f5f5f5",
            border: "1px solid #1a1a1a",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "13px",
            maxWidth: "480px",
            lineHeight: "1.5",
          },
          duration: 8000,
        }}
      />
    </div>
  );
}