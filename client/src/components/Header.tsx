import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Stack} from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Header() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("")
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {

        // open the logout URL in a new tab
        const newTab = window.open('https://accounts.spotify.com/en/logout', '_blank');

        // close the new tab after a short delay
        setTimeout(() => {
            newTab.close();
            // Redirect the current tab to the login page
            window.location.href = '/login';
        }, 1000); // Adjust the delay as needed

        // close the menu
        setAnchorEl(null);
    };

    // get username and image url
    useEffect(() => {
        async function getUserInfo() {
            const response = await fetch('/api/auth/user');
            const json = await response.json();
            setUsername(json.username);
            setProfilePicture(json.pfp);
        }
        getUserInfo();

    }, []);

    return (
        <AppBar position="static" style={{borderRadius: '10px', marginTop: '2em', marginBottom:'2em' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <SentimentSatisfiedAltIcon style={{ fill: "#1DB954" }} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    
                </Typography>
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        color="inherit" 
                        style={{textTransform:"none", fontSize:"16px"}}
                        
                    >
                        <Stack direction='row' spacing={2}>
                                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                                        { username }
                                        </Typography>
                                        <img src={profilePicture} style={{borderRadius:"50%"}}/>
                                    </Stack>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        sx: {
                            bgcolor: '#212121', 
                        },
                        }}
                        
                    >
                        <MenuItem onClick={handleClose}>
                                Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
    }