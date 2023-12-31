import { React, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Stack} from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

export default function Header() {
   const [username, setUsername] = useState("");
   const [profilePicture, setProfilePicture] = useState("")

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
                    Coming Soon: Spotify Stats, Mood Analysis, and Personal Playlists :)
                </Typography>
                <Button color="inherit" style={{textTransform:"none", fontSize:"16px"}}>
                    <Stack direction='row' spacing={2}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        { username }
                        </Typography>
                        <img src={profilePicture}/>
                    </Stack>
                </Button>
            </Toolbar>
        </AppBar>
    );
    }