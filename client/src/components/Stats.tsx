import React, { useState, useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Grid } from '@mui/material';
import "@/assets/css/SearchBar.css";

export default function Stats({ dateState }) {
    const [tracksForMonth, setTracksForMonth] = useState([]);

    // get track given date, if no track then return null
    const getTrackForDate = async (date) => {
        const parameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'string',
        },
        };

        const response = await fetch('/api/tracks/query?q=' + date, parameters);
        const responseBody = await response.json();
        return responseBody.track;
    };

    // get tracks for the previous month
    const fetchTracksForPrevMonth = async () => {
        const firstDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth(), 0);

        const daysInMonth = [];
        let currentDate = firstDayOfMonth;

        while (currentDate <= lastDayOfMonth) {
            daysInMonth.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const trackPromises = daysInMonth.map(async (date) => ({
            date: date.toISOString().split('T')[0],
            track: await getTrackForDate(date.toISOString().split('T')[0]),
        }));

        const tracks = await Promise.all(trackPromises);
        setTracksForMonth(tracks);
    };

    useEffect(() => {
        fetchTracksForPrevMonth();
    }, []);

    return (
        <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Stack spacing={1}>
                {tracks.map( (track, i) => {
                    return (
                        <Button 
                            key={i} 
                            variant="contained" 
                            startIcon = { <img src={track.album.images[0].url}/> } 
                            className="leftAlignedButton" 
                        >
                            <span style={{ textTransform: 'none' }}> { track.name } <br /> { track.artists[0].name } <br /> valence: {track.valence} </span>
                        </Button>
                    )
                })}
            </Stack> 
            
        </Grid>
    );
}