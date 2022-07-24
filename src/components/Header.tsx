import { AppBar, Container, IconButton, Typography, Toolbar, Box, Tooltip, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { CalendarMonth, EventOutlined, LogoutOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import getPhotoURL from '../hooks/getPhotoURL';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../config/firebase';
import NewBadge from './NewBadge';

const Header: React.FC = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const onSignOutClick = async () => {
        setProvider(null);
        setPhotoURL(null);

        await signOut();

        handleCloseUserMenu();
        navigate('/login');
    };
    const onEventsClick = () => navigate('/events');
    const onCreateNewClick = () => navigate('/new');

    const [provider, setProvider] = useState<string | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        const checkAuthentication = onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                const providerData = auth.currentUser?.providerData[0];
                if (providerData) {
                    const url = await getPhotoURL(providerData);
                    setPhotoURL(url);
                }
                setProvider(providerData?.providerId ?? null);
            } else {
                setPhotoURL(null);
                setProvider(null);
            }
        });

        return checkAuthentication();
    }, [auth, auth.currentUser]);

    return <AppBar position='static'>
        <Container maxWidth='xl'>
            <Toolbar disableGutters>
                <Typography component={Link} to='/' sx={{ textDecoration: 'none', color: 'inherit' }}>
                    <EventOutlined sx={{ display: { md: 'flex' }, mr: 1 }} />
                </Typography>

                <Typography variant='h6' noWrap component={Link} to='/' sx={{
                    mr: 2, display: { md: 'flex' },
                    fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem',
                    color: 'inherit', textDecoration: 'none'
                }}>
                    DoOld
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                { auth && auth.currentUser && <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title='Open settings'>
                        <NewBadge>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={auth.currentUser.displayName ?? undefined} src={photoURL ?? undefined} />
                            </IconButton>
                        </NewBadge>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id='menu-appbar'
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem disabled>
                            <Typography variant='inherit'>Via {provider}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem key='events' onClick={onCreateNewClick}>
                            <ListItemIcon>
                                <EventOutlined fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography textAlign='center'>Create new</Typography>
                            </ListItemText>
                        </MenuItem>
                        <MenuItem key='events' onClick={onEventsClick}>
                            <ListItemIcon>
                                <NewBadge>
                                    <CalendarMonth fontSize='small'/>
                                </NewBadge>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography textAlign='center'>Your events</Typography>
                            </ListItemText>
                        </MenuItem>
                        <MenuItem key='logout' onClick={onSignOutClick}>
                            <ListItemIcon>
                                <LogoutOutlined fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography textAlign='center'>Log out</Typography>
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>}
            </Toolbar>
        </Container>
    </AppBar>;
};

export default Header;