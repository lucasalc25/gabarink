import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import StudyTrail from "./pages/StudyTrail";
import Arena from "./pages/Arena";
import Ranking from "./pages/Ranking";
import Templates from "./pages/Templates";
import Shop from "./pages/Shop";
import QuizPlayer from "./pages/QuizPlayer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/trail" element={<ProtectedRoute><StudyTrail /></ProtectedRoute>} />
              <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
              <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
              <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
              <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlayer /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
