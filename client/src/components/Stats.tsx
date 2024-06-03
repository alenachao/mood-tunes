import React, { useState, useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Stats() {
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
        const dateState = new Date();
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

    // format data for barchart
    const categorizeValences = () => {
        const valenceCounts = {
            very_sad: 0,
            sad: 0,
            neutral: 0,
            happy: 0,
            very_happy: 0,
        };

        tracksForMonth.forEach(({ track }) => {
            if (track && track.valence !== undefined) {
                const valence = track.valence;
                if (valence >= 0.00 && valence <= 0.199) valenceCounts.very_sad++;
                else if (valence >= 0.200 && valence <= 0.399) valenceCounts.sad++;
                else if (valence >= 0.400 && valence <= 0.599) valenceCounts.neutral++;
                else if (valence >= 0.600 && valence <= 0.799) valenceCounts.happy++;
                else if (valence >= 0.800 && valence <= 1.00) valenceCounts.very_happy++;
            }
        });

        return valenceCounts;
    };
    const valenceCounts = categorizeValences();
    const data = [
        { category: 'Very Sad', count: valenceCounts.very_sad },
        { category: 'Sad', count: valenceCounts.sad },
        { category: 'Neutral', count: valenceCounts.neutral },
        { category: 'Happy', count: valenceCounts.happy },
        { category: 'Very Happy', count: valenceCounts.very_happy }
    ];

    // get top and bottom 5 tracks based on valence
    const getTopAndBottomTracks = () => {
        const validTracks = tracksForMonth.filter(({ track }) => track && track.valence !== undefined);
        validTracks.sort((a, b) => a.track.valence - b.track.valence);

        const bottom5Tracks = validTracks.slice(0, 5);
        const top5Tracks = validTracks.slice(-5).reverse();

        return { top5Tracks, bottom5Tracks };
    };
    const { top5Tracks, bottom5Tracks } = getTopAndBottomTracks();

    // export playlist
    const handleClick = async () => {
        const validTracks = tracksForMonth.filter(({ track }) => track);
        const body = JSON.stringify({
            playlistName: "test1",
            tracks: validTracks
        })
        const parameters = {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body
        };

        const response = await fetch('/api/tracks/playlist', parameters);
    }

    return (
        // <Grid container spacing={1} alignItems="center" justifyContent="center">
        //     <Stack spacing={1}>
        //         {tracks.map( (track, i) => {
        //             return (
        //                 <Button 
        //                     key={i} 
        //                     variant="contained" 
        //                     startIcon = { <img src={track.album.images[0].url}/> } 
        //                     className="leftAlignedButton" 
        //                 >
        //                     <span style={{ textTransform: 'none' }}> { track.name } <br /> { track.artists[0].name } <br /> valence: {track.valence} </span>
        //                 </Button>
        //             )
        //         })}
        //     </Stack> 
            
        // </Grid>
        <>
            <h2>Track Valences for the Previous Month</h2>
            <BarChart
                    dataset={ data }
                    xAxis={[{ dataKey: 'category', scaleType: 'band'}]}
                    yAxis={[{label:'Count'}]}
                    series={[{ dataKey: 'count'}]}
                    width={500}
                    height={300}
            />

            <h3>Top 5 Tracks by Valence</h3>
            <ul>
                {top5Tracks.map(({ track }, index) => (
                    <li key={index}>{track.name} by {track.artists[0].name} (Valence: {track.valence})</li>
                ))}
            </ul>

            <h3>Bottom 5 Tracks by Valence</h3>
            <ul>
                {bottom5Tracks.map(({ track }, index) => (
                    <li key={index}>{track.name} by {track.artists[0].name} (Valence: {track.valence})</li>
                ))}
            </ul>
            <Button onClick={handleClick}>export playlist</Button>
        </>
        

    );
}