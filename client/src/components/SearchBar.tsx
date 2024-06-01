import React, { useState, } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Grid } from '@mui/material';
import "@/assets/css/SearchBar.css";

export default function Search({ onButtonClick }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [tracks, setTracks] = useState([]);

    // when user submits search, make a get request to server and get back a list of search results (tracks)
    async function handleSubmit(e) {
        e.preventDefault();
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'string',
              },
        }
        var returnedTracks = await fetch('/api/search?q=' + encodeURIComponent(searchQuery), trackParameters)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTracks(data.tracks.items)
            })
    }

    return (
        <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={10}>
                <form onSubmit={handleSubmit} id="search-component">
                    <TextField
                        id="search-bar"
                        className="text"
                        value={searchQuery}
                        onInput={(e) => {
                            setSearchQuery(((e.target as HTMLTextAreaElement)).value);
                        }}
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        style={{width:'85%'}}
                        InputProps={{
                            style: {
                              color: 'white',
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color: 'black',
                            },
                        }}
                    />

                    <IconButton type="submit" aria-label="search">
                        <SearchIcon style={{ fill: "#1DB954" }} />
                    </IconButton>
                </form>
            </Grid>
            <Stack spacing={1}>
                {tracks.map( (track, i) => {
                    return (
                        <Button 
                            key={i} 
                            variant="contained" 
                            startIcon = { <img src={track.album.images[0].url}/> } 
                            className="leftAlignedButton" 
                            onClick={() => onButtonClick(track)}
                        >
                            <span style={{ textTransform: 'none' }}> { track.name } <br /> { track.artists[0].name } </span>
                        </Button>
                    )
                })}
            </Stack> 
            
        </Grid>
    );
}