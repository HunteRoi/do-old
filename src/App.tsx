import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';

import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import UnRequireAuth from './components/UnRequireAuth';
import EventPage from './pages/EventPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { dooldTheme } from './theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={dooldTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/login' element={<UnRequireAuth routeWhenAuthenticated='/'><LoginPage /></UnRequireAuth>} />
              <Route path='/' element={<RequireAuth routeWhenUnauthenticated='/login'><HomePage /></RequireAuth>} />
              <Route path='/event/:id' element={<RequireAuth routeWhenUnauthenticated='/login'><EventPage /></RequireAuth>} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
