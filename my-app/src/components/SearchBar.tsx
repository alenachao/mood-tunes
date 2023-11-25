import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const client_id = "afc1c3fdddba45398ae584c56ea24a2c";
const client_secret = "1790c9ad7d9d4ac7bc84f1b6f4e363ac";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                //'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credientials&client_id=' + client_id + '&client_secret' + client_secret
        }

        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))

        // var authParameters = {
        //     method: 'POST',
        //     url: 'https://accounts.spotify.com/api/token',
        //     headers: {
        //     'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        //     },
        //     form: {
        //     grant_type: 'client_credentials'
        //     },
        //     json: true
        // };
        
        
        // });
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        var tracks = await fetch('https://api.spotify.com/v1/search?q=' + searchQuery + '&type=artist', trackParameters)
            .then(response => response.json())
            .then(data => console.log(data))
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