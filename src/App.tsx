import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import RequireAuth from './components/RequireAuth';
import UnRequireAuth from './components/UnRequireAuth';
import EventPage from './pages/event';
import HomePage from './pages/home';
import LoginPage from './pages/login';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UnRequireAuth routeWhenAuthenticated='/'><LoginPage /></UnRequireAuth>} />
        <Route path='/' element={<RequireAuth routeWhenUnauthenticated='/login'><HomePage /></RequireAuth>} />
        <Route path='/event/:id' element={<RequireAuth routeWhenUnauthenticated='/login'><EventPage /></RequireAuth>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
