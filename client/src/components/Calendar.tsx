import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Calendar from 'react-calendar'
import { styled } from '@mui/material';
import 'react-calendar/dist/Calendar.css'
import "@/assets/css/Calendar.css";
import { useTheme } from '@mui/material/styles';

  export default function StyledComponents({dateState, setDateState}) {
    const theme = useTheme();
    const [tracksForMonth, setTracksForMonth] = useState([]);

    // for when user goes to the next or previous month
    const handleViewChange = ({ action, activeStartDate, value, view }) => {
      var firstDayOfMonth = null;
      if (action === 'next') {
        // Update dateState to the first day of the new month
        firstDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth() + 1, 1);
      } else if (action === 'prev') {
        firstDayOfMonth = new Date(dateState.getFullYear(), dateState.getMonth() - 1, 1);
      }
        setDateState(firstDayOfMonth);
  
        // Fetch tracks for the new month
        fetchTracksForMonth(firstDayOfMonth);
    };

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

    // get tracks for the whole month given date so we can simultaneously update calendar
    const fetchTracksForMonth = async (selectedDate) => {
      const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
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

    const memoizedFetchTracks = useCallback(() => {
      fetchTracksForMonth(dateState);
    }, [dateState]);
  
    useEffect(() => {
      if (dateState) {
        memoizedFetchTracks();
      }
    }, [dateState, tracksForMonth]);

    // if the user previously selected a tracks for the month, load them onto the calendar
    const tileContent = ({ date, view }) => {
      if (view === 'month') {
        const selectedDateISOString = date.toISOString().split('T')[0];
        const trackForSelectedDate = tracksForMonth.find((trackInfo) => trackInfo.date === selectedDateISOString);
        if (trackForSelectedDate) {
          if (trackForSelectedDate.track) {
            return (
              <img src={trackForSelectedDate.track.album.images[0].url}/>
            );
          }
        }
      }
      return null;
    };

    const MyCalendar = styled(Calendar)({
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    });

    return <MyCalendar value={dateState} onChange={setDateState} tileContent={tileContent} onActiveStartDateChange={handleViewChange}/>;
  }