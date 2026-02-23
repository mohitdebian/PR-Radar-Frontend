import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ScanProvider } from "./context/ScanContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScanProvider>
          <App />
          <Analytics />
        </ScanProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
