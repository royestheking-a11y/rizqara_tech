import { ErrorBoundary } from './components/ErrorBoundary';

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./styles/premium-experience.css";
import "./styles/home-editorial.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary><App /></ErrorBoundary>
  </HelmetProvider>
);
