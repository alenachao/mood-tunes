import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { changeMode } from '@/features/user/userSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.user.mode);
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    News
                </Typography>
                <Button color="inherit">Login</Button>
                <IconButton onClick={() => dispatch(changeMode())}>
                    <Brightness4Icon
                    sx={{
                        transition: 'transform 0.4s',
                        transform: mode === 'dark' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                    />
                </IconButton>
            </Toolbar>
        </AppBar>
        
        </Box>
    );
    }