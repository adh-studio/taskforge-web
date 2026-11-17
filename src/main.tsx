import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BoardProvider } from "@/state/BoardContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import "./styles/app.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Element racine introuvable.");
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </ThemeProvider>
  </StrictMode>,
);
