import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useGetMeQuery } from './app/api';
import { setCredentials, logout } from './features/authSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, error } = useGetMeQuery(undefined, { skip: !token || !!user });

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials({ user: data.user, token }));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['manager', 'admin']}><Reports /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
