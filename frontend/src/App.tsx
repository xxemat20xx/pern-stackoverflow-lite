import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';
import QuestionsPage from './pages/QuestionsPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route
        path="/ask"
        element={
          <ProtectedRoute>
            <AskQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/questions" replace />} />

      {/* ✅ This MUST be after /questions but before the wildcard */}
      <Route path="/questions/:id" element={<QuestionDetailPage />} />

      {/* ❌ Wildcard at the very end */}
      <Route path="*" element={<Navigate to="/questions" replace />} />
    </Routes>
  );
};

export default App;