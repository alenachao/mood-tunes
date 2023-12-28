import * as React from 'react';
import Calendar from 'react-calendar'
import { styled } from '@mui/material';
import 'react-calendar/dist/Calendar.css'
import "@/assets/css/Calendar.css";
import { useTheme } from '@mui/material/styles';
import { isSameDay } from "date-fns";

  export default function StyledComponents({dateState, setDateState, track}) {
    const theme = useTheme();

    const show = ({ date, view }) => {
      if (view === "month" && track) {
        if (isSameDay(date, dateState)) {
          return <img src={track.album.images[0].url}/>;
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

    return <MyCalendar value={dateState} onChange={setDateState} tileContent={show}/>;
  }