import { useNavigate } from 'react-router-dom';

import { Button, Typography, Box } from '@mui/material';
import { EventOutlined, CalendarMonth } from '@mui/icons-material';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='75vh'>
        <Typography variant='h3' mb={2}>Quick Access</Typography>
        <Box display='flex' flexDirection='row' gap={1}>
            <Button variant='contained' startIcon={<EventOutlined />} onClick={() => navigate('/new')}>Create New</Button>
            <Button variant='outlined' startIcon={<CalendarMonth />} onClick={() => navigate('/events')}>Your Events</Button>
        </Box>
    </Box>;
};

export default HomePage;