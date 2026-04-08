import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import QuizDetails from './pages/QuizDetails';
import Play from './pages/Play';
import Result from './pages/Result';
import Profile from './pages/Profile';
import MyQuizzes from './pages/MyQuizzes';
import CreateQuiz from './pages/CreateQuiz';
import Templates from './pages/Templates';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';

import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/quiz/:id" element={<QuizDetails />} />
              
              {/* Protected Routes */}
              <Route path="/quiz/:id/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
              <Route path="/quiz/:id/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/my-quizzes" element={<ProtectedRoute><MyQuizzes /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              
              {/* Public Auth Routes */}
              <Route path="/templates" element={<Templates />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
