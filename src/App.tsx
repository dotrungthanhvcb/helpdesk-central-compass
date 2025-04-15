
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
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
import WorkLogFormPage from "./pages/WorkLogFormPage";
import LeaveRequestFormPage from "./pages/LeaveRequestFormPage";
import OutsourceReviewPage from "./pages/OutsourceReviewPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import EnvironmentSetupPage from "./pages/EnvironmentSetupPage";
import EnvironmentSetupDetailPage from "./pages/EnvironmentSetupDetailPage";
import ContractsPage from "./pages/contracts/ContractsPage";
import ContractDetailPage from "./pages/contracts/ContractDetailPage";
import CreateContractPage from "./pages/contracts/CreateContractPage";
import SquadAllocationPage from "./pages/contracts/SquadAllocationPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
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
            <Route path="/timesheets/overtime/new" element={<AppLayout><OvertimeRequestPage /></AppLayout>} />
            <Route path="/timesheets/worklog/new" element={<AppLayout><WorkLogFormPage /></AppLayout>} />
            <Route path="/timesheets/leave/new" element={<AppLayout><LeaveRequestFormPage /></AppLayout>} />
            
            {/* Outsource Review module routes */}
            <Route path="/reviews" element={<AppLayout><OutsourceReviewPage /></AppLayout>} />
            <Route path="/reviews/:id" element={<AppLayout><ReviewDetailPage /></AppLayout>} />
            
            {/* Environment Setup module routes */}
            <Route path="/environment-setup" element={<AppLayout><EnvironmentSetupPage /></AppLayout>} />
            <Route path="/environment-setup/:id" element={<AppLayout><EnvironmentSetupDetailPage /></AppLayout>} />

            {/* Contracts & Assignment module routes */}
            <Route path="/contracts" element={<AppLayout><ContractsPage /></AppLayout>} />
            <Route path="/contracts/new" element={<AppLayout><CreateContractPage /></AppLayout>} />
            <Route path="/contracts/:id" element={<AppLayout><ContractDetailPage /></AppLayout>} />
            <Route path="/squad-allocation" element={<AppLayout><SquadAllocationPage /></AppLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
