import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;