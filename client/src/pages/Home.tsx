import  React, {useState, useEffect} from 'react';
import Calendar from '@/components/Calendar'
import { Typography, Stack, Container, makeStyles } from '@mui/material';
import moment from 'moment'
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import WebPlayback from '@/components/WebPlayback'

export default function HomePage() {
    const [dateState, setDateState] = useState(new Date()); // for calendar
    const [token, setToken] = useState(''); // for spotify api
    const [selectedTrack, setSelectedTrack] = useState(null); // from search bar for webplayback

    // after a track is selected from search, we will set it as track we want to play
    const handleButtonClick = (track) => {
        setSelectedTrack(track);
    };

    // get token from backend
    useEffect(() => {

        async function getToken() {
        const response = await fetch('/auth/token');
        const json = await response.json();
        setToken(json.access_token);
        }

        getToken();

    }, []);

    return (
        <Container sx={{ py: 2, position: 'relative' }}>
            <Header />
            <Stack direction="row" spacing={10} justifyContent='center' margin="5em" >
            <Calendar dateState={dateState} setDateState={setDateState}/>
            
            <Stack direction="column" >
                <Typography textAlign="center" variant="h1">
                    How do you feel today?
                </Typography>
                <Typography textAlign="center" variant="subtitle1">
                    {moment(dateState).format('MMMM Do YYYY')}
                </Typography>

                <SearchBar onButtonClick={handleButtonClick} />
                <WebPlayback token={token} selectedTrack={selectedTrack} />

            </Stack>
            </Stack>
            <Header />
        </Container>
    );
  }

