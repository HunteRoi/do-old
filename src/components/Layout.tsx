import { PropsWithChildren } from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component='main' sx={{ mt: 1, mb: 1 }} maxWidth='md'>
            {children}
        </Container>
        <Footer />
    </Box>;
};

export default Layout;