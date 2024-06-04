import React, { useState, useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import moment from 'moment'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function Stats() {
    const [tracksForMonth, setTracksForMonth] = useState([]);
    const dateState = new Date();
    // const year = dateState.getFullYear()
    const firstDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth() - 1, 1);
    const lastDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth(), 0);
    // const month = firstDayOfMonth.toLocaleString('default', { month: 'long' });

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
            playlistName: moment(firstDayOfMonth).format('MMMM YYYY'),
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

    const validTracks = tracksForMonth.filter(({ track }) => track);

    return (
        validTracks.length < 10 ? 
        <Stack direction="row" alignItems="flex-start" justifyContent='center' spacing={2} style={{backgroundColor: '#141414', borderRadius: '10px', padding:'2em', height:'100%', marginTop: '2em'}}>
            <h3>You need to log at least 10 songs in a month to get its statistics and export the songs into a playlist. Be sure to log at least 10 this month so you can see your results at the end!</h3>
        </Stack>
        :
        <Stack direction="row" alignItems="flex-start" justifyContent='center' spacing={2} style={{backgroundColor: '#141414', borderRadius: '10px', padding:'2em', height:'100%', marginTop: '2em'}}>
            <Stack direction="column" alignItems="center">
                <h2>Moods for {moment(firstDayOfMonth).format('MMMM YYYY')} </h2>
                <BarChart
                        dataset={ data }
                        xAxis={[{ dataKey: 'category', scaleType: 'band'}]}
                        yAxis={[{label:'Count'}]}
                        series={[{ dataKey: 'count', color: '#1DB954'}]}
                        width={500}
                        height={300}
                />
            </Stack>
            <Stack direction="column" alignItems="center" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="column" alignItems="center"  spacing={2}>
                        <h2>Top 5 Happiest Tracks</h2>
                        <List>
                            {top5Tracks.map(({ track }, index) => (
                                    <ListItem>
                                        <ListItemIcon>
                                            <img src={track.album.images[0].url}/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            {track.name} by {track.artists[0].name}
                                        </ListItemText>
                                    </ListItem>    
                                ))}
                        </List>
                    </Stack>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <h2>Top 5 Saddest Tracks</h2>
                        <List>
                            {bottom5Tracks.map(({ track }, index) => (
                                    <ListItem>
                                        <ListItemIcon>
                                            <img src={track.album.images[0].url}/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            {track.name} by {track.artists[0].name}
                                        </ListItemText>
                                    </ListItem>    
                                ))}
                        </List>
                            
                        
                    </Stack>
                </Stack>
                <Button color='inherit' variant="contained" onClick={handleClick} style={{textTransform:"none", width:'100%', backgroundColor: "black"}} > Export Playlist</Button>
            </Stack>
        </Stack>
            
    
        

    );
}