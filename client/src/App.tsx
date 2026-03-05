import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard from "@/pages/Dashboard";
import Screening from "@/pages/Screening";
import Result from "@/pages/Result";
import History from "@/pages/History";
import Information from "@/pages/Information";
import NotFound from "@/pages/not-found";

function Router() {
  // Local mode: no auth required, directly show all routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/screen" component={Screening} />
      <Route path="/result/:id" component={Result} />
      <Route path="/history" component={History} />
      <Route path="/info" component={Information} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
