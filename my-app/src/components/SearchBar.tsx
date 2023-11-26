import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const client_id = "afc1c3fdddba45398ae584c56ea24a2c";
const client_secret = "1790c9ad7d9d4ac7bc84f1b6f4e363ac";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [response, setResponse] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('submit');
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'string',
              },
        }
        var tracks = await fetch('http://localhost:8080/?q=' + searchQuery + trackParameters)
            .then(tracks => console.log('success?'))
            // .then(response => response.json())
            // .then(data => console.log(data))
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

    //     </div>
    //   </div>
    );
}