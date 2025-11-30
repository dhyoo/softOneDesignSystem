/**
 * SoftOne Design System - SPA Shell Entry Point
 * Vite + React SPA 애플리케이션 엔트리
 *
 * 구조: ReactDOM → QueryClientProvider → BrowserRouter → NavigationProvider → SpaAppShell
 */

// ag-Grid v31+ 모듈 등록 (반드시 가장 먼저!)
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@core/api/queryClient";
import { SpaAppShell } from "./SpaAppShell";
import { SpaNavigationProvider } from "./SpaNavigationProvider";

// Global Styles
import "@core/styles/globals.css";

// ========================================
// App Root
// ========================================

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* TanStack Query Provider */}
    <QueryClientProvider client={queryClient}>
      {/* React Router (SPA) */}
      <BrowserRouter>
        {/* Navigation Abstraction Provider */}
        <SpaNavigationProvider>
          {/* App Shell (ErrorBoundary + Layout) */}
          <SpaAppShell />
        </SpaNavigationProvider>
      </BrowserRouter>

      {/* React Query Devtools (Development Only) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
