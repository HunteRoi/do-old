import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-au';
dayjs.locale('en-au'); // to get monday as first weekday

import { dooldTheme } from './theme';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import RequireUnauth from './components/RequireUnauth';
import EventPage from './pages/EventPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import EventsPage from './pages/EventsPage';
import NewEventPage from './pages/NewEventPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={dooldTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/login' element={<RequireUnauth routeWhenAuthenticated='/'><LoginPage /></RequireUnauth>} />
              <Route path='/' element={<RequireAuth routeWhenUnauthenticated='/login'><HomePage /></RequireAuth>} />
              <Route path='/new' element={<RequireAuth routeWhenUnauthenticated='/login'><NewEventPage /></RequireAuth>} />
              <Route path='/events' element={<RequireAuth routeWhenUnauthenticated='/login'><EventsPage /></RequireAuth>} />
              <Route path='/event/:id' element={<RequireAuth routeWhenUnauthenticated='/login'><EventPage /></RequireAuth>} />
              <Route path='/privacypolicy' element={<PrivacyPolicyPage />} />
              <Route path='/terms' element={<TermsPage />} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
