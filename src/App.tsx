
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
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TimesheetsPage from "./pages/TimesheetsPage";
import OvertimeRequestPage from "./pages/OvertimeRequestPage";
import OutsourceReviewPage from "./pages/OutsourceReviewPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import EnvironmentSetupPage from "./pages/EnvironmentSetupPage";
import EnvironmentSetupDetailPage from "./pages/EnvironmentSetupDetailPage";

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
            <Route path="/users" element={<AppLayout><UserManagement /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><UserProfile /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            
            {/* Timesheet module routes */}
            <Route path="/timesheets" element={<AppLayout><TimesheetsPage /></AppLayout>} />
            <Route path="/timesheets/overtime" element={<AppLayout><OvertimeRequestPage /></AppLayout>} />
            
            {/* Outsource Review module routes */}
            <Route path="/reviews" element={<AppLayout><OutsourceReviewPage /></AppLayout>} />
            <Route path="/reviews/:id" element={<AppLayout><ReviewDetailPage /></AppLayout>} />
            
            {/* Environment Setup module routes */}
            <Route path="/environment-setup" element={<AppLayout><EnvironmentSetupPage /></AppLayout>} />
            <Route path="/environment-setup/:id" element={<AppLayout><EnvironmentSetupDetailPage /></AppLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
