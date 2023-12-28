import React, { useState, useEffect } from 'react';

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
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
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

                            <img src={props.selectedTrack.album.images[0].url} className="now-playing__cover" alt="" />

                            <div className="now-playing__side">
                                <div className="now-playing__name">{props.selectedTrack.name}</div>
                                <div className="now-playing__artist">{props.selectedTrack.artists[0].name}</div>

                                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                    { is_paused ? "PLAY" : "PAUSE" }
                                </button>

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