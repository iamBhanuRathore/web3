import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { SolanaProvider } from "./providers/solana-provider.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="user-web-3-client-theme">
        <SolanaProvider>
          <App />
        </SolanaProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
