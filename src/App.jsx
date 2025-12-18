import { Routes, Route } from 'react-router-dom';
import Deshboard from './pannel/deshboard';
import HomePage from './pannel/homePage';
import Login from './public/login.jsx';
import MyRoute from './routes/MyRoute';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MyRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
