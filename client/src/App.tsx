import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationProvider } from "./context/LocationContext";
import { NotificationProvider } from "./context/NotificationContext";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // No need to wait for Google Maps as we're using Leaflet now
  const [appReady, setAppReady] = useState(false);

  // Set the app as ready after a short delay to ensure all resources are loaded
  useEffect(() => {
    // Small delay to ensure React is fully mounted before rendering maps
    const timer = setTimeout(() => {
      console.log("Application ready to render");
      setAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <NotificationProvider>
            <Toaster />
            {appReady ? (
              <Router />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-neutral-100">
                <div className="text-center">
                  <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-neutral-400">Loading application...</p>
                </div>
              </div>
            )}
          </NotificationProvider>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
