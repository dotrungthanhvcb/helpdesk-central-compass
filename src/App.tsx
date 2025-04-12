
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/tickets" element={<AppLayout><TicketList /></AppLayout>} />
            <Route path="/tickets/new" element={<AppLayout><CreateTicket /></AppLayout>} />
            <Route path="/tickets/:id" element={<AppLayout><TicketDetail /></AppLayout>} />
            <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
