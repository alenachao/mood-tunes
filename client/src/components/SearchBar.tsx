import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Stack, Container } from '@mui/material';
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
    //   <div
    //     style={{
    //       display: "flex",
    //       alignSelf: "center",
    //       justifyContent: "center",
    //       flexDirection: "column",
    //       padding: 20
    //     }}
    //   >
        <Stack spacing={1}>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="search-bar"
                    className="text"
                    value={searchQuery}
                    onInput={(e) => {
                        setSearchQuery(((e.target as HTMLTextAreaElement)).value);
                    }}
                    label="Search..."
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
            </form>
            <Stack spacing={1}>
                {tracks.map( (track, i) => {
                    return (
                        <Button 
                            key={i} 
                            component="results" 
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
            
        </Stack>

    //     </div>
    //   </div>
    );
}