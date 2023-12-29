import * as React from 'react';
import { useEffect } from 'react';
import Calendar from 'react-calendar'
import { styled } from '@mui/material';
import 'react-calendar/dist/Calendar.css'
import "@/assets/css/Calendar.css";
import { useTheme } from '@mui/material/styles';

  export default function StyledComponents({dateState, setDateState}) {
    const theme = useTheme();

    useEffect(() => {
      // if the user previously selected a tracks, load them onto the calendar
      const tileContent = async ({ date, view }) => {
        if (view === 'month') {
          const formattedDate = date.toISOString().split('T')[0];

          // Check if there is a for the selected date
          var parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'string',
              },
          } 

          const response = await fetch("/api/tracks/query?q=" + formattedDate, parameters);
          const responseBody = await response.json();
          const track = responseBody.track

          // if there is a track, display it. else display nothing.
          if (track) {
            return (
                  <img src={track.album.images[0].url} alt={track.name}/>
            );
          }
        }
        return null;
      };
    }, []);

    const MyCalendar = styled(Calendar)({
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    });

    return <MyCalendar value={dateState} onChange={setDateState} tileContent={tileContent}/>;
  }