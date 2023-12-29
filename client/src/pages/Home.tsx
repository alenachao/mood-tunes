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
    const [selectedTrack, setSelectedTrack] = useState(null); // to set track for webplayer, change when track is selected from search
    const [searchState, setSearchState] = useState(true); // to flip between search bar and webplayer
    const [calendarTrack, setCalendarTrack] = useState(null) // to set track for calendar, change when track is submitted

    
    const handleSearchButtonClick = (track) => {
        setSelectedTrack(track); // after a track is selected from search, we will set it as track to play on webplayer
        setSearchState(false); // we will also replace search results with webplayer
    };

    // if user changes their mind after selecting a song, they can go back and re-search
    const handleBackButtonClick = () => {
        setSearchState(true);
      };

    // if user likes their pick they submit it where it will be shown on the calendar (TODO: added to database)
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
                // Log the response data on the client side
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
        <Container sx={{ py: 2, position: 'relative' }}>
            <Header />
                <Stack direction="row" spacing={10} justifyContent='center' margin="5em" >
                    <Calendar dateState={dateState} setDateState={setDateState} track={calendarTrack}/>
                    <Stack direction="column" >
                        <Typography textAlign="center" variant="h1">
                            How do you feel today?
                        </Typography>
                        <Typography textAlign="center" variant="subtitle1">
                            {moment(dateState).format('MMMM Do YYYY')}
                        </Typography>
                        {searchState ? (
                            <SearchBar onButtonClick={handleSearchButtonClick} />
                        ) : (
                            <>
                            <button onClick={handleBackButtonClick}>Back</button>
                            <button onClick={handleSubmitButtonClick}>Submit</button>
                            <WebPlayback token={token} selectedTrack={selectedTrack} />
                            </>
                        )}
                    </Stack>
                </Stack>
            <Header />
        </Container>
    );
  }

