import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import RequireAuth from './components/RequireAuth';
import UnRequireAuth from './components/UnRequireAuth';
import HomePage from './pages/home';
import LoginPage from './pages/login';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RequireAuth routeWhenUnauthenticated='/login'><HomePage /></RequireAuth>} />
        <Route path='/login' element={<UnRequireAuth routeWhenAuthenticated='/'><LoginPage /></UnRequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
