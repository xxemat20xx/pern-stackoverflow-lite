import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import useAuthStore from './store/authStore';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { checkUser, user } = useAuthStore();

  useEffect(() => {
    console.log('api: ', import.meta.env.VITE_API_URL);
    console.log('checkUser:', user);
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App