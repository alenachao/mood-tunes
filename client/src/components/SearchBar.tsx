import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Stack, Container } from '@mui/material';
import "@/assets/css/SearchBar.css";

const client_id = "afc1c3fdddba45398ae584c56ea24a2c";
const client_secret = "1790c9ad7d9d4ac7bc84f1b6f4e363ac";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [response, setResponse] = useState("");
    const [tracks, setTracks] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log('submit');
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'string',
              },
        }
        var returnedTracks = await fetch('http://localhost:8080/?q=' + encodeURIComponent(searchQuery), trackParameters)
            //.then(tracks => console.log('success?'))
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTracks(data.tracks.items)
            })
    }
    //console.log(tracks);
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
                        <Button key={i} component="results" variant="contained" startIcon = { <img src={track.album.images[0].url}/> } className="leftAlignedButton" >
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