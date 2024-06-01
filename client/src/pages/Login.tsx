import  React, { useEffect, useRef} from 'react';
import { Typography, Stack, Button} from '@mui/material';
import Video from "@/assets/login-page-background.mp4"
import "@/assets/css/Login.css";



function LoginPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65; // Adjust the playback speed as needed
    }
  }, []);

  return (
    <div className="video-background">
       <video autoPlay loop muted controls={false} ref={videoRef}>
        <source src={ Video } type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
      <div className="content">
            <Stack spacing={2} alignItems="center">
              <Typography variant="h1" style={{color:"#1DB954", fontSize:'100px'}}>
                Mood Tunes
              </Typography>
              <Typography variant="h3">
                Sometimes it's hard to express our feelings through words. Why not try doing it through music?
              </Typography>
              <Typography variant="h6" style={{color:"#1DB954", marginTop:"2em"}}>
                Get started by logging into your Spotify account below.
              </Typography>
              <Button className="btn-spotify" variant="h4" href="/api/auth/authorize" style={{color:"white", background:"#141414", textTransform:"none", width:"50%", padding:"1em"}}>
                  Login with Spotify 
              </Button>
            </Stack>
      </div>
    </div>
  );
}

export default LoginPage;
