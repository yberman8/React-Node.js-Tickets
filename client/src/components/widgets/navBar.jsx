import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Menu, AppBar, Box, Toolbar, IconButton, Typography, InputBase, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogOut from '@mui/icons-material/LogoutRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSearch } from '../../context/searchContext'; // Adjust the import path as needed
import Auth from '../../services/auth.service';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function NavBar() {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [pages, setPages] = useState(null);
    const { isAdmin, setIsAdmin, isAuth, logout } = useAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();
    const userPages = [{ name: 'פניות', path: 'tickets' }];
    const adminPages = [{ name: 'פניות', path: 'tickets' }, { name: 'משתמשים', path: 'users' }];

    useEffect(() => {
        if(isAuth()){
            const role = Auth.getUserRole();
                role === 'admin' ? setPages(adminPages) : setPages(userPages);
            setAuthenticated(true);
        }else{
            setAuthenticated(false);
        }
    }, [isAdmin]);

    const swichToAdmin = () => {
        localStorage.setItem("token", localStorage.getItem("tokenAdmin"));
        localStorage.removeItem("tokenAdmin");
        setIsAdmin(true);
        navigate('/users');
    }

    return (
        <>
            {authenticated && <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
                <AppBar position="static">
                    <Toolbar>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            מערכת פניות
                        </Typography>
                        {pages && pages.map((page) => (
                            <MenuItem key={page} onClick={() => navigate('/' + page.path.toLowerCase())}>
                                <Typography textAlign="center">{page.name}</Typography>
                            </MenuItem>
                        ))}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 1, textAlign: 'center' }}>
                            <Typography variant="h8">
                                היי {Auth.getUserName()}
                            </Typography>
                            <Typography variant="h8">
                                {Auth.getUserEmail()}
                            </Typography>
                        </Box >
                        <IconButton
                            size="small"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            color="inherit"
                            sx={{ marginRight: 3 }}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {localStorage.getItem("tokenAdmin") && <MenuItem onClick={() => swichToAdmin()}>
                                חזור לניהול
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    sx={{ marginLeft: 1 }}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </MenuItem>}
                            <MenuItem onClick={() => console.log("ff")}>
                                אזור אישי
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    sx={{ marginLeft: 1 }}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </MenuItem>
                            <MenuItem onClick={() => logout()}>
                                התנתק
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    sx={{ marginLeft: 3 }}
                                >
                                    <LogOut />
                                </IconButton>
                            </MenuItem>
                        </Menu>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
            </Box>}
        </>
    );
}

