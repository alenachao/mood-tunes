import React, { useState, useEffect } from 'react';
import {Button} from '@mui/material'

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'MoodTunes',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    // case where user has not transfered playback yet
    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Webplayer is not active. Make sure you are logged into a Spotify premium account. Transfer your playback using your Spotify app to start listening</b>
                    </div>
                </div>
            </>)
    } else {
        // user has made selection and can now play the song
        if (props.selectedTrack) {
            player.getCurrentState().then(state => {
                if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                }            
                state.track_window.current_track = props.selectedTrack;
                });
            
            return (
                <>
                    <div className="container">
                        <div className="main-wrapper">

                            

                            <div className="now-playing__side">
                                
                                <Button className="btn-spotify" color="inherit" onClick={() => { player.togglePlay() }} style={{color:"white", textTransform:"none"}}>
                                    <img src={props.selectedTrack.album.images[0].url} className="now-playing__cover" alt="" style={{borderRadius:"50%", marginRight:"1em"}}/>
                                    { is_paused ? "PLAY" : "PAUSE" }
                                </Button>

                            </div>
                        </div>
                    </div>
                </>
                );
        } else {
            // playback has been transfered but user has not made selection yet
            return (
                <>
                    <div className="container">
                        <div className="main-wrapper">
                            <b> Make a search to start playing! </b>
                        </div>
                    </div>
                </>)
        }
    }
}

export default WebPlayback