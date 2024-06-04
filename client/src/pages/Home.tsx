import  React, {useState, useEffect} from 'react';
import Calendar from '@/components/Calendar'
import { Typography, Stack, Container, Grid, Button} from '@mui/material';
import moment from 'moment'
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import WebPlayback from '@/components/WebPlayback'
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';

export default function HomePage() {
    const [dateState, setDateState] = useState(new Date()); // for calendar
    const [token, setToken] = useState(''); // for spotify api
    const [selectedTrack, setSelectedTrack] = useState(null); // to set track for webplayer, change when track is selected from search
    const [searchState, setSearchState] = useState(true); // to flip between search bar and webplayer
    const [calendarTrack, setCalendarTrack] = useState(null); // to set track for calendar, change when track is submitted
    const today = new Date();

    const handleSearchButtonClick = (track) => {
        setSelectedTrack(track); // after a track is selected from search, we will set it as track to play on webplayer
        setSearchState(false); // we will also replace search results with webplayer
    };

    // if user changes their mind after selecting a song, they can go back and re-search
    const handleBackButtonClick = () => {
        setSearchState(true);
      };

    // if user likes their pick they submit it where it will be shown on the calendar
    const handleSubmitButtonClick = async () => {
        setCalendarTrack(selectedTrack);
        setSearchState(true);

        // add dateState and track to database
        const date = dateState.toISOString().split('T')[0];
        var parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({date, selectedTrack}),
        }

        await fetch('http://localhost:5173/api/tracks/store', parameters).then(response => response.json())
            .then(data => {
                console.log('Server Response:', data);
            })
    };

    // get token from backend
    useEffect(() => {

        async function getToken() {
            const response = await fetch('/api/auth/token');
            const json = await response.json();
            setToken(json.access_token);
        }

        getToken();

    }, []);


    // if there is already a track for the date, set state to "currently playing," else set state to search
    useEffect(() => {

        async function trackAvailable() {
            const parameters = {
                method: 'GET',
                headers: {
                  'Content-Type': 'string',
                },
              };
              const date = dateState.toISOString().split('T')[0]
              const response = await fetch('/api/tracks/query?q=' + date, parameters);
              const responseBody = await response.json();
              if (responseBody.track) {
                setSelectedTrack(responseBody.track);
                setSearchState(false);
              } else {
                setSearchState(true);
              }
        }

        trackAvailable();

    }, [dateState]);

    return (
        <Container maxWidth={false} >
            <Header />
            <Grid container spacing={4} style={{padding:'0px'}} >
                <Grid item xs={7}>
                    <Calendar dateState={dateState} setDateState={setDateState} track={calendarTrack}/>
                </Grid>
                <Grid item xs={5}>
                    <Stack direction="column" alignItems="center" spacing={2} style={{backgroundColor: '#141414', borderRadius: '10px', padding:'2em', height:'100%'}}>
                        <Typography textAlign="center" variant="h2" style={{color:"#1DB954"}}>
                            How do you feel today?
                        </Typography>
                        <Typography textAlign="center" variant="h5">
                            {moment(dateState).format('MMMM Do YYYY')}
                        </Typography>
                        {searchState ? (
                            dateState.getMonth() == today.getMonth() ? (
                                <SearchBar onButtonClick={handleSearchButtonClick} />
                            ) : ( <></> )
                            
                        ) : (
                            <Stack direction="column" alignItems="center" textAlign="center" spacing={2} style={{width:"80%"}}>
                                <Typography textAlign="center" variant="subtitle1">
                                    Current Selection: <span style={{color:"#1DB954"}}>{selectedTrack.name} by {selectedTrack.artists[0].name}</span>
                                </Typography>
                                <WebPlayback token={token} selectedTrack={selectedTrack} />
                                { dateState.getMonth() == today.getMonth() ? (
                                    <Grid container spacing={1} textAlign="center">
                                        <Grid item xs={6}>
                                            <Button color="inherit" onClick={handleBackButtonClick} style={{color:"white", textTransform:"none", width:"100%"}}>Go back and select a new song</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button color="inherit" onClick={handleSubmitButtonClick} style={{color:"white", textTransform:"none",width:"100%", height:"100%"}} >Confirm song</Button>
                                        </Grid>
                                    </Grid>
                                ) : ( <></> )}
                                
                            </Stack>
                        )}
                    </Stack>
                </Grid> 
            </Grid>
            <Stats />
            <Footer />
        </Container>
    );
  }

